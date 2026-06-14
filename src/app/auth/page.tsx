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

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-kopi-50 px-6 py-16">
      <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-kopi-500">
            Owner Portal
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-kopi-900 md:text-5xl">
            Login atau daftar untuk mulai mengelola profil warung kopi Anda.
          </h1>
          <p className="mt-5 text-base leading-8 text-kopi-700 md:text-lg">
            Setelah masuk, Anda akan diarahkan ke dashboard. Dari sana owner
            bisa melanjutkan onboarding warung, menambahkan lokasi, lalu
            generate konten AI untuk kebutuhan promosi.
          </p>
        </section>

        <Suspense
          fallback={
            <div className="w-full max-w-md rounded-3xl border border-kopi-200 bg-white p-8 text-sm text-kopi-700 shadow-sm">
              Memuat form auth...
            </div>
          }
        >
          <AuthForm />
        </Suspense>
      </div>
    </main>
  );
}
