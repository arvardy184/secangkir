import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WarungDetailClient } from "@/components/WarungDetailClient";
import { WarungDetailMap } from "@/components/WarungDetailMap";
import { createServerClient } from "@/lib/supabase/server";
import type { Warung } from "@/lib/types";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerClient();
  const { data: warung } = await supabase
    .from("warung")
    .select("nama, ai_tagline, deskripsi, price_range")
    .eq("id", params.id)
    .maybeSingle<Pick<Warung, "nama" | "ai_tagline" | "deskripsi" | "price_range">>();

  if (!warung) return { title: "Warung tidak ditemukan — Secangkir" };

  const description =
    warung.ai_tagline ||
    warung.deskripsi ||
    `Warung kopi ${warung.nama} di Secangkir.`;

  return {
    title: `${warung.nama} — Secangkir`,
    description,
  };
}

export default async function WarungDetailPage({ params }: Props) {
  const hasSupabaseEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabaseEnv) notFound();

  const supabase = createServerClient();
  const [{ data: warung, error }, authResult] = await Promise.all([
    supabase.from("warung").select("*").eq("id", params.id).maybeSingle<Warung>(),
    supabase.auth.getUser(),
  ]);
  const user = authResult.data?.user ?? null;

  if (error || !warung) notFound();

  const isOwner = Boolean(user && user.id === warung.owner_id);
  const vibeTags = warung.vibe_tags ?? [];
  const captions = warung.ai_captions ?? [];
  const hasLocation = warung.lat !== null && warung.lng !== null;

  // Google Maps link — opens in native Maps app on mobile, browser on desktop
  const googleMapsUrl =
    hasLocation
      ? `https://www.google.com/maps/search/?api=1&query=${warung.lat},${warung.lng}`
      : warung.alamat
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(warung.alamat)}`
        : null;

  return (
    <div className="page-shell">
      {/* Nav */}
      <nav
        aria-label="Navigasi detail warung"
        className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <Link
          href="/explore"
          aria-label="Kembali ke halaman explore"
          className="nav-link"
        >
          ← Explore
        </Link>
        <Link href="/" aria-label="Kembali ke landing page" className="btn-primary">
          Home
        </Link>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-2">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">

          {/* Left — main info */}
          <div className="space-y-4">
            {/* Header card */}
            <div className="surface-panel p-6 md:p-8">
              {warung.ai_image_url ? (
                <div className="mb-6 overflow-hidden rounded-[28px] border border-kopi-200 bg-kopi-50">
                  <img
                    src={warung.ai_image_url}
                    alt={`Poster Instagram ${warung.nama}`}
                    className="aspect-square w-full object-cover sm:aspect-[16/10]"
                  />
                </div>
              ) : null}

              <p className="label-section mb-3">Detail Warung</p>
              <h1 className="font-display text-4xl font-semibold text-kopi-900">
                {warung.nama}
              </h1>

              {/* Tagline */}
              <div className="mt-3">
                {warung.ai_tagline ? (
                  <p className="text-lg font-medium italic text-kopi-700">
                    &ldquo;{warung.ai_tagline}&rdquo;
                  </p>
                ) : (
                  <p className="text-sm text-kopi-500">
                    Tagline belum tersedia untuk warung ini.
                  </p>
                )}
              </div>

              {/* Price + vibe chips */}
              <div className="mt-4 flex flex-wrap gap-2">
                {warung.price_range ? (
                  <span className="chip-active">{warung.price_range}</span>
                ) : null}
                {vibeTags.map((tag) => (
                  <span key={tag} className="chip">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bio */}
              <div className="surface-inset mt-5 p-4">
                <p className="label-section mb-2">Tentang warung</p>
                {warung.ai_bio || warung.deskripsi ? (
                  <p className="text-sm leading-relaxed text-kopi-700">
                    {warung.ai_bio || warung.deskripsi}
                  </p>
                ) : (
                  <p className="text-sm text-kopi-500">
                    Deskripsi warung belum ditambahkan.
                  </p>
                )}
              </div>

              {/* Alamat + Google Maps */}
              {warung.alamat || googleMapsUrl ? (
                <div className="mt-4 flex items-start justify-between gap-4">
                  {warung.alamat ? (
                    <p className="text-sm text-kopi-700">{warung.alamat}</p>
                  ) : (
                    <span />
                  )}
                  {googleMapsUrl ? (
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Buka lokasi ${warung.nama} di Google Maps`}
                      className="btn-secondary shrink-0 text-xs"
                    >
                      Google Maps ↗
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Captions — hanya untuk owner */}
            {isOwner ? (
              <div className="surface-panel p-6">
                <p className="label-section mb-3">Caption Instagram</p>
                {captions.length > 0 ? (
                  <WarungDetailClient captions={captions} />
                ) : (
                  <p className="text-sm text-kopi-500">
                    Caption promosi belum tersedia. Generate dari dashboard.
                  </p>
                )}
              </div>
            ) : null}
          </div>

          {/* Right — map */}
          <div className="space-y-3">
            {hasLocation ? (
              <>
                <WarungDetailMap
                  marker={{
                    id: warung.id,
                    nama: warung.nama,
                    lat: warung.lat,
                    lng: warung.lng,
                    alamat: warung.alamat,
                  }}
                />
                {googleMapsUrl ? (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Buka ${warung.nama} di Google Maps`}
                    className="btn-secondary w-full justify-center"
                  >
                    Buka di Google Maps ↗
                  </a>
                ) : null}
              </>
            ) : (
              <div className="surface-inset p-6 text-center text-sm text-kopi-700">
                Lokasi belum tersedia. Owner bisa menambahkan titik peta dari
                dashboard.
              </div>
            )}

            {/* Quick info sidebar */}
            <div className="surface-panel divide-y divide-kopi-200">
              {warung.price_range ? (
                <div className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-kopi-500">Harga</span>
                  <span className="font-medium text-kopi-900">{warung.price_range}</span>
                </div>
              ) : null}
              {hasLocation ? (
                <div className="flex justify-between px-4 py-3 text-sm">
                  <span className="text-kopi-500">Koordinat</span>
                  <span className="font-mono text-xs text-kopi-700">
                    {warung.lat!.toFixed(4)}, {warung.lng!.toFixed(4)}
                  </span>
                </div>
              ) : null}
              {vibeTags.length > 0 ? (
                <div className="px-4 py-3 text-sm">
                  <span className="text-kopi-500">Vibe</span>
                  <p className="mt-1.5 text-kopi-900">{vibeTags.join(", ")}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
