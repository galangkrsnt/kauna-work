import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator Iuran BPJS Karyawan Online | Kauna Work",
  description:
    "Hitung iuran BPJS Kesehatan, JHT, JP, JKK, dan JKM karyawan secara otomatis. Tampil bagian karyawan dan perusahaan. Gratis, tanpa daftar.",
  alternates: { canonical: "https://work.getkauna.com/gaji/bpjs" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
