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
    <main className="min-h-screen bg-kopi-50 px-6 py-10">
      <section className="mx-auto w-full max-w-5xl">
        <nav
          aria-label="Navigasi onboarding"
          className="mb-8 flex items-center justify-between gap-4"
        >
          <Link
            href="/dashboard"
            aria-label="Kembali ke dashboard owner"
            className="rounded-full border border-kopi-200 bg-white px-4 py-2 text-sm font-medium text-kopi-700 transition hover:bg-kopi-100"
          >
            Dashboard
          </Link>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              aria-label="Keluar dari akun owner"
              className="rounded-full bg-kopi-700 px-4 py-2 text-sm font-semibold text-kopi-50 transition hover:bg-kopi-900"
            >
              Sign out
            </button>
          </form>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <section>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-kopi-500">
              Onboarding Warung
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-kopi-900">
              Lengkapi profil warung kopi Anda.
            </h1>
            <p className="mt-5 text-base leading-8 text-kopi-700">
              Data ini dipakai untuk dashboard owner, rekomendasi mood
              pengunjung, dan konten AI di tahap berikutnya.
            </p>
          </section>

          <OnboardForm initialWarung={warung ?? null} />
        </div>
      </section>
    </main>
  );
}
