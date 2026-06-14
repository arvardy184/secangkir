"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MoodInput } from "@/components/MoodInput";
import {
  WarungCard,
  type ExploreWarung,
} from "@/components/WarungCard";
import type { MapDisplayMarker } from "@/components/MapView";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const INITIAL_MOOD =
  "mau nugas, suasana tenang, budget 20rb, wifi kencang";

type ResultSource = "idle" | "api";

type MatchApiResponse = {
  data?: ExploreWarung[];
};

export default function ExplorePage() {
  const [results, setResults] = useState<ExploreWarung[]>([]);
  const [lastMood, setLastMood] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [resultSource, setResultSource] = useState<ResultSource>("idle");
  const [error, setError] = useState<string | null>(null);

  const markers = useMemo<MapDisplayMarker[]>(
    () =>
      results.map((warung) => ({
        id: warung.id,
        nama: warung.nama,
        lat: warung.lat,
        lng: warung.lng,
        alamat: warung.alamat,
      })),
    [results],
  );

  const helperText = getHelperText(resultSource, lastMood, results.length);

  async function handleMoodSubmit(mood: string) {
    setIsPending(true);
    setHasSubmitted(true);
    setError(null);
    setLastMood(mood);

    try {
      const apiResults = await requestMatches(mood);

      setResults(apiResults);
      setResultSource("api");
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Gagal memuat hasil dari API.";

      setError(message);
      setResults([]);
      setResultSource("api");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="page-shell">
      {/* Nav */}
      <nav
        aria-label="Navigasi halaman explore"
        className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Secangkir logo" width={32} height={32} className="rounded-lg" priority />
          <span className="font-display text-xl font-semibold text-kopi-900">
            Secangkir
          </span>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Link href="/" aria-label="Kembali ke landing page" className="nav-link">
            Home
          </Link>
          <Link
            href="/auth"
            aria-label="Masuk sebagai owner warung"
            className="btn-primary"
          >
            Owner Login
          </Link>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-4">
        <div className="mb-8">
          <p className="label-section mb-2">Explore Warung</p>
          <h1 className="font-display text-4xl font-semibold text-kopi-900">
            Temukan warung yang cocok.
          </h1>
          <p className="mt-2 text-sm text-kopi-700">
            Ceritakan suasana yang kamu cari — AI mencocokkan hingga 3 warung terbaik.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          {/* Left — input + map */}
          <div className="space-y-4">
            <MoodInput
              initialValue={INITIAL_MOOD}
              onSubmit={handleMoodSubmit}
              isPending={isPending}
            />

            {error ? (
              <p role="alert" aria-live="polite" className="alert-info">
                {error}
              </p>
            ) : null}

            <div>
              <p aria-live="polite" className="mb-2 text-xs text-kopi-500">
                {helperText}
              </p>
              <MapView
                mode="display"
                markers={markers}
                ariaLabel="Peta hasil pencarian warung"
                className="h-[260px]"
              />
            </div>
          </div>

          {/* Right — results */}
          <section aria-label="Daftar hasil rekomendasi" className="space-y-3">
            {isPending ? (
              <div aria-label="Memuat hasil rekomendasi" aria-live="polite" className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="surface-panel animate-pulse p-5"
                  >
                    <div className="h-5 w-40 rounded bg-kopi-100" />
                    <div className="mt-3 h-4 w-full rounded bg-kopi-100" />
                    <div className="mt-2 h-4 w-3/4 rounded bg-kopi-100" />
                    <div className="mt-4 flex gap-2">
                      <div className="h-6 w-16 rounded-md bg-kopi-50" />
                      <div className="h-6 w-20 rounded-md bg-kopi-50" />
                    </div>
                    <div className="surface-inset mt-4 h-20" />
                  </div>
                ))}
              </div>
            ) : results.length === 0 && hasSubmitted ? (
              <div className="surface-inset p-8 text-center">
                <p className="font-semibold text-kopi-900">Tidak ada yang cocok</p>
                <p className="mt-2 text-sm text-kopi-700">
                  Coba ubah detail mood, budget, atau vibe yang dicari.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="surface-inset p-8 text-center">
                <p className="font-semibold text-kopi-900">Belum ada hasil</p>
                <p className="mt-2 text-sm text-kopi-700">
                  Tulis mood kamu di sebelah kiri dan klik Cari warung.
                </p>
              </div>
            ) : (
              results.map((warung, index) => (
                <WarungCard key={warung.id} warung={warung} rank={index + 1} />
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

async function requestMatches(mood: string): Promise<ExploreWarung[]> {
  const response = await fetch("/api/v1/match", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mood }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? "API match sedang gagal diproses.");
  }

  const payload = (await response.json()) as MatchApiResponse;
  return Array.isArray(payload.data) ? payload.data : [];
}

function getHelperText(
  source: ResultSource,
  mood: string,
  resultCount: number,
) {
  if (source === "idle") {
    return "Hasil akan muncul di sini setelah kamu mengirim mood pencarian.";
  }

  if (resultCount === 0) {
    return `Belum ada hasil cocok dari API untuk mood "${mood}".`;
  }

  return `Menampilkan ${resultCount} hasil dari API untuk mood "${mood}".`;
}
