import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { createServerClient } from "@/lib/supabase/server";

export default async function AuthPage() {
  const hasSupabaseEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (hasSupabaseEnv) {
    const supabase = createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) redirect("/dashboard");
  }

  return (
    <div className="page-shell">
      <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-12 lg:grid-cols-[1fr_400px] lg:items-center">

          {/* Left — context */}
          <section>
            <p className="label-section mb-4">Owner Portal</p>
            <h1 className="font-display text-4xl font-semibold text-kopi-900 md:text-5xl">
              Kelola warung kopi Anda dari satu tempat.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-kopi-700">
              Login atau buat akun untuk mulai onboarding warung, menentukan
              lokasi di peta, lalu generate konten promosi dengan AI.
            </p>

            <div className="mt-8 space-y-3 border-t border-kopi-200 pt-8">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-kopi-100 text-xs font-bold text-kopi-700">
                  1
                </span>
                <p className="text-sm text-kopi-700">
                  Isi profil warung — nama, vibe, harga, dan alamat.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-kopi-100 text-xs font-bold text-kopi-700">
                  2
                </span>
                <p className="text-sm text-kopi-700">
                  Tentukan lokasi warung di peta dengan klik atau drag marker.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-kopi-100 text-xs font-bold text-kopi-700">
                  3
                </span>
                <p className="text-sm text-kopi-700">
                  Generate bio, tagline, dan 5 caption Instagram siap pakai.
                </p>
              </div>
            </div>
          </section>

          {/* Right — form */}
          <Suspense
            fallback={
              <div className="surface-panel w-full p-8 text-sm text-kopi-700">
                Memuat...
              </div>
            }
          >
            <AuthForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
