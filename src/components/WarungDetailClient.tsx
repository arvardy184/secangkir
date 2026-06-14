"use client";

import { useState } from "react";

type WarungDetailClientProps = {
  captions: string[];
};

export function WarungDetailClient({ captions }: WarungDetailClientProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  async function handleCopy(text: string, index: number) {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }

  return (
    <div className="space-y-2">
      {captions.map((caption, index) => (
        <article key={`caption-${index}`} className="surface-inset p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="label-section mb-1">Caption {index + 1}</p>
              <p className="text-sm leading-relaxed text-kopi-700">{caption}</p>
            </div>
            <button
              type="button"
              aria-label={`Salin caption ${index + 1}`}
              onClick={() => handleCopy(caption, index)}
              className="btn-secondary shrink-0 px-3 py-1.5 text-xs"
            >
              {copiedIndex === index ? "Disalin ✓" : "Salin"}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
