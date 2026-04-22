import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isPro } from "@/lib/actions/perusahaan";
import KaryawanForm from "../KaryawanForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Karyawan — Kauna Work",
};

export default async function TambahKaryawanPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const pro = await isPro();
  if (!pro) redirect("/upgrade");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link href="/" className="font-bold"><span className="text-emerald-600">Kauna</span><span className="text-blue-600">Work</span></Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <span>/</span>
            <Link href="/karyawan" className="hover:text-slate-600">Karyawan</Link>
            <span>/</span>
            <span className="text-slate-700">Tambah</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Tambah Karyawan</h1>
        </div>
      </div>
      <KaryawanForm mode="tambah" />
    </div>
  );
}
