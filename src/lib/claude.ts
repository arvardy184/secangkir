import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type {
  GeneratedContent,
  MatchResult,
  WarungInput,
  WarungSummary,
} from "./types";

// ADR: Why claude-haiku-4-5 over claude-sonnet
// Speed > quality for hackathon demo. Haiku returns in ~1s vs ~3s for Sonnet.
// Structured outputs keep downstream parsing deterministic for API routes
// without relying on fragile "respond in JSON only" prompts.

const MODEL = "claude-haiku-4-5";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const GENERATE_SYSTEM = `You are a creative copywriter specializing in Indonesian F&B UMKM.
Write in casual but warm Bahasa Indonesia.`;

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
} as const;

export async function generateWarungContent(
  input: WarungInput,
): Promise<GeneratedContent> {
  // The SDK version used in this hackathon exposes structured output support
  // at runtime before its TypeScript definitions fully catch up.
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: GENERATE_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Buatkan konten marketing untuk warung kopi:
Nama: ${input.nama}
Deskripsi: ${input.deskripsi ?? "-"}
Vibe: ${input.vibe_tags.join(", ")}
Harga: ${input.price_range}
Lokasi: ${input.alamat}`,
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: generateSchema },
    },
  } as any);

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("No text content returned from Claude");
  }

  const parsed = JSON.parse(text.text) as GeneratedContent;
  parsed.ai_captions = (parsed.ai_captions ?? []).slice(0, 5);
  return parsed;
}

const MATCH_SYSTEM = `You are a coffee shop matchmaker for Indonesian warung kopi.
Match the user mood to the best warung. Return max 3 matches.`;

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
} as const;

export async function matchMoodToWarung(
  mood: string,
  warungList: WarungSummary[],
): Promise<MatchResult[]> {
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: MATCH_SYSTEM,
    messages: [
      {
        role: "user",
        content: `Mood: ${mood}

Warung list:
${JSON.stringify(warungList)}`,
      },
    ],
    output_config: {
      format: { type: "json_schema", schema: matchSchema },
    },
  } as any);

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("No text content returned from Claude");
  }

  const parsed = JSON.parse(text.text) as { matches: MatchResult[] };
  return (parsed.matches ?? []).slice(0, 3);
}

export { Anthropic };
