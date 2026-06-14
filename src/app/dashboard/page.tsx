import Link from "next/link";
import { redirect } from "next/navigation";
import { AiContentPanel } from "@/components/AiContentPanel";
import { createServerClient } from "@/lib/supabase/server";
import type { Warung } from "@/lib/types";

export default async function DashboardPage() {
  const hasSupabaseEnv =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!hasSupabaseEnv) redirect("/auth");

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth");

  const { data: warung } = await supabase
    .from("warung")
    .select("*")
    .eq("owner_id", user.id)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle<Warung>();

  return (
    <div className="page-shell">
      {/* Nav */}
      <nav
        aria-label="Dashboard navigation"
        className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kopi-900 text-[11px] font-bold tracking-widest text-white">
            Sk
          </span>
          <span className="font-display text-xl font-semibold text-kopi-900">
            Dashboard
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/explore" aria-label="Buka halaman explore" className="nav-link">
            Explore
          </Link>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              aria-label="Keluar dari dashboard"
              className="btn-secondary"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="mx-auto w-full max-w-5xl px-6 pb-16 pt-2">
        <div className="surface-panel p-6 md:p-8">

          {/* Header */}
          <div className="border-b border-kopi-200 pb-6">
            <p className="label-section">Owner</p>
            <h1 className="mt-1.5 font-display text-3xl font-semibold text-kopi-900">
              {user.email}
            </h1>
          </div>

          {/* Warung status + checklist */}
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="surface-inset p-5">
              <p className="label-section">
                {warung ? "Warung aktif" : "Belum ada warung"}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-kopi-900">
                {warung?.nama ?? "Daftarkan warung pertama Anda"}
              </h2>
              <p className="mt-1.5 text-sm text-kopi-700">
                {warung
                  ? [warung.alamat, warung.price_range].filter(Boolean).join(" · ")
                  : "Isi profil, vibe, harga, alamat, dan koordinat lokasi."}
              </p>
              <Link
                href="/onboard"
                aria-label={warung ? "Edit profil warung" : "Mulai onboarding warung"}
                className="btn-primary mt-4 inline-flex"
              >
                {warung ? "Edit warung" : "Mulai onboarding"}
              </Link>
            </div>

            <div className="surface-inset p-5">
              <p className="label-section">Langkah selanjutnya</p>
              <ol className="mt-3 space-y-2.5 text-sm text-kopi-700">
                <li className="flex gap-2.5">
                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${warung ? "bg-emerald-100 text-emerald-700" : "bg-kopi-100 text-kopi-700"}`}>
                    {warung ? "✓" : "1"}
                  </span>
                  Lengkapi profil warung dan titik lokasi.
                </li>
                <li className="flex gap-2.5">
                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${warung?.vibe_tags?.length ? "bg-emerald-100 text-emerald-700" : "bg-kopi-100 text-kopi-700"}`}>
                    {warung?.vibe_tags?.length ? "✓" : "2"}
                  </span>
                  Pastikan vibe dan harga sudah sesuai.
                </li>
                <li className="flex gap-2.5">
                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded text-[10px] font-bold ${warung?.ai_bio ? "bg-emerald-100 text-emerald-700" : "bg-kopi-100 text-kopi-700"}`}>
                    {warung?.ai_bio ? "✓" : "3"}
                  </span>
                  Generate bio, tagline, dan caption promosi.
                </li>
              </ol>
            </div>
          </div>

          {/* AI content panel */}
          {warung ? <AiContentPanel warung={warung} /> : null}
        </div>
      </main>
    </div>
  );
}
