"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { saveWarung, type SaveWarungResult } from "@/app/onboard/actions";
import { PRICE_RANGES, VIBE_TAGS, type Warung } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div
      aria-label="Memuat peta"
      className="h-[280px] animate-pulse rounded-lg border border-kopi-200 bg-kopi-100 md:h-[360px]"
    />
  ),
});

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

const DEFAULT_LOCATION = { lat: "-6.200000", lng: "106.816666" };
const PICKER_MAP_CLASS = "h-[280px] md:h-[360px]";

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

  function updateField(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateLocation(location: { lat: number; lng: number }) {
    setForm((f) => ({
      ...f,
      lat: location.lat.toFixed(6),
      lng: location.lng.toFixed(6),
    }));
  }

  function toggleVibe(tag: string) {
    setForm((f) => {
      const exists = f.vibe_tags.includes(tag);
      return {
        ...f,
        vibe_tags: exists
          ? f.vibe_tags.filter((t) => t !== tag)
          : [...f.vibe_tags, tag],
      };
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
      if (response.ok) router.refresh();
    });
  }

  const selectedLocation = {
    lat: toCoordinate(form.lat, DEFAULT_LOCATION.lat),
    lng: toCoordinate(form.lng, DEFAULT_LOCATION.lng),
  };

  return (
    <form onSubmit={handleSubmit} className="surface-panel p-6 md:p-8">
      <div className="space-y-6">

        {/* Nama */}
        <div className="space-y-1.5">
          <label htmlFor="nama" className="field-label">
            Nama warung
          </label>
          <input
            id="nama"
            name="nama"
            type="text"
            aria-label="Masukkan nama warung"
            value={form.nama}
            onChange={(e) => updateField("nama", e.target.value)}
            className="field"
            placeholder="Warung Kopi Senja"
            required
          />
        </div>

        {/* Deskripsi */}
        <div className="space-y-1.5">
          <label htmlFor="deskripsi" className="field-label">
            Deskripsi
            <span className="ml-1 font-normal text-kopi-500">(opsional)</span>
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            aria-label="Masukkan deskripsi warung"
            value={form.deskripsi}
            onChange={(e) => updateField("deskripsi", e.target.value)}
            className="field min-h-24 resize-y"
            placeholder="Suasana, menu andalan, karakter warung..."
            maxLength={500}
          />
        </div>

        {/* Vibe tags */}
        <fieldset className="space-y-2">
          <legend className="field-label">Vibe warung</legend>
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
                  className={selected ? "chip-active" : "chip"}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Price range */}
        <div className="space-y-1.5">
          <label htmlFor="price_range" className="field-label">
            Kisaran harga
          </label>
          <select
            id="price_range"
            name="price_range"
            aria-label="Pilih kisaran harga"
            value={form.price_range}
            onChange={(e) => updateField("price_range", e.target.value)}
            className="field"
          >
            {PRICE_RANGES.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>

        {/* Alamat */}
        <div className="space-y-1.5">
          <label htmlFor="alamat" className="field-label">
            Alamat
          </label>
          <input
            id="alamat"
            name="alamat"
            type="text"
            aria-label="Masukkan alamat warung"
            value={form.alamat}
            onChange={(e) => updateField("alamat", e.target.value)}
            className="field"
            placeholder="Jl. Kopi No. 7, Jakarta Selatan"
            required
          />
        </div>

        {/* Map picker */}
        <section aria-label="Pilih lokasi warung di peta" className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="field-label">Titik lokasi</span>
            <span className="rounded-md bg-kopi-100 px-2.5 py-1 font-mono text-xs text-kopi-700">
              {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </span>
          </div>
          <p className="text-xs text-kopi-500">
            Klik peta atau geser marker untuk mengisi koordinat.
          </p>
          <MapView
            mode="pick"
            value={selectedLocation}
            onLocationChange={updateLocation}
            className={PICKER_MAP_CLASS}
            ariaLabel="Peta pemilihan lokasi warung"
          />
        </section>

        {/* Lat/lng fallback inputs */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="lat" className="field-label">
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
              onChange={(e) => updateField("lat", e.target.value)}
              className="field font-mono text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="lng" className="field-label">
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
              onChange={(e) => updateField("lng", e.target.value)}
              className="field font-mono text-sm"
              required
            />
          </div>
        </div>

        {/* Result feedback */}
        {result ? (
          <p
            role={result.ok ? "status" : "alert"}
            aria-live="polite"
            className={result.ok ? "alert-success" : "alert-error"}
          >
            {result.message}
          </p>
        ) : null}

        {/* Actions */}
        <div className="flex gap-3 border-t border-kopi-200 pt-4">
          <button
            type="submit"
            aria-label="Simpan profil warung"
            disabled={isPending}
            className="btn-primary flex-1 py-3"
          >
            {isPending
              ? "Menyimpan..."
              : initialWarung
                ? "Update warung"
                : "Daftarkan warung"}
          </button>
          <button
            type="button"
            aria-label="Kembali ke dashboard owner"
            onClick={() => router.push("/dashboard")}
            className="btn-secondary px-5 py-3"
          >
            Dashboard
          </button>
        </div>
      </div>
    </form>
  );
}

function toCoordinate(value: string, fallback: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number(fallback);
}
