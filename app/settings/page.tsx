import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getPerusahaan, isPro } from "@/lib/actions/perusahaan";
import PerusahaanForm from "./PerusahaanForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan — Kauna Work",
};

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const pro = await isPro();
  if (!pro) redirect("/upgrade");

  const perusahaan = await getPerusahaan();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link href="/" className="font-bold"><span className="text-emerald-600">Kauna</span><span className="text-blue-600">Work</span></Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-700">Pengaturan</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Pengaturan</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-1">Profil Perusahaan</h2>
          <p className="text-sm text-slate-500 mb-5">
            Data ini akan otomatis terisi di setiap slip gaji yang kamu buat.
          </p>
          <PerusahaanForm
            defaultValues={{
              nama: perusahaan?.nama ?? "",
              logo_url: perusahaan?.logo_url ?? "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
