"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { saveWarung, type SaveWarungResult } from "@/app/onboard/actions";
import { PRICE_RANGES, VIBE_TAGS, type Warung } from "@/lib/types";

type OnboardFormProps = {
  initialWarung: Warung | null;
};

type FormState = {
  nama: string;
  deskripsi: string;
  vibe_tags: string[];
  price_range: string;
  alamat: string;
  lat: string;
  lng: string;
};

const DEFAULT_LOCATION = {
  lat: "-6.200000",
  lng: "106.816666",
};

export function OnboardForm({ initialWarung }: OnboardFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<SaveWarungResult | null>(null);
  const [form, setForm] = useState<FormState>({
    nama: initialWarung?.nama ?? "",
    deskripsi: initialWarung?.deskripsi ?? "",
    vibe_tags: initialWarung?.vibe_tags ?? [],
    price_range: initialWarung?.price_range ?? PRICE_RANGES[0],
    alamat: initialWarung?.alamat ?? "",
    lat: String(initialWarung?.lat ?? DEFAULT_LOCATION.lat),
    lng: String(initialWarung?.lng ?? DEFAULT_LOCATION.lng),
  });

  const submitLabel = isPending
    ? "Menyimpan..."
    : initialWarung
      ? "Update warung"
      : "Daftarkan warung";

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleVibe(tag: string) {
    setForm((current) => {
      const exists = current.vibe_tags.includes(tag);
      const vibe_tags = exists
        ? current.vibe_tags.filter((item) => item !== tag)
        : [...current.vibe_tags, tag];

      return { ...current, vibe_tags };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(null);

    startTransition(async () => {
      const response = await saveWarung({
        nama: form.nama.trim(),
        deskripsi: form.deskripsi.trim() || undefined,
        vibe_tags: form.vibe_tags,
        price_range: form.price_range,
        alamat: form.alamat.trim(),
        lat: Number(form.lat),
        lng: Number(form.lng),
      });

      setResult(response);

      if (response.ok) {
        router.refresh();
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-kopi-200 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="grid gap-5">
        <div className="space-y-2">
          <label htmlFor="nama" className="text-sm font-medium text-kopi-700">
            Nama warung
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            aria-label="Masukkan nama warung"
            value={form.nama}
            onChange={(event) => updateField("nama", event.target.value)}
            className="w-full rounded-2xl border border-kopi-200 bg-kopi-50 px-4 py-3 text-kopi-900 placeholder:text-kopi-300"
            placeholder="Warung Kopi Senja"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="deskripsi"
            className="text-sm font-medium text-kopi-700"
          >
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            aria-label="Masukkan deskripsi warung"
            value={form.deskripsi}
            onChange={(event) => updateField("deskripsi", event.target.value)}
            className="min-h-28 w-full resize-y rounded-2xl border border-kopi-200 bg-kopi-50 px-4 py-3 text-kopi-900 placeholder:text-kopi-300"
            placeholder="Ceritakan suasana, menu andalan, dan karakter warung."
            maxLength={500}
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-kopi-700">
            Vibe warung
          </legend>
          <div className="flex flex-wrap gap-2">
            {VIBE_TAGS.map((tag) => {
              const selected = form.vibe_tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  aria-label={`${selected ? "Hapus" : "Pilih"} vibe ${tag}`}
                  aria-pressed={selected}
                  onClick={() => toggleVibe(tag)}
                  className={
                    selected
                      ? "rounded-full bg-kopi-700 px-4 py-2 text-sm font-semibold text-kopi-50 transition hover:bg-kopi-900"
                      : "rounded-full border border-kopi-200 bg-kopi-50 px-4 py-2 text-sm font-medium text-kopi-700 transition hover:bg-kopi-100"
                  }
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div className="space-y-2">
          <label
            htmlFor="price_range"
            className="text-sm font-medium text-kopi-700"
          >
            Kisaran harga
          </label>
          <select
            id="price_range"
            name="price_range"
            aria-label="Pilih kisaran harga"
            value={form.price_range}
            onChange={(event) => updateField("price_range", event.target.value)}
            className="w-full rounded-2xl border border-kopi-200 bg-kopi-50 px-4 py-3 text-kopi-900"
          >
            {PRICE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="alamat"
            className="text-sm font-medium text-kopi-700"
          >
            Alamat
          </label>
          <input
            id="alamat"
            name="alamat"
            type="text"
            aria-label="Masukkan alamat warung"
            value={form.alamat}
            onChange={(event) => updateField("alamat", event.target.value)}
            className="w-full rounded-2xl border border-kopi-200 bg-kopi-50 px-4 py-3 text-kopi-900 placeholder:text-kopi-300"
            placeholder="Jl. Kopi No. 7, Jakarta"
            required
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="lat" className="text-sm font-medium text-kopi-700">
              Latitude
            </label>
            <input
              id="lat"
              name="lat"
              type="number"
              step="any"
              min="-90"
              max="90"
              aria-label="Masukkan latitude warung"
              value={form.lat}
              onChange={(event) => updateField("lat", event.target.value)}
              className="w-full rounded-2xl border border-kopi-200 bg-kopi-50 px-4 py-3 text-kopi-900"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="lng" className="text-sm font-medium text-kopi-700">
              Longitude
            </label>
            <input
              id="lng"
              name="lng"
              type="number"
              step="any"
              min="-180"
              max="180"
              aria-label="Masukkan longitude warung"
              value={form.lng}
              onChange={(event) => updateField("lng", event.target.value)}
              className="w-full rounded-2xl border border-kopi-200 bg-kopi-50 px-4 py-3 text-kopi-900"
              required
            />
          </div>
        </div>

        {result ? (
          <p
            role={result.ok ? "status" : "alert"}
            className={
              result.ok
                ? "rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
                : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            }
          >
            {result.message}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            aria-label="Simpan profil warung"
            disabled={isPending}
            className="rounded-2xl bg-kopi-700 px-5 py-3 font-semibold text-kopi-50 transition hover:bg-kopi-900 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitLabel}
          </button>
          <button
            type="button"
            aria-label="Kembali ke dashboard owner"
            onClick={() => router.push("/dashboard")}
            className="rounded-2xl border border-kopi-200 bg-white px-5 py-3 font-semibold text-kopi-700 transition hover:bg-kopi-100"
          >
            Dashboard
          </button>
        </div>
      </div>
    </form>
  );
}
