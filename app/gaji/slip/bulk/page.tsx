import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import { getKaryawan } from "@/lib/actions/karyawan";
import { getPerusahaan, isPro } from "@/lib/actions/perusahaan";
import BulkSlipClient from "./BulkSlipClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bulk Slip Gaji — Kauna Work",
};

export default async function BulkSlipPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const pro = await isPro();
  if (!pro) redirect("/upgrade");

  const [karyawan, perusahaan] = await Promise.all([getKaryawan(), getPerusahaan()]);

  if (karyawan.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <p className="text-4xl mb-4">👥</p>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Belum ada karyawan</h1>
            <p className="text-sm text-slate-500 mb-6">
              Tambahkan karyawan terlebih dahulu untuk menggunakan fitur bulk generate.
            </p>
            <Link
              href="/karyawan/tambah"
              className="bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Tambah Karyawan
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
            <Link href="/" className="font-bold"><span className="text-emerald-600">Kauna</span><span className="text-blue-600">Work</span></Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
            <span>/</span>
            <span className="text-slate-700">Bulk Slip Gaji</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Bulk Slip Gaji</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Pilih karyawan dan periode, generate semua slip sekaligus.
          </p>
        </div>
      </div>
      <BulkSlipClient karyawan={karyawan} perusahaan={perusahaan} />
    </div>
  );
}
