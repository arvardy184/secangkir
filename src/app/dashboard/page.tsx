import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import type { Warung } from "@/lib/types";

export default async function DashboardPage() {
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
    <main className="min-h-screen bg-kopi-50 px-6 py-16">
      <section className="mx-auto max-w-4xl rounded-3xl border border-kopi-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-kopi-500">
              Dashboard Owner
            </p>
            <h1 className="mt-2 text-3xl font-bold text-kopi-900">
              Selamat datang, {user.email}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-kopi-700">
              Sesi login aktif dan halaman owner berhasil diproteksi.
              Lengkapi profil warung agar fitur AI dan pencarian mood bisa
              memakai data Anda.
            </p>
          </div>

          <form action="/auth/signout" method="post">
            <button
              type="submit"
              aria-label="Keluar dari dashboard"
              className="rounded-2xl bg-kopi-700 px-5 py-3 font-semibold text-kopi-50 transition hover:bg-kopi-900"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="mt-8 rounded-2xl border border-kopi-200 bg-kopi-50 p-5">
          <p className="text-sm font-semibold text-kopi-500">
            {warung ? "Profil warung aktif" : "Profil warung belum lengkap"}
          </p>
          <h2 className="mt-2 text-xl font-bold text-kopi-900">
            {warung?.nama ?? "Daftarkan warung pertama Anda"}
          </h2>
          <p className="mt-2 text-sm leading-7 text-kopi-700">
            {warung
              ? `${warung.alamat ?? "Alamat belum diisi"} - ${warung.price_range ?? "Harga belum diisi"}`
              : "Isi profil, vibe, harga, alamat, dan koordinat lokasi untuk melanjutkan."}
          </p>
          <Link
            href="/onboard"
            aria-label={warung ? "Edit profil warung" : "Daftarkan warung"}
            className="mt-4 inline-flex rounded-full bg-kopi-700 px-4 py-2 text-sm font-semibold text-kopi-50 transition hover:bg-kopi-900"
          >
            {warung ? "Edit warung" : "Mulai onboarding"}
          </Link>
        </div>
      </section>
    </main>
  );
}
