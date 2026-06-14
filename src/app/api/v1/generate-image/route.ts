import { NextRequest, NextResponse } from "next/server";
import { GenerateSchema } from "@/lib/schemas";
import { ReplicateError, generatePosterWithReplicate } from "@/lib/replicate";
import { createServerClient } from "@/lib/supabase/server";
import type { GeneratedImageContent, Warung } from "@/lib/types";

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = GenerateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { data: warung, error: warungError } = await supabase
    .from("warung")
    .select("*")
    .eq("id", parsed.data.warung_id)
    .eq("owner_id", user.id)
    .maybeSingle<Warung>();

  if (warungError) {
    return NextResponse.json(
      { error: `Failed to read warung: ${warungError.message}` },
      { status: 500 },
    );
  }

  if (!warung) {
    return NextResponse.json({ error: "Warung not found" }, { status: 404 });
  }

  try {
    const imageUrl = await generatePosterWithReplicate(warung);

    const payload: GeneratedImageContent = {
      ai_image_prompt: `Poster Instagram untuk ${warung.nama}`,
      ai_image_url: imageUrl,
    };

    const { error: updateError } = await supabase
      .from("warung")
      .update(payload)
      .eq("id", warung.id)
      .eq("owner_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to save poster URL: ${updateError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ data: payload }, { status: 200 });
  } catch (error) {
    if (error instanceof ReplicateError) {
      if (error.message.includes("REPLICATE_API_TOKEN")) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      if (error.status === 429) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }
      return NextResponse.json(
        { error: `Image generation failed: ${error.message}` },
        { status: error.status >= 500 ? 502 : error.status },
      );
    }

    console.error(error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
