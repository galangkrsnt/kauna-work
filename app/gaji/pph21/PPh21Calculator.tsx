"use client";

import { useState } from "react";
import Link from "next/link";

const PTKP: Record<string, number> = {
  "TK/0": 54_000_000, "TK/1": 58_500_000, "TK/2": 63_000_000, "TK/3": 67_500_000,
  "K/0":  58_500_000, "K/1":  63_000_000,  "K/2":  67_500_000, "K/3":  72_000_000,
  "K/I/0": 112_500_000, "K/I/1": 117_000_000, "K/I/2": 121_500_000, "K/I/3": 126_000_000,
};

const STATUS_PTKP = Object.keys(PTKP);

function calcPPh21(gajiPokok: number, tunjangan: number, statusPtkp: string, punyaNpwp: boolean) {
  const penghasilanBruto = (gajiPokok + tunjangan) * 12;
  const biayaJabatan = Math.min(penghasilanBruto * 0.05, 6_000_000);
  const penghasilanNeto = penghasilanBruto - biayaJabatan;
  const ptkp = PTKP[statusPtkp] ?? 54_000_000;
  const pkp = Math.max(0, penghasilanNeto - ptkp);

  let pph21Tahunan = 0;
  let sisa = pkp;
  for (const [batas, tarif] of [[60_000_000, 0.05], [190_000_000, 0.15], [130_000_000, 0.25], [Infinity, 0.30]] as [number, number][]) {
    if (sisa <= 0) break;
    pph21Tahunan += Math.min(sisa, batas) * tarif;
    sisa -= batas;
  }
  if (!punyaNpwp) pph21Tahunan *= 1.2;

  return { penghasilanBruto, biayaJabatan, penghasilanNeto, ptkp, pkp, pph21Tahunan: Math.round(pph21Tahunan), pph21Bulanan: Math.round(pph21Tahunan / 12) };
}

function formatRp(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export default function PPh21Calculator() {
  const [gaji, setGaji] = useState(5_000_000);
  const [tunjangan, setTunjangan] = useState(0);
  const [statusPtkp, setStatusPtkp] = useState("TK/0");
  const [punyaNpwp, setPunyaNpwp] = useState(true);
  const result = calcPPh21(gaji, tunjangan, statusPtkp, punyaNpwp);

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h2 className="font-semibold text-slate-800">Data Karyawan</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gaji Pokok (Rp)</label>
          <input type="number" value={gaji || ""} onChange={e => setGaji(Number(e.target.value))} min={0}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="5000000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Total Tunjangan Tetap (Rp)</label>
          <input type="number" value={tunjangan || ""} onChange={e => setTunjangan(Number(e.target.value))} min={0}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status PTKP</label>
          <select value={statusPtkp} onChange={e => setStatusPtkp(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {STATUS_PTKP.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <p className="text-xs text-slate-400 mt-1">TK = Tidak Kawin, K = Kawin, angka = jumlah tanggungan</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">NPWP</label>
          <div className="flex gap-4">
            {[true, false].map(val => (
              <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" checked={punyaNpwp === val} onChange={() => setPunyaNpwp(val)} className="accent-blue-600" />
                <span className="text-sm text-slate-700">{val ? "Punya NPWP" : "Tidak punya (+20%)"}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-600 rounded-2xl p-6 text-white text-center">
          <p className="text-blue-200 text-sm mb-1">PPh 21 per Bulan</p>
          <p className="text-4xl font-bold">{formatRp(result.pph21Bulanan)}</p>
          <p className="text-blue-200 text-xs mt-2">Setahun: {formatRp(result.pph21Tahunan)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-sm">
          <p className="font-semibold text-slate-700 text-xs uppercase tracking-widest mb-2">Rincian Perhitungan</p>
          {([
            ["Penghasilan Bruto/tahun", result.penghasilanBruto],
            ["Biaya Jabatan (5%, maks 6jt)", result.biayaJabatan],
            ["Penghasilan Neto/tahun", result.penghasilanNeto],
            ["PTKP", result.ptkp],
            ["PKP (Penghasilan Kena Pajak)", result.pkp],
          ] as [string, number][]).map(([label, value]) => (
            <div key={label} className="flex justify-between text-slate-600">
              <span>{label}</span>
              <span className="font-medium text-slate-800">{formatRp(value)}</span>
            </div>
          ))}
          {!punyaNpwp && (
            <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 border border-amber-100">Tanpa NPWP: tarif dikalikan 120%</p>
          )}
        </div>
        <Link href="/gaji/slip" className="block text-center px-4 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors">
          Buat Slip Gaji Lengkap →
        </Link>
      </div>
    </div>
  );
}
