"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

const INITIAL_FORM = { email: "", password: "" };

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Guard against open redirect
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const nextPath = rawNext.startsWith("/") ? rawNext : "/dashboard";

  const isLogin = mode === "login";

  function updateField(field: keyof typeof INITIAL_FORM, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function switchMode(next: AuthMode) {
    setMode(next);
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const supabase = createBrowserClient();
      const credentials = { email: form.email.trim(), password: form.password };

      const result = isLogin
        ? await supabase.auth.signInWithPassword(credentials)
        : await supabase.auth.signUp(credentials);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (!result.data.session) {
        setMessage(
          isLogin
            ? "Login berhasil namun sesi tidak terbuat. Pastikan email sudah dikonfirmasi."
            : "Akun berhasil dibuat. Jika tidak langsung masuk, pastikan Confirm email dinonaktifkan di Supabase.",
        );
        return;
      }

      router.replace(nextPath);
      router.refresh();
    });
  }

  return (
    <div className="surface-panel w-full p-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="label-section">Secangkir Auth</p>
          <h1 className="mt-1.5 font-display text-2xl font-semibold text-kopi-900">
            {isLogin ? "Masuk ke dashboard" : "Buat akun owner"}
          </h1>
        </div>
        <Link href="/" aria-label="Kembali ke landing page" className="btn-ghost text-xs">
          Kembali
        </Link>
      </div>

      {/* Mode toggle */}
      <div
        aria-label="Pilih mode autentikasi"
        className="mt-6 grid grid-cols-2 rounded-lg bg-kopi-100 p-1"
      >
        <button
          type="button"
          aria-label="Pilih mode login"
          onClick={() => switchMode("login")}
          className={`rounded-md py-2 text-sm font-semibold transition-colors ${
            isLogin
              ? "bg-white text-kopi-900 shadow-sm"
              : "text-kopi-500 hover:text-kopi-700"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          aria-label="Pilih mode register"
          onClick={() => switchMode("register")}
          className={`rounded-md py-2 text-sm font-semibold transition-colors ${
            !isLogin
              ? "bg-white text-kopi-900 shadow-sm"
              : "text-kopi-500 hover:text-kopi-700"
          }`}
        >
          Register
        </button>
      </div>

      {/* Form */}
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label htmlFor="email" className="field-label">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-label="Masukkan email"
            value={form.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="field"
            placeholder="owner@warungkopi.id"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="field-label">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            aria-label="Masukkan password"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
            className="field"
            placeholder="Minimal 6 karakter"
            required
          />
        </div>

        {error ? (
          <p role="alert" className="alert-error">
            {error}
          </p>
        ) : null}

        {message ? (
          <p role="status" className="alert-info">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          aria-label={isLogin ? "Login ke dashboard" : "Register akun owner"}
          disabled={isPending}
          className="btn-primary w-full py-3"
        >
          {isPending ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
        </button>
      </form>
    </div>
  );
}
