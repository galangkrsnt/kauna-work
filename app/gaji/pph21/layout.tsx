import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator PPh 21 Karyawan Online Gratis | Kauna Work",
  description:
    "Hitung PPh 21 bulanan karyawan secara online. Tarif progresif terbaru, pilih status PTKP, langsung tahu berapa pajak yang dipotong dari gaji. Gratis.",
  alternates: { canonical: "https://work.getkauna.com/gaji/pph21" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
