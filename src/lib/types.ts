// ADR: Why PostgreSQL (Supabase) over MongoDB
// Warung data is relational: owner -> warung -> vibe_tags (array).
// PostgreSQL's array type + RLS + Auth integration outweighs MongoDB's flexibility
// for this schema. Supabase also provides built-in Auth, removing a third service dependency.

export const VIBE_TAGS = [
  "tenang",
  "rame",
  "adem",
  "cozy",
  "aesthetic",
  "outdoor",
  "wifi kencang",
  "buat nugas",
] as const;

export type VibeTag = (typeof VIBE_TAGS)[number];

export const PRICE_RANGES = [
  "< Rp15.000",
  "Rp15.000 - Rp30.000",
  "Rp30.000 - Rp50.000",
  "> Rp50.000",
] as const;

export type Warung = {
  id: string;
  owner_id: string | null;
  nama: string;
  deskripsi: string | null;
  vibe_tags: string[] | null;
  price_range: string | null;
  lat: number | null;
  lng: number | null;
  alamat: string | null;
  ai_bio: string | null;
  ai_captions: string[] | null;
  ai_tagline: string | null;
  ai_image_prompt: string | null;
  ai_image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type WarungInput = {
  nama: string;
  deskripsi?: string;
  vibe_tags: string[];
  price_range: string;
  alamat: string;
  lat: number;
  lng: number;
};

export type WarungSummary = Pick<
  Warung,
  "id" | "nama" | "deskripsi" | "vibe_tags" | "price_range" | "alamat" | "ai_bio"
>;

export type GeneratedContent = {
  ai_bio: string;
  ai_tagline: string;
  ai_captions: string[];
};

export type GeneratedImageContent = {
  ai_image_prompt: string;
  ai_image_url: string;
};

export type MatchResult = {
  id: string;
  alasan: string;
};
