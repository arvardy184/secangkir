import { NextRequest, NextResponse } from "next/server";
import { GenerateSchema } from "@/lib/schemas";
import { ReplicateError, generatePosterWithReplicate } from "@/lib/replicate";
import { createServerClient } from "@/lib/supabase/server";
import type { GeneratedImageContent, Warung } from "@/lib/types";

const BUCKET = "warung-assets";

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
    const dataUrl = await generatePosterWithReplicate(warung);

    // Parse base64 data URL → upload to Supabase Storage
    const [header, base64] = dataUrl.split(",");
    const mimeType = header.match(/:(.*?);/)?.[1] ?? "image/jpeg";
    const ext = mimeType.includes("png") ? "png" : "jpg";
    const bytes = Buffer.from(base64, "base64");
    const path = `warung/${user.id}/${warung.id}/poster.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: mimeType, upsert: true });

    let imageUrl = dataUrl; // fallback ke data URL kalau upload gagal

    if (!uploadError) {
      const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
      imageUrl = publicUrl;
    }

    const payload: GeneratedImageContent = {
      ai_image_prompt: `Poster Instagram untuk ${warung.nama}`,
      ai_image_url: imageUrl,
    };

    await supabase
      .from("warung")
      .update(payload)
      .eq("id", warung.id)
      .eq("owner_id", user.id);

    return NextResponse.json({ data: payload }, { status: 200 });
  } catch (error) {
    if (error instanceof ReplicateError) {
      if (error.message.includes("HF_API_TOKEN")) {
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
