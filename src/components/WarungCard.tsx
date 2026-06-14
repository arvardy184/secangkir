"use client";

import Link from "next/link";

export type ExploreWarung = {
  id: string;
  nama: string;
  deskripsi: string | null;
  vibe_tags: string[] | null;
  price_range: string | null;
  alamat: string | null;
  lat: number | null;
  lng: number | null;
  ai_bio: string | null;
  ai_tagline?: string | null;
  alasan: string;
};

type WarungCardProps = {
  warung: ExploreWarung;
  rank?: number;
};

export function WarungCard({ warung, rank }: WarungCardProps) {
  const tagline = warung.ai_tagline || warung.ai_bio || warung.deskripsi;
  const vibeTags = warung.vibe_tags ?? [];

  return (
    <article
      aria-label={`Kartu rekomendasi ${warung.nama}`}
      className="surface-panel p-5"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {rank !== undefined ? (
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-kopi-900 text-xs font-bold text-white">
              {rank}
            </span>
          ) : null}
          <div className="min-w-0">
            <h2 className="font-semibold text-kopi-900">{warung.nama}</h2>
            {tagline ? (
              <p className="mt-1 text-sm leading-relaxed text-kopi-700 line-clamp-2">
                {tagline}
              </p>
            ) : null}
          </div>
        </div>
        {warung.price_range ? (
          <span className="shrink-0 rounded-md bg-kopi-100 px-2.5 py-1 text-xs font-semibold text-kopi-700">
            {warung.price_range}
          </span>
        ) : null}
      </div>

      {/* Vibe chips */}
      {vibeTags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {vibeTags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      {/* Match reason */}
      <div className="surface-inset mt-4 p-3.5">
        <p className="label-section mb-1">Kenapa cocok</p>
        <p className="text-sm leading-relaxed text-kopi-700">{warung.alasan}</p>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        {warung.alamat ? (
          <p className="truncate text-xs text-kopi-500">{warung.alamat}</p>
        ) : (
          <span />
        )}
        <div className="flex shrink-0 gap-2">
          {(warung.lat !== null && warung.lng !== null) || warung.alamat ? (
            <a
              href={
                warung.lat !== null && warung.lng !== null
                  ? `https://www.google.com/maps/search/?api=1&query=${warung.lat},${warung.lng}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(warung.alamat ?? "")}`
              }
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Buka lokasi ${warung.nama} di Google Maps`}
              className="btn-secondary px-3 py-2 text-xs"
            >
              Maps ↗
            </a>
          ) : null}
          <Link
            href={`/warung/${warung.id}`}
            aria-label={`Lihat detail warung ${warung.nama}`}
            className="btn-primary px-3 py-2 text-xs"
          >
            Lihat detail
          </Link>
        </div>
      </div>
    </article>
  );
}
