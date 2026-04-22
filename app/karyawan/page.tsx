import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getKaryawan } from "@/lib/actions/karyawan";
import { isPro } from "@/lib/actions/perusahaan";
import KaryawanActions from "./KaryawanActions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Karyawan — Kauna Work",
};

export default async function KaryawanPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const pro = await isPro();
  if (!pro) redirect("/upgrade");

  const karyawan = await getKaryawan();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
              <Link href="/" className="font-bold"><span className="text-emerald-600">Kauna</span><span className="text-blue-600">Work</span></Link>
              <span>/</span>
              <Link href="/dashboard" className="hover:text-slate-600">Dashboard</Link>
              <span>/</span>
              <span className="text-slate-700">Karyawan</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Daftar Karyawan</h1>
          </div>
          <Link
            href="/karyawan/tambah"
            className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            + Tambah
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {karyawan.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 px-6 py-16 text-center">
            <p className="text-slate-400">Belum ada karyawan tersimpan.</p>
            <Link
              href="/karyawan/tambah"
              className="mt-4 inline-block bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Tambah Karyawan Pertama
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {karyawan.map((k) => (
              <div key={k.id} className="px-5 py-4 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-slate-800 truncate">{k.nama}</p>
                  <p className="text-sm text-slate-500 truncate">
                    {[k.jabatan, k.departemen].filter(Boolean).join(" · ") || "—"}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PTKP {k.status_ptkp} · Gaji Rp {k.gaji_pokok.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
                  <Link
                    href={`/gaji/slip?karyawanId=${k.id}`}
                    className="text-sm bg-blue-50 text-blue-600 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Buat Slip
                  </Link>
                  <Link
                    href={`/karyawan/${k.id}`}
                    className="text-sm text-slate-500 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Detail & Riwayat
                  </Link>
                  <KaryawanActions id={k.id} nama={k.nama} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
