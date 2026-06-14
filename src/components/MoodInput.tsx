"use client";

import { useState, type FormEvent } from "react";

type MoodInputProps = {
  onSubmit: (mood: string) => Promise<void> | void;
  isPending?: boolean;
  initialValue?: string;
};

export function MoodInput({
  onSubmit,
  isPending = false,
  initialValue = "",
}: MoodInputProps) {
  const [mood, setMood] = useState(initialValue);
  const trimmed = mood.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (trimmed.length < 3 || isPending) return;
    await onSubmit(trimmed);
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={isPending}
      className="surface-panel p-5"
    >
      <div className="space-y-1.5">
        <label htmlFor="mood-input" className="field-label">
          Ceritain mood kamu
        </label>
        <textarea
          id="mood-input"
          name="mood"
          aria-label="Masukkan mood untuk mencari warung"
          aria-describedby="mood-hint"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="field min-h-[100px] resize-y"
          placeholder="mau nugas, suasana tenang, budget 20rb, ada wifi"
          minLength={3}
          maxLength={500}
          required
        />
        <p id="mood-hint" className="text-xs text-kopi-500">
          Jelaskan vibe, budget, atau kebutuhan seperti wifi dan tempat duduk.
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          aria-label="Cari warung berdasarkan mood"
          disabled={isPending || trimmed.length < 3}
          className="btn-primary"
        >
          {isPending ? "Mencari..." : "Cari warung"}
        </button>
        <p aria-live="polite" className="text-xs text-kopi-500">
          Maksimal 3 hasil terbaik.
        </p>
      </div>
    </form>
  );
}
