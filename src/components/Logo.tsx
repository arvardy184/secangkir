import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      aria-label="Go to Secangkir homepage"
      className="flex items-center gap-2.5"
    >
      <Image
        src="/logo.png"
        alt="Secangkir logo"
        width={32}
        height={32}
        className="rounded-lg"
        priority
      />
      <span className="font-display text-xl font-semibold text-kopi-900">
        Secangkir
      </span>
    </Link>
  );
}
