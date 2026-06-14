import "server-only";
import type { Warung } from "./types";

// ADR: Why Pollinations.ai over Replicate
// Replicate requires paid credit. Pollinations.ai is completely free, no API key,
// no signup. Returns a direct image URL from a simple GET request.

export class ReplicateError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ReplicateError";
    this.status = status;
  }
}

export async function generatePosterWithReplicate(warung: Warung): Promise<string> {
  const vibe = warung.vibe_tags?.join(", ") ?? "cozy, local, authentic";
  const prompt = `Instagram promotional poster for Indonesian local coffee stall called ${warung.nama}. ${warung.ai_tagline ? warung.ai_tagline + "." : ""} Vibe: ${vibe}. Warm natural lighting, realistic editorial food photography, authentic neighborhood coffee atmosphere, coffee cup as main subject, square composition, no text, no logos`;

  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;

  return url;
}
