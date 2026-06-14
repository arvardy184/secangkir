"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { createBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

const INITIAL_FORM = {
  email: "",
  password: "",
};

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const nextPath = useMemo(
    () => searchParams.get("next") || "/dashboard",
    [searchParams],
  );
  const isLogin = mode === "login";
  const heading = isLogin ? "Masuk ke dashboard" : "Buat akun owner";
  const submitLabel = isPending
    ? "Memproses..."
    : isLogin
      ? "Masuk"
      : "Daftar";
  const submitAriaLabel = isLogin
    ? "Login ke dashboard"
    : "Register akun owner";
  const loginTabClass = getModeButtonClass(mode, "login");
  const registerTabClass = getModeButtonClass(mode, "register");

  function updateField(field: keyof typeof INITIAL_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const supabase = createBrowserClient();
      const credentials = {
        email: form.email.trim(),
        password: form.password,
      };

      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword(credentials)
          : await supabase.auth.signUp(credentials);

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (!result.data.session) {
        setMessage(
          "Akun berhasil dibuat, tapi belum ada sesi aktif. Pastikan Confirm email dinonaktifkan di Supabase untuk demo.",
        );
        return;
      }

      router.replace(nextPath);
      router.refresh();
    });
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-kopi-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-kopi-500">Secangkir Auth</p>
          <h1 className="mt-2 text-2xl font-bold text-kopi-900">{heading}</h1>
        </div>
        <Link
          href="/"
          aria-label="Kembali ke landing page"
          className="rounded-full border border-kopi-200 px-4 py-2 text-sm font-medium text-kopi-700 transition hover:bg-kopi-100"
        >
          Kembali
        </Link>
      </div>

      <div
        aria-label="Pilih mode autentikasi"
        className="mt-6 grid grid-cols-2 rounded-2xl bg-kopi-100 p-1"
      >
        <button
          type="button"
          aria-label="Pilih mode login"
          onClick={() => switchMode("login")}
          className={loginTabClass}
        >
          Login
        </button>
        <button
          type="button"
          aria-label="Pilih mode register"
          onClick={() => switchMode("register")}
          className={registerTabClass}
        >
          Register
        </button>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-kopi-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-label="Masukkan email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-2xl border border-kopi-200 bg-kopi-50 px-4 py-3 text-kopi-900 placeholder:text-kopi-300"
            placeholder="owner@secangkir.id"
            required
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-kopi-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            aria-label="Masukkan password"
            value={form.password}
            onChange={(event) => updateField("password", event.target.value)}
            className="w-full rounded-2xl border border-kopi-200 bg-kopi-50 px-4 py-3 text-kopi-900 placeholder:text-kopi-300"
            placeholder="Minimal 6 karakter"
            required
          />
        </div>

        {error ? (
          <p
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        ) : null}

        {message ? (
          <p
            role="status"
            className="rounded-2xl border border-kopi-200 bg-kopi-50 px-4 py-3 text-sm text-kopi-700"
          >
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          aria-label={submitAriaLabel}
          disabled={isPending}
          className="w-full rounded-2xl bg-kopi-700 px-4 py-3 font-semibold text-kopi-50 transition hover:bg-kopi-900 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitLabel}
        </button>
      </form>
    </div>
  );
}

function getModeButtonClass(currentMode: AuthMode, buttonMode: AuthMode) {
  const baseClass = "rounded-xl px-4 py-2 text-sm font-semibold transition";

  if (currentMode === buttonMode) {
    return `${baseClass} bg-white text-kopi-900 shadow-sm`;
  }

  return `${baseClass} text-kopi-700 hover:text-kopi-900`;
}
