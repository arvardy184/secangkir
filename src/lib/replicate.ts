import "server-only";
import type { Warung } from "./types";

export class ReplicateError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ReplicateError";
    this.status = status;
  }
}

export function generatePosterWithReplicate(warung: Warung): string {
  const vibe = warung.vibe_tags?.slice(0, 3).join(", ") ?? "cozy, local";
  const name = warung.nama.replace(/[^a-zA-Z0-9 ]/g, "").trim();
  const tagline = warung.ai_tagline
    ? warung.ai_tagline.replace(/[^a-zA-Z0-9 .,!]/g, "").trim()
    : "";

  const prompt = [
    `Indonesian warung kopi coffee shop`,
    name,
    tagline,
    vibe,
    "warm lighting, coffee cup, cozy atmosphere, food photography",
  ]
    .filter(Boolean)
    .join(", ");

  const seed = Math.floor(Math.random() * 999999);
  const encoded = encodeURIComponent(prompt);

  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=false&model=flux`;
}
