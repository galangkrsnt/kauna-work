import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getKaryawan } from "@/lib/actions/karyawan";
import { isPro } from "@/lib/actions/perusahaan";
import { getSlipHistory } from "@/lib/actions/slip-history";
import SlipHistorySection from "./SlipHistorySection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detail Karyawan — Kauna Work",
};

function formatRp(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default async function DetailKaryawanPage({ params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const pro = await isPro();
  if (!pro) redirect("/upgrade");

  const { id } = await params;
  const [semua, history] = await Promise.all([getKaryawan(), getSlipHistory(id)]);
  const karyawan = semua.find((k) => k.id === id);
  if (!karyawan) notFound();

  const totalTunjangan = karyawan.tunjangan.reduce((s, t) => s + t.jumlah, 0);

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
            <span className="text-slate-700">{karyawan.nama}</span>
          </div>
          <div className="flex items-center justify-between gap-4 mt-1">
            <h1 className="text-xl font-bold text-slate-900">{karyawan.nama}</h1>
            <div className="flex items-center gap-2">
              <Link
                href={`/gaji/slip?karyawanId=${karyawan.id}`}
                className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Buat Slip
              </Link>
              <Link
                href={`/karyawan/${karyawan.id}/edit`}
                className="text-sm border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Edit
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">

        {/* Info card */}
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          <div className="px-5 py-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Identitas</p>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <div>
                <p className="text-slate-400 text-xs">Jabatan</p>
                <p className="font-medium text-slate-800">{karyawan.jabatan || "—"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Departemen</p>
                <p className="font-medium text-slate-800">{karyawan.departemen || "—"}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Status PTKP</p>
                <p className="font-medium text-slate-800">{karyawan.status_ptkp}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">NPWP</p>
                <p className="font-medium text-slate-800">{karyawan.punya_npwp ? "Punya NPWP" : "Tidak punya"}</p>
              </div>
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Kompensasi</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Gaji Pokok</span>
                <span className="font-medium text-slate-800">{formatRp(karyawan.gaji_pokok)}</span>
              </div>
              {karyawan.tunjangan.map(t => (
                <div key={t.id} className="flex justify-between">
                  <span className="text-slate-500">{t.nama}</span>
                  <span className="font-medium text-slate-800">{formatRp(t.jumlah)}</span>
                </div>
              ))}
              {totalTunjangan > 0 && (
                <div className="flex justify-between pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">Total</span>
                  <span className="font-bold text-slate-900">{formatRp(karyawan.gaji_pokok + totalTunjangan)}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Potongan Otomatis</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "BPJS Kesehatan", active: karyawan.include_bpjs_kes },
                { label: "BPJS JHT", active: karyawan.include_bpjs_jht },
                { label: "BPJS JP", active: karyawan.include_bpjs_jp },
                { label: "PPh 21", active: karyawan.include_pph21 },
              ].map(({ label, active }) => (
                <span
                  key={label}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    active
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "bg-slate-100 text-slate-400 line-through"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Slip history */}
        <SlipHistorySection history={history} karyawanId={id} />

      </div>
    </div>
  );
}
