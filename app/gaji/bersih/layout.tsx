import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator Gaji Bersih (Take-Home Pay) | Kauna Work",
  description:
    "Berapa gaji bersih yang kamu terima setelah potong BPJS dan PPh 21? Hitung take-home pay karyawan secara online, gratis dan akurat.",
  alternates: { canonical: "https://work.getkauna.com/gaji/bersih" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
