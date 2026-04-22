"use client";

import { useState } from "react";
import Link from "next/link";

const BPJS_KES_MAX = 12_000_000;
const BPJS_JP_MAX = 9_559_600;

function calcBpjs(gaji: number) {
  const baseKes = Math.min(gaji, BPJS_KES_MAX);
  const baseJP = Math.min(gaji, BPJS_JP_MAX);
  return {
    kesKaryawan: Math.round(baseKes * 0.01),
    kesPerusahaan: Math.round(baseKes * 0.04),
    jhtKaryawan: Math.round(gaji * 0.02),
    jhtPerusahaan: Math.round(gaji * 0.037),
    jpKaryawan: Math.round(baseJP * 0.01),
    jpPerusahaan: Math.round(baseJP * 0.02),
    jkk: Math.round(gaji * 0.0024),
    jkm: Math.round(gaji * 0.003),
  };
}

function formatRp(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export default function BpjsCalculator() {
  const [gaji, setGaji] = useState(5_000_000);
  const b = calcBpjs(gaji);
  const totalKaryawan = b.kesKaryawan + b.jhtKaryawan + b.jpKaryawan;
  const totalPerusahaan = b.kesPerusahaan + b.jhtPerusahaan + b.jpPerusahaan + b.jkk + b.jkm;

  return (
    <div className="grid sm:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h2 className="font-semibold text-slate-800">Gaji Karyawan</h2>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gaji Pokok + Tunjangan Tetap (Rp)</label>
          <input type="number" value={gaji || ""} onChange={e => setGaji(Number(e.target.value))} min={0}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="5000000" />
          <p className="text-xs text-slate-400 mt-1">Basis BPJS Kesehatan maks {formatRp(BPJS_KES_MAX)}, BPJS JP maks {formatRp(BPJS_JP_MAX)}.</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Potongan karyawan</span>
            <span className="font-bold text-slate-900">{formatRp(totalKaryawan)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Tanggungan perusahaan</span>
            <span className="font-bold text-slate-900">{formatRp(totalPerusahaan)}</span>
          </div>
          <div className="border-t border-emerald-200 pt-2 flex justify-between text-sm">
            <span className="font-semibold text-slate-700">Total iuran</span>
            <span className="font-bold text-emerald-700">{formatRp(totalKaryawan + totalPerusahaan)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <p className="font-semibold text-slate-800 text-xs uppercase tracking-widest">Rincian per Program</p>
        {[
          { label: "BPJS Kesehatan", karyawan: b.kesKaryawan, perusahaan: b.kesPerusahaan, note: "1% / 4%" },
          { label: "BPJS JHT",       karyawan: b.jhtKaryawan, perusahaan: b.jhtPerusahaan, note: "2% / 3.7%" },
          { label: "BPJS JP",        karyawan: b.jpKaryawan,  perusahaan: b.jpPerusahaan,  note: "1% / 2%" },
          { label: "BPJS JKK",       karyawan: null,           perusahaan: b.jkk,           note: "0.24% perusahaan" },
          { label: "BPJS JKM",       karyawan: null,           perusahaan: b.jkm,           note: "0.3% perusahaan" },
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

      <div className="sm:col-span-2">
        <Link href="/gaji/slip" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors">
          Buat Slip Gaji Lengkap →
        </Link>
      </div>
    </div>
  );
}
