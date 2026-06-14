import { NextRequest, NextResponse } from "next/server";
import { GenerateSchema } from "@/lib/schemas";
import { GeminiApiError, generateWarungPosterImage } from "@/lib/gemini";
import { createServerClient } from "@/lib/supabase/server";
import type { GeneratedImageContent, Warung } from "@/lib/types";

const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "warung-assets";

type GenerateImageResponse = {
  data: GeneratedImageContent;
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

  try {
    const generated = await generateWarungPosterImage(warung);
    const extension = getExtension(generated.mimeType);
    const path = `warung/${user.id}/${warung.id}/poster.${extension}`;
    const bytes = Buffer.from(generated.base64, "base64");

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, {
        contentType: generated.mimeType,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Failed to upload poster: ${uploadError.message}` },
        { status: 500 },
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const payload: GeneratedImageContent = {
      ai_image_prompt: generated.ai_image_prompt,
      ai_image_url: publicUrl,
    };

    const { error: updateError } = await supabase
      .from("warung")
      .update(payload)
      .eq("id", warung.id)
      .eq("owner_id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to update warung: ${updateError.message}` },
        { status: 500 },
      );
    }

    const response: GenerateImageResponse = { data: payload };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return handleImageError(error);
  }
}

function handleImageError(error: unknown) {
  if (error instanceof GeminiApiError) {
    if (error.message.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: "Gemini image rate limit exceeded" },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: `Gemini image request failed: ${error.message}` },
      { status: error.status >= 500 ? 502 : error.status },
    );
  }

  console.error(error);
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 },
  );
}

function getExtension(mimeType: string) {
  if (mimeType.includes("webp")) return "webp";
  if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "jpg";
  return "png";
}
