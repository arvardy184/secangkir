import "server-only";
import type {
  GeneratedContent,
  MatchResult,
  WarungInput,
  WarungSummary,
} from "./types";

// ADR: Why Gemini REST over SDK for this demo
// The app only needs two server-side JSON generation calls. Using REST keeps
// the provider switch small and avoids adding another runtime dependency.

const MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

type JsonSchema = {
  type: string;
  properties: Record<string, unknown>;
  required: string[];
  additionalProperties?: boolean;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

export class GeminiApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "GeminiApiError";
    this.status = status;
  }
}

const generateSchema = {
  type: "object",
  properties: {
    ai_bio: { type: "string" },
    ai_tagline: { type: "string" },
    ai_captions: {
      type: "array",
      items: { type: "string" },
      maxItems: 5,
    },
  },
  required: ["ai_bio", "ai_tagline", "ai_captions"],
  additionalProperties: false,
} satisfies JsonSchema;

export async function generateWarungContent(
  input: WarungInput,
): Promise<GeneratedContent> {
  const prompt = `Buatkan konten marketing untuk warung kopi lokal Indonesia.

Nama: ${input.nama}
Deskripsi: ${input.deskripsi ?? "-"}
Vibe: ${input.vibe_tags.join(", ")}
Harga: ${input.price_range}
Lokasi: ${input.alamat}

Tulis dalam Bahasa Indonesia yang hangat dan casual. Buat tepat 5 caption Instagram.`;

  const parsed = await generateJson<GeneratedContent>(
    "You are a creative copywriter specializing in Indonesian F&B UMKM.",
    prompt,
    generateSchema,
    4096,
  );

  return {
    ai_bio: parsed.ai_bio,
    ai_tagline: parsed.ai_tagline,
    ai_captions: (parsed.ai_captions ?? []).slice(0, 5),
  };
}

const matchSchema = {
  type: "object",
  properties: {
    matches: {
      type: "array",
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          id: { type: "string" },
          alasan: { type: "string" },
        },
        required: ["id", "alasan"],
        additionalProperties: false,
      },
    },
  },
  required: ["matches"],
  additionalProperties: false,
} satisfies JsonSchema;

export async function matchMoodToWarung(
  mood: string,
  warungList: WarungSummary[],
): Promise<MatchResult[]> {
  const prompt = `Mood pengunjung: ${mood}

Daftar warung:
${JSON.stringify(warungList)}

Pilih maksimal 3 warung paling cocok. Return id dan alasan singkat dalam Bahasa Indonesia.`;

  const parsed = await generateJson<{ matches: MatchResult[] }>(
    "You are a coffee shop matchmaker for Indonesian warung kopi.",
    prompt,
    matchSchema,
    2048,
  );

  return (parsed.matches ?? []).slice(0, 3);
}

async function generateJson<T>(
  systemInstruction: string,
  prompt: string,
  schema: JsonSchema,
  maxOutputTokens: number,
): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiApiError("GEMINI_API_KEY is not configured", 500);
  }

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemInstruction }],
      },
      contents: [
        {
          parts: [
            {
              text: `${prompt}

Return only valid JSON matching this schema:
${JSON.stringify(schema)}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens,
        responseMimeType: "application/json",
        responseSchema: toGeminiSchema(schema),
      },
    }),
  });

  const payload = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    throw new GeminiApiError(
      payload.error?.message ?? "Gemini API request failed",
      response.status,
    );
  }

  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiApiError("Gemini returned no text content", 502);
  }

  return parseJsonResponse<T>(text);
}

function parseJsonResponse<T>(text: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new GeminiApiError("Gemini returned non-JSON content", 502);
    }

    return JSON.parse(match[0]) as T;
  }
}

function toGeminiSchema(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(toGeminiSchema);
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  const result: Record<string, unknown> = {};

  for (const [key, child] of Object.entries(value)) {
    if (key === "additionalProperties") {
      continue;
    }

    result[key] = toGeminiSchema(child);
  }

  return result;
}
