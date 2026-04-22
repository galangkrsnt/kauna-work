"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";

// PTKP 2024 (Rp/tahun)
const PTKP: Record<string, number> = {
  "TK/0": 54_000_000,
  "TK/1": 58_500_000,
  "TK/2": 63_000_000,
  "TK/3": 67_500_000,
  "K/0":  58_500_000,
  "K/1":  63_000_000,
  "K/2":  67_500_000,
  "K/3":  72_000_000,
  "K/I/0": 112_500_000,
  "K/I/1": 117_000_000,
  "K/I/2": 121_500_000,
  "K/I/3": 126_000_000,
};

const STATUS_PTKP = Object.keys(PTKP);

function calcPPh21(gajiPokok: number, tunjangan: number, statusPtkp: string, punyaNpwp: boolean): {
  penghasilanBruto: number;
  biayaJabatan: number;
  penghasilanNeto: number;
  ptkp: number;
  pkp: number;
  pph21Tahunan: number;
  pph21Bulanan: number;
} {
  const penghasilanBruto = (gajiPokok + tunjangan) * 12;
  const biayaJabatan = Math.min(penghasilanBruto * 0.05, 6_000_000);
  const penghasilanNeto = penghasilanBruto - biayaJabatan;
  const ptkp = PTKP[statusPtkp] ?? 54_000_000;
  const pkp = Math.max(0, penghasilanNeto - ptkp);

  // Tarif progresif
  let pph21Tahunan = 0;
  let sisa = pkp;
  const brackets = [
    [60_000_000, 0.05],
    [190_000_000, 0.15],
    [130_000_000, 0.25],
    [Infinity, 0.30],
  ] as [number, number][];

  for (const [batas, tarif] of brackets) {
    if (sisa <= 0) break;
    const kena = Math.min(sisa, batas);
    pph21Tahunan += kena * tarif;
    sisa -= kena;
  }

  if (!punyaNpwp) pph21Tahunan *= 1.2;

  const pph21Bulanan = Math.round(pph21Tahunan / 12);
  return { penghasilanBruto, biayaJabatan, penghasilanNeto, ptkp, pkp, pph21Tahunan: Math.round(pph21Tahunan), pph21Bulanan };
}

function formatRp(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export default function PPh21Page() {
  const [gaji, setGaji] = useState(5_000_000);
  const [tunjangan, setTunjangan] = useState(0);
  const [statusPtkp, setStatusPtkp] = useState("TK/0");
  const [punyaNpwp, setPunyaNpwp] = useState(true);

  const result = calcPPh21(gaji, tunjangan, statusPtkp, punyaNpwp);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-5">
            Kalkulator Pajak Penghasilan
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Kalkulator PPh 21 Karyawan
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Hitung PPh 21 bulanan karyawan berdasarkan tarif progresif terbaru dan status PTKP.
            Gratis, tanpa daftar.
          </p>
        </section>

        {/* Calculator */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid sm:grid-cols-2 gap-6">

            {/* Input */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-semibold text-slate-800">Data Karyawan</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gaji Pokok (Rp)</label>
                <input
                  type="number"
                  value={gaji || ""}
                  onChange={e => setGaji(Number(e.target.value))}
                  min={0}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Total Tunjangan Tetap (Rp)</label>
                <input
                  type="number"
                  value={tunjangan || ""}
                  onChange={e => setTunjangan(Number(e.target.value))}
                  min={0}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status PTKP</label>
                <select
                  value={statusPtkp}
                  onChange={e => setStatusPtkp(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  {STATUS_PTKP.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <p className="text-xs text-slate-400 mt-1">TK = Tidak Kawin, K = Kawin, angka = jumlah tanggungan</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">NPWP</label>
                <div className="flex gap-4">
                  {[true, false].map(val => (
                    <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={punyaNpwp === val}
                        onChange={() => setPunyaNpwp(val)}
                        className="accent-blue-600"
                      />
                      <span className="text-sm text-slate-700">{val ? "Punya NPWP" : "Tidak punya (+20%)"}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="space-y-4">
              <div className="bg-blue-600 rounded-2xl p-6 text-white text-center">
                <p className="text-blue-200 text-sm mb-1">PPh 21 per Bulan</p>
                <p className="text-4xl font-bold">{formatRp(result.pph21Bulanan)}</p>
                <p className="text-blue-200 text-xs mt-2">Setahun: {formatRp(result.pph21Tahunan)}</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-sm">
                <p className="font-semibold text-slate-700 text-xs uppercase tracking-widest mb-2">Rincian Perhitungan</p>
                {[
                  ["Penghasilan Bruto/tahun", result.penghasilanBruto],
                  ["Biaya Jabatan (5%, maks 6jt)", result.biayaJabatan],
                  ["Penghasilan Neto/tahun", result.penghasilanNeto],
                  ["PTKP", result.ptkp],
                  ["PKP (Penghasilan Kena Pajak)", result.pkp],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between text-slate-600">
                    <span>{label as string}</span>
                    <span className="font-medium text-slate-800">{formatRp(value as number)}</span>
                  </div>
                ))}
                {!punyaNpwp && (
                  <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">
                    Tanpa NPWP: tarif dikalikan 120%
                  </p>
                )}
              </div>

              <Link
                href={`/gaji/slip`}
                className="block text-center px-4 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors"
              >
                Buat Slip Gaji Lengkap →
              </Link>
            </div>
          </div>
        </section>

        {/* Explainer */}
        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Apa itu PPh 21?</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                PPh 21 adalah pajak penghasilan yang dipotong dari gaji karyawan oleh perusahaan setiap bulan,
                lalu disetorkan ke negara. Besarnya tergantung penghasilan bruto, status PTKP,
                dan apakah karyawan memiliki NPWP.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Tarif Progresif PPh 21 Terbaru</h2>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3 font-semibold text-slate-600">Penghasilan Kena Pajak (PKP)</th>
                      <th className="text-center px-5 py-3 font-semibold text-slate-600">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ["0 – Rp 60.000.000", "5%"],
                      ["Rp 60.000.001 – Rp 250.000.000", "15%"],
                      ["Rp 250.000.001 – Rp 500.000.000", "25%"],
                      ["Di atas Rp 500.000.000", "30%"],
                    ].map(([bracket, rate]) => (
                      <tr key={bracket} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-slate-700">{bracket}</td>
                        <td className="px-5 py-3 text-center font-semibold text-blue-600">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-2">* Tanpa NPWP: semua tarif dikalikan 120%</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">PTKP (Penghasilan Tidak Kena Pajak) 2024</h2>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                      <th className="text-left px-5 py-3 font-semibold text-slate-600">Keterangan</th>
                      <th className="text-right px-5 py-3 font-semibold text-slate-600">PTKP/tahun</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ["TK/0", "Tidak kawin, 0 tanggungan", "Rp 54.000.000"],
                      ["TK/1", "Tidak kawin, 1 tanggungan", "Rp 58.500.000"],
                      ["TK/2", "Tidak kawin, 2 tanggungan", "Rp 63.000.000"],
                      ["TK/3", "Tidak kawin, 3 tanggungan", "Rp 67.500.000"],
                      ["K/0", "Kawin, 0 tanggungan", "Rp 58.500.000"],
                      ["K/1", "Kawin, 1 tanggungan", "Rp 63.000.000"],
                      ["K/2", "Kawin, 2 tanggungan", "Rp 67.500.000"],
                      ["K/3", "Kawin, 3 tanggungan", "Rp 72.000.000"],
                    ].map(([status, ket, ptkp]) => (
                      <tr key={status} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-medium text-slate-800">{status}</td>
                        <td className="px-5 py-3 text-slate-500">{ket}</td>
                        <td className="px-5 py-3 text-right font-medium text-slate-800">{ptkp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Mau slip gaji langsung jadi?</h2>
          <p className="text-slate-500 text-sm mb-6">
            PPh 21 dihitung otomatis — tinggal isi data karyawan dan download PDF.
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
