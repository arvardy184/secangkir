"use client";

import { useState, useTransition } from "react";
import type { GeneratedContent, GeneratedImageContent, Warung } from "@/lib/types";

type AiContentPanelProps = {
  warung: Warung;
};

export function AiContentPanel({ warung }: AiContentPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [isImagePending, startImageTransition] = useTransition();
  const [content, setContent] = useState<GeneratedContent>({
    ai_bio: warung.ai_bio ?? "",
    ai_tagline: warung.ai_tagline ?? "",
    ai_captions: warung.ai_captions ?? [],
  });
  const [imageContent, setImageContent] = useState<GeneratedImageContent>({
    ai_image_prompt: warung.ai_image_prompt ?? "",
    ai_image_url: warung.ai_image_url ?? "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasContent =
    Boolean(content.ai_bio) ||
    Boolean(content.ai_tagline) ||
    content.ai_captions.length > 0;

  function handleGenerate() {
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warung_id: warung.id }),
      });

      const payload = (await response.json()) as
        | { data: GeneratedContent }
        | { error: string };

      if (!response.ok || !("data" in payload)) {
        setError("error" in payload ? payload.error : "Gagal generate konten AI.");
        return;
      }

      setContent(payload.data);
      setMessage("Konten berhasil dibuat dan disimpan.");
    });
  }

  async function copyText(value: string) {
    await navigator.clipboard.writeText(value);
    setMessage("Disalin ke clipboard.");
  }

  function handleGenerateImage() {
    setError(null);
    setMessage(null);

    startImageTransition(async () => {
      const response = await fetch("/api/v1/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ warung_id: warung.id }),
      });

      const payload = (await response.json()) as
        | { data: GeneratedImageContent }
        | { error: string };

      if (!response.ok || !("data" in payload)) {
        setError("error" in payload ? payload.error : "Gagal generate poster.");
        return;
      }

      setImageContent(payload.data);
      setMessage("Poster berhasil dibuat dan disimpan.");
    });
  }

  return (
    <section className="mt-6 border-t border-kopi-200 pt-6">
      {/* Section header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-section">Konten AI</p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-kopi-900">
            Bio, tagline &amp; caption
          </h2>
          <p className="mt-1 text-sm text-kopi-700">
            Generate konten promosi dari profil warung.
          </p>
        </div>

        <button
          type="button"
          aria-label={hasContent ? "Regenerate konten AI" : "Generate konten AI"}
          disabled={isPending}
          onClick={handleGenerate}
          className="btn-primary shrink-0"
        >
          {isPending ? "Memproses..." : hasContent ? "Regenerate" : "Generate"}
        </button>
      </div>

      {/* Feedback */}
      {error ? (
        <p role="alert" className="alert-error mt-4">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="alert-success mt-4">
          {message}
        </p>
      ) : null}

      {/* Content */}
      {hasContent ? (
        <div className="mt-5 space-y-3">
          {content.ai_tagline ? (
            <ContentBlock label="Tagline" value={content.ai_tagline} onCopy={copyText} />
          ) : null}
          {content.ai_bio ? (
            <ContentBlock label="Bio" value={content.ai_bio} onCopy={copyText} />
          ) : null}
          {content.ai_captions.length > 0 ? (
            <div className="space-y-2">
              <p className="label-section">Caption Instagram</p>
              {content.ai_captions.map((caption, index) => (
                <ContentBlock
                  key={`caption-${index}`}
                  label={`Caption ${index + 1}`}
                  value={caption}
                  onCopy={copyText}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="surface-inset mt-5 p-5 text-sm text-kopi-700">
          Belum ada konten AI. Klik <strong>Generate</strong> setelah profil warung diisi.
        </div>
      )}

      <section className="mt-8 border-t border-kopi-200 pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="label-section">Poster Instagram</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-kopi-900">
              Visual promosi
            </h2>
            <p className="mt-1 text-sm text-kopi-700">
              Generate poster 1:1 untuk preview Instagram. Hasil terbaik muncul
              setelah bio, tagline, dan caption tersedia.
            </p>
          </div>
          <button
            type="button"
            aria-label={
              imageContent.ai_image_url
                ? "Regenerate poster Instagram"
                : "Generate poster Instagram"
            }
            disabled={isImagePending}
            onClick={handleGenerateImage}
            className="btn-primary shrink-0"
          >
            {isImagePending
              ? "Memproses..."
              : imageContent.ai_image_url
                ? "Regenerate Poster"
                : "Generate Poster"}
          </button>
        </div>

        {imageContent.ai_image_url ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
            <div className="overflow-hidden rounded-[24px] border border-kopi-200 bg-kopi-50">
              <img
                src={imageContent.ai_image_url}
                alt={`Poster Instagram ${warung.nama}`}
                className="aspect-square h-full w-full object-cover"
              />
            </div>
            <div className="surface-inset p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="label-section">Prompt visual</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-kopi-700">
                    {imageContent.ai_image_prompt}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Salin prompt poster"
                  onClick={() => copyText(imageContent.ai_image_prompt)}
                  className="btn-secondary shrink-0 px-3 py-1.5 text-xs"
                >
                  Salin
                </button>
              </div>
              <a
                href={imageContent.ai_image_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Buka poster ${warung.nama}`}
                className="btn-secondary mt-4 inline-flex px-3 py-1.5 text-xs"
              >
                Buka gambar
              </a>
            </div>
          </div>
        ) : (
          <div className="surface-inset mt-5 p-5 text-sm leading-relaxed text-kopi-700">
            Belum ada poster. Generate content dulu untuk hasil visual yang lebih
            relevan, lalu klik <strong>Generate Poster</strong>.
          </div>
        )}
      </section>
    </section>
  );
}

function ContentBlock({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: (value: string) => void;
}) {
  return (
    <article className="surface-inset p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="label-section">{label}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-kopi-700">{value}</p>
        </div>
        <button
          type="button"
          aria-label={`Salin ${label}`}
          onClick={() => onCopy(value)}
          className="btn-secondary shrink-0 px-3 py-1.5 text-xs"
        >
          Salin
        </button>
      </div>
    </article>
  );
}
