import { z } from "zod";

export const GenerateSchema = z.object({
  warung_id: z.string().uuid(),
});

export const MatchSchema = z.object({
  mood: z.string().min(3).max(500),
});

export const OnboardSchema = z.object({
  nama: z.string().min(1).max(100),
  deskripsi: z.string().max(500).optional(),
  vibe_tags: z.array(z.string().min(1).max(50)).min(1).max(8),
  price_range: z.string(),
  alamat: z.string().min(1).max(200),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type GenerateInput = z.infer<typeof GenerateSchema>;
export type MatchInput = z.infer<typeof MatchSchema>;
export type OnboardInput = z.infer<typeof OnboardSchema>;
