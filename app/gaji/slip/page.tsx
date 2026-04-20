import type { Metadata } from "next";
import Navbar from "../../components/Navbar";
import SlipGajiClient from "./SlipGajiClient";

export const metadata: Metadata = {
  title: "Generator Slip Gaji Online Gratis | Kauna Work",
  description:
    "Buat slip gaji profesional secara online. PPh 21 dan BPJS dihitung otomatis. Download PDF gratis, tanpa daftar.",
  keywords: [
    "slip gaji online",
    "buat slip gaji",
    "generator slip gaji",
    "hitung PPh 21",
    "hitung BPJS karyawan",
    "slip gaji gratis",
  ],
  alternates: { canonical: "https://work.getkauna.com/gaji/slip" },
};

export default function SlipGajiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SlipGajiClient />
    </div>
  );
}
