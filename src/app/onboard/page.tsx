import Link from "next/link";
import { redirect } from "next/navigation";
import { OnboardForm } from "@/components/OnboardForm";
import { createServerClient } from "@/lib/supabase/server";
import type { Warung } from "@/lib/types";

export default async function OnboardPage() {
  const hasSupabaseEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabaseEnv) {
    redirect("/auth");
  }

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: warung } = await supabase
    .from("warung")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<Warung>();

  return (
    <div className="page-shell">
      <nav
        aria-label="Navigasi onboarding"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kopi-900 text-[11px] font-bold tracking-widest text-white">
            Sk
          </span>
          <span className="font-display text-xl font-semibold text-kopi-900">
            Onboarding
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" aria-label="Kembali ke dashboard owner" className="nav-link">
            Dashboard
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              aria-label="Keluar dari akun owner"
              className="btn-secondary"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-4">
        <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:items-start">
          <section>
            <p className="label-section mb-3">Onboarding Warung</p>
            <h1 className="font-display text-4xl font-semibold text-kopi-900">
              Lengkapi profil warung kopi Anda.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-kopi-700">
              Data ini dipakai untuk rekomendasi mood pengunjung dan konten AI.
            </p>

            <div className="surface-inset mt-6 p-4">
              <p className="label-section mb-2">Yang sebaiknya diisi</p>
              <ol className="space-y-2 text-sm text-kopi-700">
                <li className="flex gap-2">
                  <span className="shrink-0 font-semibold text-kopi-500">1.</span>
                  Nama warung yang mudah diingat.
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-semibold text-kopi-500">2.</span>
                  Vibe yang paling terasa saat pengunjung datang.
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-semibold text-kopi-500">3.</span>
                  Titik lokasi yang akurat agar mudah ditemukan.
                </li>
              </ol>
            </div>
          </section>

          <OnboardForm initialWarung={warung ?? null} />
        </div>
      </main>
    </div>
  );
}
