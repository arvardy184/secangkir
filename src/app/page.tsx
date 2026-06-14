import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-kopi-50">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5"
      >
        <Link
          href="/"
          aria-label="Go to Secangkir homepage"
          className="text-lg font-semibold tracking-tight text-kopi-900"
        >
          Secangkir
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/explore"
            aria-label="Explore coffee shops"
            className="rounded-full px-4 py-2 text-sm font-medium text-kopi-700 transition hover:bg-kopi-100"
          >
            Explore
          </Link>
          <Link
            href="/auth"
            aria-label="Masuk sebagai pemilik warung"
            className="rounded-full bg-kopi-700 px-4 py-2 text-sm font-medium text-kopi-50 transition hover:bg-kopi-900"
          >
            Owner Login
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] w-full max-w-6xl gap-12 px-6 pb-16 pt-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="max-w-2xl">
          <span className="inline-flex rounded-full border border-kopi-200 bg-kopi-100 px-4 py-2 text-sm font-medium text-kopi-700">
            Platform UMKM kopi lokal berbasis AI
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-kopi-900 md:text-6xl">
            Temukan warung kopi yang cocok dengan mood dan vibe kamu.
          </h1>
          <p className="mt-5 text-base leading-8 text-kopi-700 md:text-lg">
            Secangkir menghubungkan pencinta kopi dengan warung kopi lokal
            Indonesia. Pemilik warung bisa membuat profil dan konten promosi
            lebih cepat, sementara pengunjung bisa mencari tempat berdasarkan
            suasana, budget, dan kebutuhan mereka.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/explore"
              aria-label="Mulai jelajahi warung kopi"
              className="rounded-2xl bg-kopi-500 px-6 py-3 text-center font-semibold text-kopi-50 transition hover:bg-kopi-700"
            >
              Cari warung kopi
            </Link>
            <Link
              href="/auth"
              aria-label="Daftarkan warung kopi Anda"
              className="rounded-2xl border border-kopi-200 bg-white px-6 py-3 text-center font-semibold text-kopi-700 transition hover:bg-kopi-100"
            >
              Daftarkan warung
            </Link>
          </div>
        </div>

        <section
          aria-label="Ringkasan manfaat platform"
          className="grid gap-4 rounded-3xl border border-kopi-200 bg-white p-6 shadow-sm"
        >
          <article className="rounded-2xl bg-kopi-50 p-5">
            <p className="text-sm font-semibold text-kopi-500">Untuk owner</p>
            <p className="mt-2 text-sm leading-7 text-kopi-700">
              Isi profil warung, tentukan pin lokasi, lalu generate bio,
              tagline, dan caption Instagram dengan AI.
            </p>
          </article>
          <article className="rounded-2xl bg-kopi-50 p-5">
            <p className="text-sm font-semibold text-kopi-500">Untuk pengunjung</p>
            <p className="mt-2 text-sm leading-7 text-kopi-700">
              Cukup tulis mood seperti "mau nugas, suasana tenang, budget 20rb"
              dan sistem akan mencocokkan warung terbaik beserta alasannya.
            </p>
          </article>
          <article className="rounded-2xl bg-kopi-50 p-5">
            <p className="text-sm font-semibold text-kopi-500">Untuk demo</p>
            <p className="mt-2 text-sm leading-7 text-kopi-700">
              Dibangun dengan Next.js, Supabase, Tailwind, dan Claude untuk
              menonjolkan arsitektur rapi, keamanan dasar, dan pengalaman pakai
              yang cepat.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
