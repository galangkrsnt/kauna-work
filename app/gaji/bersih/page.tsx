"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";

const PTKP: Record<string, number> = {
  "TK/0": 54_000_000, "TK/1": 58_500_000, "TK/2": 63_000_000, "TK/3": 67_500_000,
  "K/0": 58_500_000,  "K/1": 63_000_000,  "K/2": 67_500_000,  "K/3": 72_000_000,
};

const BPJS_KES_MAX = 12_000_000;
const BPJS_JP_MAX = 9_559_600;

function calcAll(gaji: number, tunjangan: number, statusPtkp: string, punyaNpwp: boolean, bpjsKes: boolean, bpjsJHT: boolean, bpjsJP: boolean, pph21: boolean) {
  const total = gaji + tunjangan;

  const potonganBpjsKes = bpjsKes ? Math.round(Math.min(total, BPJS_KES_MAX) * 0.01) : 0;
  const potonganBpjsJHT = bpjsJHT ? Math.round(total * 0.02) : 0;
  const potonganBpjsJP = bpjsJP ? Math.round(Math.min(total, BPJS_JP_MAX) * 0.01) : 0;

  let potonganPPh21 = 0;
  if (pph21) {
    const bruto = total * 12;
    const biayaJabatan = Math.min(bruto * 0.05, 6_000_000);
    const neto = bruto - biayaJabatan;
    const ptkpVal = PTKP[statusPtkp] ?? 54_000_000;
    const pkp = Math.max(0, neto - ptkpVal);

    let pajak = 0;
    let sisa = pkp;
    for (const [batas, tarif] of [[60_000_000, 0.05], [190_000_000, 0.15], [130_000_000, 0.25], [Infinity, 0.30]] as [number, number][]) {
      if (sisa <= 0) break;
      pajak += Math.min(sisa, batas) * tarif;
      sisa -= batas;
    }
    if (!punyaNpwp) pajak *= 1.2;
    potonganPPh21 = Math.round(pajak / 12);
  }

  const totalPotongan = potonganBpjsKes + potonganBpjsJHT + potonganBpjsJP + potonganPPh21;
  const gajiBersih = total - totalPotongan;

  return { total, potonganBpjsKes, potonganBpjsJHT, potonganBpjsJP, potonganPPh21, totalPotongan, gajiBersih };
}

function formatRp(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

export default function GajiBersihPage() {
  const [gaji, setGaji] = useState(5_000_000);
  const [tunjangan, setTunjangan] = useState(0);
  const [statusPtkp, setStatusPtkp] = useState("TK/0");
  const [punyaNpwp, setPunyaNpwp] = useState(true);
  const [bpjsKes, setBpjsKes] = useState(true);
  const [bpjsJHT, setBpjsJHT] = useState(true);
  const [bpjsJP, setBpjsJP] = useState(true);
  const [pph21, setPph21] = useState(true);

  const r = calcAll(gaji, tunjangan, statusPtkp, punyaNpwp, bpjsKes, bpjsJHT, bpjsJP, pph21);

  const potonganItems = [
    { label: "BPJS Kesehatan (1%)", value: r.potonganBpjsKes, active: bpjsKes },
    { label: "BPJS JHT (2%)", value: r.potonganBpjsJHT, active: bpjsJHT },
    { label: "BPJS JP (1%)", value: r.potonganBpjsJP, active: bpjsJP },
    { label: "PPh 21", value: r.potonganPPh21, active: pph21 },
  ].filter(x => x.active);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-5">
            Kalkulator Gaji Bersih
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Hitung Gaji Bersih (Take-Home Pay)
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Berapa gaji yang benar-benar kamu terima setelah dipotong BPJS dan PPh 21?
            Hitung di sini dalam detik.
          </p>
        </section>

        {/* Calculator */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid sm:grid-cols-2 gap-6">

            {/* Input */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-semibold text-slate-800">Data Gaji</h2>

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
                <label className="block text-sm font-medium text-slate-700 mb-1">Tunjangan Tetap (Rp)</label>
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
                  {Object.keys(PTKP).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">NPWP</label>
                <div className="flex gap-4">
                  {[true, false].map(val => (
                    <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" checked={punyaNpwp === val} onChange={() => setPunyaNpwp(val)} className="accent-blue-600" />
                      <span className="text-sm text-slate-700">{val ? "Punya" : "Tidak punya (+20%)"}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Potongan yang berlaku</label>
                <div className="space-y-2">
                  {[
                    { label: "BPJS Kesehatan", val: bpjsKes, set: setBpjsKes },
                    { label: "BPJS JHT", val: bpjsJHT, set: setBpjsJHT },
                    { label: "BPJS JP", val: bpjsJP, set: setBpjsJP },
                    { label: "PPh 21", val: pph21, set: setPph21 },
                  ].map(item => (
                    <label key={item.label} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={item.val} onChange={e => item.set(e.target.checked)} className="accent-blue-600" />
                      <span className="text-sm text-slate-700">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-2xl p-6 text-white text-center">
                <p className="text-slate-400 text-sm mb-1">Gaji Bersih (Take-Home Pay)</p>
                <p className="text-4xl font-bold">{formatRp(r.gajiBersih)}</p>
                <p className="text-slate-400 text-xs mt-2">per bulan</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-sm">
                <p className="font-semibold text-slate-700 text-xs uppercase tracking-widest">Rincian</p>
                <div className="flex justify-between text-slate-600">
                  <span>Gaji Pokok + Tunjangan</span>
                  <span className="font-medium text-slate-800">{formatRp(r.total)}</span>
                </div>
                {potonganItems.map(item => (
                  <div key={item.label} className="flex justify-between text-slate-600">
                    <span>– {item.label}</span>
                    <span className="font-medium text-red-500">({formatRp(item.value)})</span>
                  </div>
                ))}
                <div className="border-t border-slate-100 pt-3 flex justify-between">
                  <span className="font-semibold text-slate-700">Total potongan</span>
                  <span className="font-bold text-red-500">({formatRp(r.totalPotongan)})</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">Gaji Bersih</span>
                  <span className="font-bold text-slate-900">{formatRp(r.gajiBersih)}</span>
                </div>
              </div>

              <Link
                href="/gaji/slip"
                className="block text-center px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Buat Slip Gaji Lengkap →
              </Link>
            </div>
          </div>
        </section>

        {/* Info */}
        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Komponen Potongan Gaji Karyawan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "BPJS Kesehatan", pct: "1%", desc: "Dari gaji/tunjangan, maks Rp 12.000.000. Perusahaan menanggung 4% tambahan." },
                { title: "BPJS JHT", pct: "2%", desc: "Jaminan Hari Tua. Dana bisa dicairkan saat pensiun atau keluar kerja." },
                { title: "BPJS JP", pct: "1%", desc: "Jaminan Pensiun. Maks gaji Rp 9.559.600. Perusahaan menanggung 2%." },
                { title: "PPh 21", pct: "Progresif", desc: "Pajak penghasilan, dihitung dari PKP setelah dikurangi PTKP dan biaya jabatan." },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{item.pct}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Slip gaji dengan semua potongan otomatis</h2>
          <p className="text-slate-500 text-sm mb-6">
            Generate slip gaji profesional. BPJS dan PPh 21 dihitung otomatis. Download PDF gratis.
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
