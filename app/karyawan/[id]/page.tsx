import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getKaryawan } from "@/lib/actions/karyawan";
import { isPro } from "@/lib/actions/perusahaan";
import KaryawanForm from "../KaryawanForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Karyawan — Kauna Work",
};

export default async function EditKaryawanPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const pro = await isPro();
  if (!pro) redirect("/upgrade");

  const { id } = await params;
  const semua = await getKaryawan();
  const karyawan = semua.find((k) => k.id === id);
  if (!karyawan) notFound();

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
            <span className="text-slate-700">Edit</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Edit — {karyawan.nama}</h1>
        </div>
      </div>
      <KaryawanForm
        mode="edit"
        id={karyawan.id}
        defaultValues={{
          nama: karyawan.nama,
          jabatan: karyawan.jabatan,
          departemen: karyawan.departemen,
          status_ptkp: karyawan.status_ptkp,
          punya_npwp: karyawan.punya_npwp,
          gaji_pokok: karyawan.gaji_pokok,
          tunjangan: karyawan.tunjangan,
          include_bpjs_kes: karyawan.include_bpjs_kes,
          include_bpjs_jht: karyawan.include_bpjs_jht,
          include_bpjs_jp: karyawan.include_bpjs_jp,
          include_pph21: karyawan.include_pph21,
        }}
      />
    </div>
  );
}
