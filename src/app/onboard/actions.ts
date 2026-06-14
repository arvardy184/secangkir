"use server";

import { revalidatePath } from "next/cache";
import { OnboardSchema, type OnboardInput } from "@/lib/schemas";
import { createServerClient } from "@/lib/supabase/server";

export type SaveWarungResult = {
  ok: boolean;
  message: string;
};

export async function saveWarung(
  input: OnboardInput,
): Promise<SaveWarungResult> {
  const parsed = OnboardSchema.safeParse(input);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Data warung belum valid. Periksa kembali isian form.",
    };
  }

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message: "Sesi login tidak ditemukan. Silakan login ulang.",
    };
  }

  const payload = {
    owner_id: user.id,
    nama: parsed.data.nama,
    deskripsi: parsed.data.deskripsi || null,
    vibe_tags: parsed.data.vibe_tags,
    price_range: parsed.data.price_range,
    alamat: parsed.data.alamat,
    lat: parsed.data.lat,
    lng: parsed.data.lng,
  };

  const { data: existing, error: findError } = await supabase
    .from("warung")
    .select("id")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) {
    return {
      ok: false,
      message: `Gagal membaca data warung: ${findError.message}`,
    };
  }

  const result = existing
    ? await supabase.from("warung").update(payload).eq("id", existing.id)
    : await supabase.from("warung").insert(payload);

  if (result.error) {
    return {
      ok: false,
      message: `Gagal menyimpan warung: ${result.error.message}`,
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/onboard");

  return {
    ok: true,
    message: "Profil warung berhasil disimpan.",
  };
}
