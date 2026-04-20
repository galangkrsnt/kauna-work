import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kauna Work — Alat Kerja untuk Profesional Indonesia",
  description:
    "Generate slip gaji, faktur, dan dokumen kerja lainnya dengan mudah dan cepat. Gratis untuk penggunaan dasar.",
  keywords: [
    "slip gaji online",
    "buat slip gaji",
    "kalkulator gaji bersih",
    "hitung PPh 21",
    "faktur online",
    "invoice generator indonesia",
  ],
  openGraph: {
    title: "Kauna Work — Alat Kerja untuk Profesional Indonesia",
    description: "Generate slip gaji dan faktur dengan mudah. Gratis untuk penggunaan dasar.",
    type: "website",
    locale: "id_ID",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://work.getkauna.com" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={geist.variable}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
