import Link from "next/link";

export default function Home() {
  return (
    <div className="page-shell">
      {/* Nav */}
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5"
      >
        <Link
          href="/"
          aria-label="Go to Secangkir homepage"
          className="flex items-center gap-2.5"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-kopi-900 text-[11px] font-bold tracking-widest text-white">
            Sk
          </span>
          <span className="font-display text-xl font-semibold text-kopi-900">
            Secangkir
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link href="/explore" aria-label="Explore coffee shops" className="nav-link">
            Explore
          </Link>
          <Link
            href="/auth"
            aria-label="Masuk sebagai pemilik warung"
            className="btn-primary"
          >
            Owner Login
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 lg:pt-20">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">

          {/* Left — copy */}
          <div>
            <p className="label-section mb-4">Platform warung kopi lokal</p>
            <h1 className="font-display text-5xl font-semibold text-kopi-900 md:text-6xl">
              Cari warung kopi yang cocok dengan mood kamu.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-kopi-700">
              Tulis suasana yang kamu cari — tenang buat nugas, rame untuk
              ngobrol, outdoor dengan wifi — dan Secangkir akan mencocokkan
              warung terbaik lengkap dengan alasannya.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/explore"
                aria-label="Mulai jelajahi warung kopi"
                className="btn-primary-lg"
              >
                Cari warung kopi
              </Link>
              <Link
                href="/auth"
                aria-label="Daftarkan warung kopi Anda"
                className="btn-secondary-lg"
              >
                Daftarkan warung
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-12 flex gap-8 border-t border-kopi-200 pt-8">
              <div>
                <p className="text-2xl font-semibold text-kopi-900">AI</p>
                <p className="mt-1 text-sm text-kopi-700">Mood matching</p>
              </div>
              <div className="border-l border-kopi-200 pl-8">
                <p className="text-2xl font-semibold text-kopi-900">5</p>
                <p className="mt-1 text-sm text-kopi-700">Caption siap pakai</p>
              </div>
              <div className="border-l border-kopi-200 pl-8">
                <p className="text-2xl font-semibold text-kopi-900">≤3</p>
                <p className="mt-1 text-sm text-kopi-700">Hasil terbaik</p>
              </div>
            </div>
          </div>

          {/* Right — feature cards */}
          <div className="space-y-3 lg:pt-4">
            {/* Dark hero card */}
            <div className="surface-dark px-6 py-6">
              <p className="label-section text-kopi-300">Untuk pengunjung</p>
              <p className="mt-3 font-display text-2xl font-semibold text-white leading-snug">
                "Mau nugas, suasana tenang, budget 20rb"
              </p>
              <p className="mt-3 text-sm leading-relaxed text-kopi-200">
                Cukup tulis mood kamu. Secangkir mencocokkan warung yang paling
                relevan dan menjelaskan alasan kecocokannya.
              </p>
            </div>

            {/* Two smaller cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="surface-panel p-5">
                <p className="label-section">Untuk owner</p>
                <p className="mt-2 text-sm leading-relaxed text-kopi-700">
                  Isi profil sekali. Dapatkan bio, tagline, dan 5 caption
                  Instagram siap pakai.
                </p>
              </div>
              <div className="surface-panel p-5">
                <p className="label-section">UMKM lokal</p>
                <p className="mt-2 text-sm leading-relaxed text-kopi-700">
                  Dibuat untuk warung kopi Indonesia yang ingin lebih mudah
                  ditemukan pelanggan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
