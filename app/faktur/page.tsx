import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Navbar from "../components/Navbar";
import FakturClient from "./FakturClient";
import { isPro } from "@/lib/actions/perusahaan";
import { getFakturItems, getFakturById } from "@/lib/actions/faktur";

export const metadata: Metadata = {
  title: "Generator Faktur Online Gratis — Kauna Work",
  description:
    "Buat faktur dan invoice profesional secara online. Hitung PPN otomatis, download PDF gratis. Tanpa daftar, langsung pakai.",
  keywords: ["faktur online", "invoice generator", "buat faktur pdf", "kalkulator ppn", "invoice indonesia gratis"],
  alternates: { canonical: "https://work.getkauna.com/faktur" },
  openGraph: {
    title: "Generator Faktur Online Gratis — Kauna Work",
    description: "Buat faktur profesional, hitung PPN otomatis, download PDF. Gratis.",
    type: "website",
  },
};

export default async function FakturPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { userId } = await auth();
  const pro = userId ? await isPro() : false;
  const { from } = await searchParams;

  const [savedItems, historyRow] = await Promise.all([
    pro ? getFakturItems() : Promise.resolve([]),
    pro && from ? getFakturById(from) : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <FakturClient
        isPro={pro}
        savedItems={savedItems}
        initialData={historyRow?.data_faktur as Record<string, unknown> | undefined}
        historyId={historyRow?.id}
      />
    </div>
  );
}
