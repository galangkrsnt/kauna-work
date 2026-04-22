import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Navbar from "../../components/Navbar";
import SlipGajiClient from "./SlipGajiClient";
import { getKaryawan } from "@/lib/actions/karyawan";
import { getPerusahaan, isPro } from "@/lib/actions/perusahaan";

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

export default async function SlipGajiPage({
  searchParams,
}: {
  searchParams: Promise<{ karyawanId?: string }>;
}) {
  const { userId } = await auth();
  const { karyawanId } = await searchParams;

  let initialKaryawan = null;
  let initialPerusahaan = null;
  let pro = false;

  if (userId) {
    [initialPerusahaan, pro] = await Promise.all([getPerusahaan(), isPro()]);
    if (karyawanId) {
      const list = await getKaryawan();
      initialKaryawan = list.find((k) => k.id === karyawanId) ?? null;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <SlipGajiClient
        initialKaryawan={initialKaryawan}
        initialPerusahaan={initialPerusahaan}
        karyawanId={karyawanId}
        isPro={pro}
      />
    </div>
  );
}
