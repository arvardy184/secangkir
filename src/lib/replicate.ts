import "server-only";
import type { Warung } from "./types";

// ADR: Why Hugging Face over Pollinations/Replicate
// Pollinations rate-limits Vercel IPs (x402 queue full).
// Replicate requires paid credit.
// Hugging Face Inference API is free with an account token,
// supports FLUX.1-schnell, returns binary image data directly.

export class ReplicateError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ReplicateError";
    this.status = status;
  }
}

export async function generatePosterWithReplicate(warung: Warung): Promise<string> {
  const apiToken = process.env.HF_API_TOKEN;
  if (!apiToken) {
    throw new ReplicateError("HF_API_TOKEN is not configured", 500);
  }

  const vibe = warung.vibe_tags?.join(", ") ?? "cozy, local, authentic";
  const prompt = `Instagram promotional poster for Indonesian local coffee stall called ${warung.nama}. ${warung.ai_tagline ? warung.ai_tagline + "." : ""} Vibe: ${vibe}. Warm natural lighting, realistic editorial food photography, authentic neighborhood coffee atmosphere, coffee cup as main subject, square composition, no text, no logos`;

  const res = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { width: 1024, height: 1024 },
      }),
    },
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ReplicateError(
      `HuggingFace request failed (${res.status}): ${text.slice(0, 200)}`,
      res.status,
    );
  }

  // Response is binary image — convert to base64 data URL
  const buffer = await res.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mimeType = res.headers.get("content-type") ?? "image/jpeg";

  return `data:${mimeType};base64,${base64}`;
}
