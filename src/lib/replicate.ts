import "server-only";
import type { Warung } from "./types";

// ADR: Why Replicate over Gemini Image
// Gemini image generation (Imagen) requires Google Cloud billing.
// Replicate FLUX.1-schnell is pay-per-use (~$0.003/image), no billing setup needed,
// and returns a direct public URL — no base64 decoding or Supabase Storage upload required.

const REPLICATE_API_URL = "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions";
const POLL_INTERVAL_MS = 1500;
const MAX_POLLS = 30; // 45 seconds max

export class ReplicateError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ReplicateError";
    this.status = status;
  }
}

type PredictionStatus = "starting" | "processing" | "succeeded" | "failed" | "canceled";

type Prediction = {
  id: string;
  status: PredictionStatus;
  output?: string[] | null;
  error?: string | null;
  urls?: { get: string };
};

function buildPrompt(warung: Warung): string {
  const vibe = warung.vibe_tags?.join(", ") ?? "cozy, local, authentic";
  return `Instagram promotional poster for Indonesian local coffee stall called "${warung.nama}". ${warung.ai_tagline ? `Tagline: ${warung.ai_tagline}.` : ""} Vibe: ${vibe}. Warm natural lighting, realistic editorial food photography, authentic neighborhood coffee atmosphere, coffee cup as main subject, inviting and human feel, square 1:1 composition, polished but approachable, no text, no logos, no watermarks`;
}

export async function generatePosterWithReplicate(warung: Warung): Promise<string> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new ReplicateError("REPLICATE_API_TOKEN is not configured", 500);
  }

  const prompt = buildPrompt(warung);

  // Create prediction
  const createRes = await fetch(REPLICATE_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiToken}`,
      "Content-Type": "application/json",
      "Prefer": "wait",
    },
    body: JSON.stringify({
      input: {
        prompt,
        aspect_ratio: "1:1",
        output_format: "webp",
        output_quality: 80,
        num_outputs: 1,
      },
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({})) as { detail?: string };
    throw new ReplicateError(
      err.detail ?? `Replicate request failed (${createRes.status})`,
      createRes.status,
    );
  }

  let prediction = (await createRes.json()) as Prediction;

  // "Prefer: wait" makes Replicate wait up to 60s before returning,
  // so most of the time it's already succeeded here. Poll as fallback.
  for (let i = 0; i < MAX_POLLS; i++) {
    if (prediction.status === "succeeded") {
      const url = prediction.output?.[0];
      if (!url) throw new ReplicateError("Replicate returned no image URL", 502);
      return url;
    }

    if (prediction.status === "failed" || prediction.status === "canceled") {
      throw new ReplicateError(prediction.error ?? "Prediction failed", 502);
    }

    await sleep(POLL_INTERVAL_MS);

    const pollRes = await fetch(prediction.urls?.get ?? `https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { "Authorization": `Bearer ${apiToken}` },
    });

    if (!pollRes.ok) {
      throw new ReplicateError(`Poll failed (${pollRes.status})`, pollRes.status);
    }

    prediction = (await pollRes.json()) as Prediction;
  }

  throw new ReplicateError("Replicate prediction timed out", 504);
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
