import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Secangkir",
  description:
    "Platform dua sisi untuk membantu warung kopi lokal menjangkau pelanggan yang mencari suasana sesuai mood.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
