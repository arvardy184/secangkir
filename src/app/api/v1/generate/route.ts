import { NextRequest, NextResponse } from "next/server";
import { GenerateSchema } from "@/lib/schemas";
import { GeminiApiError, generateWarungContent } from "@/lib/gemini";
import { createServerClient } from "@/lib/supabase/server";
import type { GeneratedContent, Warung } from "@/lib/types";

type GenerateResponse = {
  data: GeneratedContent;
};

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
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
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

  if (
    !warung.price_range ||
    !warung.alamat ||
    warung.lat === null ||
    warung.lng === null
  ) {
    return NextResponse.json(
      { error: "Warung profile is incomplete" },
      { status: 400 },
    );
  }

  try {
    const generated = await generateWarungContent({
      nama: warung.nama,
      deskripsi: warung.deskripsi ?? undefined,
      vibe_tags: warung.vibe_tags ?? [],
      price_range: warung.price_range,
      alamat: warung.alamat,
      lat: warung.lat,
      lng: warung.lng,
    });

    const { error: updateError } = await supabase
      .from("warung")
      .update(generated)
      .eq("id", warung.id)
      .eq("owner_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to update warung: ${updateError.message}` },
        { status: 500 },
      );
    }

    const response: GenerateResponse = { data: generated };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleAiError(error);
  }
}

function handleAiError(error: unknown) {
  if (error instanceof GeminiApiError) {
    if (error.message.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: "Gemini rate limit exceeded" },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: `Gemini API request failed: ${error.message}` },
      { status: error.status >= 500 ? 502 : error.status },
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 },
  );
}
