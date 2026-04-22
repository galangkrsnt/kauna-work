"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";

const BPJS_KES_MAX = 12_000_000;
const BPJS_JP_MAX = 9_559_600;

function calcBpjs(gaji: number) {
  const baseKes = Math.min(gaji, BPJS_KES_MAX);
  const baseJP = Math.min(gaji, BPJS_JP_MAX);

  return {
    // BPJS Kesehatan
    kesKaryawan: Math.round(baseKes * 0.01),
    kesPerusahaan: Math.round(baseKes * 0.04),
    // BPJS JHT
    jhtKaryawan: Math.round(gaji * 0.02),
    jhtPerusahaan: Math.round(gaji * 0.037),
    // BPJS JP
    jpKaryawan: Math.round(baseJP * 0.01),
    jpPerusahaan: Math.round(baseJP * 0.02),
    // BPJS JKK (perusahaan only, estimasi)
    jkk: Math.round(gaji * 0.0024),
    // BPJS JKM (perusahaan only)
    jkm: Math.round(gaji * 0.003),
  };
}

function formatRp(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export default function BpjsPage() {
  const [gaji, setGaji] = useState(5_000_000);
  const b = calcBpjs(gaji);

  const totalPotonganKaryawan = b.kesKaryawan + b.jhtKaryawan + b.jpKaryawan;
  const totalTanggungPerusahaan = b.kesPerusahaan + b.jhtPerusahaan + b.jpPerusahaan + b.jkk + b.jkm;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold mb-5">
            Kalkulator BPJS
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Kalkulator Iuran BPJS Karyawan
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Hitung iuran BPJS Kesehatan, JHT, JP, JKK, dan JKM — bagian karyawan dan perusahaan.
            Otomatis, gratis.
          </p>
        </section>

        {/* Calculator */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid sm:grid-cols-2 gap-6">

            {/* Input */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-semibold text-slate-800">Gaji Karyawan</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gaji Pokok + Tunjangan Tetap (Rp)</label>
                <input
                  type="number"
                  value={gaji || ""}
                  onChange={e => setGaji(Number(e.target.value))}
                  min={0}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="5000000"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Basis BPJS Kesehatan maks {formatRp(BPJS_KES_MAX)}, BPJS JP maks {formatRp(BPJS_JP_MAX)}.
                </p>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Potongan karyawan</span>
                  <span className="font-bold text-slate-900">{formatRp(totalPotonganKaryawan)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tanggungan perusahaan</span>
                  <span className="font-bold text-slate-900">{formatRp(totalTanggungPerusahaan)}</span>
                </div>
                <div className="border-t border-emerald-200 pt-2 flex justify-between text-sm">
                  <span className="font-semibold text-slate-700">Total iuran</span>
                  <span className="font-bold text-emerald-700">{formatRp(totalPotonganKaryawan + totalTanggungPerusahaan)}</span>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <p className="font-semibold text-slate-800 text-xs uppercase tracking-widest">Rincian per Program</p>

              {[
                {
                  label: "BPJS Kesehatan",
                  karyawan: b.kesKaryawan,
                  perusahaan: b.kesPerusahaan,
                  note: "1% karyawan / 4% perusahaan",
                },
                {
                  label: "BPJS JHT",
                  karyawan: b.jhtKaryawan,
                  perusahaan: b.jhtPerusahaan,
                  note: "2% karyawan / 3.7% perusahaan",
                },
                {
                  label: "BPJS JP",
                  karyawan: b.jpKaryawan,
                  perusahaan: b.jpPerusahaan,
                  note: "1% karyawan / 2% perusahaan",
                },
                {
                  label: "BPJS JKK",
                  karyawan: null,
                  perusahaan: b.jkk,
                  note: "0.24% perusahaan (rata-rata)",
                },
                {
                  label: "BPJS JKM",
                  karyawan: null,
                  perusahaan: b.jkm,
                  note: "0.3% perusahaan",
                },
              ].map(item => (
                <div key={item.label} className="border border-slate-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <span className="text-xs text-slate-400">{item.note}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-400">Karyawan</p>
                      <p className="font-medium text-slate-800">{item.karyawan !== null ? formatRp(item.karyawan) : "—"}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">Perusahaan</p>
                      <p className="font-medium text-slate-800">{formatRp(item.perusahaan)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/gaji/slip"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors"
            >
              Buat Slip Gaji Lengkap →
            </Link>
          </div>
        </section>

        {/* Explainer */}
        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
            <h2 className="text-xl font-bold text-slate-900">Panduan Iuran BPJS Ketenagakerjaan & Kesehatan</h2>

            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Program</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Karyawan</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Perusahaan</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Batas Gaji</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["BPJS Kesehatan", "1%", "4%", "Maks Rp 12.000.000"],
                    ["BPJS JHT", "2%", "3,7%", "Tidak ada batas"],
                    ["BPJS JP", "1%", "2%", "Maks Rp 9.559.600"],
                    ["BPJS JKK", "—", "0,24%*", "Tidak ada batas"],
                    ["BPJS JKM", "—", "0,3%", "Tidak ada batas"],
                  ].map(([prog, k, p, batas]) => (
                    <tr key={prog} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-800">{prog}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{k}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{p}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{batas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400">* JKK bervariasi 0.24%–1.74% tergantung risiko pekerjaan. Kalkulator ini memakai 0.24% (risiko sangat rendah).</p>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Slip gaji dengan BPJS otomatis</h2>
          <p className="text-slate-500 text-sm mb-6">
            Semua potongan BPJS dihitung dan tampil langsung di slip gaji. Download PDF gratis.
          </p>
          <Link
            href="/gaji/slip"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
          >
            Buat Slip Gaji Gratis →
          </Link>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <span>© 2026 Kauna Work · Bagian dari getkauna.com</span>
        <div className="flex gap-4">
          <Link href="/tentang" className="hover:text-slate-600 transition-colors">Tentang</Link>
          <Link href="/kebijakan-privasi" className="hover:text-slate-600 transition-colors">Privasi</Link>
          <Link href="/kontak" className="hover:text-slate-600 transition-colors">Kontak</Link>
        </div>
      </footer>
    </div>
  );
}
