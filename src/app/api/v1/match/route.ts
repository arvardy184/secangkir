import { NextRequest, NextResponse } from "next/server";
import { GeminiApiError, matchMoodToWarung } from "@/lib/gemini";
import { MatchSchema } from "@/lib/schemas";
import { createServerClient } from "@/lib/supabase/server";
import type { Warung, WarungSummary } from "@/lib/types";

type MatchWarung = Pick<
  Warung,
  | "id"
  | "nama"
  | "deskripsi"
  | "vibe_tags"
  | "price_range"
  | "alamat"
  | "lat"
  | "lng"
  | "ai_bio"
  | "ai_tagline"
> & {
  alasan: string;
};

type MatchResponse = {
  data: MatchWarung[];
};

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = MatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = createServerClient();
  const { data: warungList, error } = await supabase
    .from("warung")
    .select(
      "id,nama,deskripsi,vibe_tags,price_range,alamat,lat,lng,ai_bio,ai_tagline",
    )
    .not("lat", "is", null)
    .not("lng", "is", null)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: `Failed to read warung: ${error.message}` },
      { status: 500 },
    );
  }

  const rows = (warungList ?? []) as MatchWarung[];
  if (rows.length === 0) {
    return NextResponse.json({ data: [] }, { status: 200 });
  }

  try {
    const summaries: WarungSummary[] = rows.map((warung) => ({
      id: warung.id,
      nama: warung.nama,
      deskripsi: warung.deskripsi,
      vibe_tags: warung.vibe_tags,
      price_range: warung.price_range,
      alamat: warung.alamat,
      ai_bio: warung.ai_bio,
    }));

    const matches = await matchMoodToWarung(parsed.data.mood, summaries);
    const reasonsById = new Map(
      matches.map((match) => [match.id, match.alasan] as const),
    );
    const rowsById = new Map(rows.map((warung) => [warung.id, warung] as const));

    const rankedRows = matches
      .map((match) => rowsById.get(match.id))
      .filter((warung): warung is MatchWarung => Boolean(warung))
      .map((warung) => ({
        ...warung,
        alasan: reasonsById.get(warung.id) ?? "Cocok dengan mood yang dicari.",
      }));

    if (rankedRows.length === 0) {
      const fallbackRows = rankWarungLocally(parsed.data.mood, rows);
      return NextResponse.json({ data: fallbackRows }, { status: 200 });
    }

    const response: MatchResponse = { data: rankedRows };
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const fallbackRows = rankWarungLocally(parsed.data.mood, rows);
    if (fallbackRows.length > 0) {
      return NextResponse.json(
        {
          data: fallbackRows,
          warning: getAiWarning(error),
        },
        { status: 200 },
      );
    }

    return handleAiError(error);
  }
}

function rankWarungLocally(mood: string, rows: MatchWarung[]): MatchWarung[] {
  const tokens = tokenize(mood);

  return rows
    .map((warung) => {
      const searchable = [
        warung.nama,
        warung.deskripsi,
        warung.ai_bio,
        warung.ai_tagline,
        warung.price_range,
        warung.alamat,
        ...(warung.vibe_tags ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const score = tokens.reduce(
        (total, token) => total + (searchable.includes(token) ? 1 : 0),
        0,
      );

      return {
        ...warung,
        alasan:
          score > 0
            ? "Cocok berdasarkan kata kunci mood, vibe, harga, dan deskripsi warung."
            : "Direkomendasikan sebagai pilihan warung yang tersedia saat ini.",
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ score: _score, ...warung }) => warung);
}

function tokenize(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function getAiWarning(error: unknown) {
  if (error instanceof GeminiApiError) {
    return `Gemini fallback used: ${error.message}`;
  }

  return "Gemini fallback used.";
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
