"use client";

import { useState, useTransition } from "react";
import type { GeneratedContent, Warung } from "@/lib/types";

type AiContentPanelProps = {
  warung: Warung;
};

export function AiContentPanel({ warung }: AiContentPanelProps) {
  const [isPending, startTransition] = useTransition();
  const [content, setContent] = useState<GeneratedContent>({
    ai_bio: warung.ai_bio ?? "",
    ai_tagline: warung.ai_tagline ?? "",
    ai_captions: warung.ai_captions ?? [],
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
