"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import type { Karyawan } from "@/lib/actions/karyawan";
import type { Perusahaan } from "@/lib/actions/perusahaan";
import { BULAN, PTKP, formatRp, calcAll } from "@/lib/slip";

// ─── Slip Preview (self-contained for bulk) ───────────────────────────────────

function SlipPreviewBulk({
  karyawan,
  perusahaan,
  periode,
}: {
  karyawan: Karyawan;
  perusahaan: Perusahaan | null;
  periode: { bulan: number; tahun: number };
}) {
  const calc = calcAll({
    gajiPokok: karyawan.gaji_pokok,
    tunjangan: karyawan.tunjangan,
    statusPTKP: karyawan.status_ptkp,
    punyaNPWP: karyawan.punya_npwp,
    includeBpjsKes: karyawan.include_bpjs_kes,
    includeBpjsJHT: karyawan.include_bpjs_jht,
    includeBpjsJP: karyawan.include_bpjs_jp,
    includePph21: karyawan.include_pph21,
    potonganManual: [],
  });

  const periodeStr = `${BULAN[periode.bulan - 1]} ${periode.tahun}`;

  return (
    <div className="bg-white text-sm font-sans p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {perusahaan?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={perusahaan.logo_url} alt="Logo" className="h-10 w-auto object-contain" />
          )}
          <p className="font-bold text-slate-900 text-base">
            {perusahaan?.nama || "Nama Perusahaan"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Slip Gaji</p>
          <p className="text-xs text-slate-500">{periodeStr}</p>
        </div>
      </div>

      {/* Employee info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5 pb-5 border-b border-slate-100 text-xs">
        <div>
          <span className="text-slate-400">Nama</span>
          <p className="font-semibold text-slate-800">{karyawan.nama}</p>
        </div>
        <div>
          <span className="text-slate-400">Jabatan</span>
          <p className="font-semibold text-slate-800">{karyawan.jabatan || "—"}</p>
        </div>
        {karyawan.departemen && (
          <div>
            <span className="text-slate-400">Departemen</span>
            <p className="font-semibold text-slate-800">{karyawan.departemen}</p>
          </div>
        )}
        <div>
          <span className="text-slate-400">Status PTKP</span>
          <p className="font-semibold text-slate-800">{karyawan.status_ptkp}</p>
        </div>
      </div>

      {/* Earnings & deductions */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Penghasilan</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Gaji Pokok</span>
              <span className="font-medium text-slate-800">{formatRp(karyawan.gaji_pokok)}</span>
            </div>
            {karyawan.tunjangan.filter(t => t.jumlah > 0).map(t => (
              <div key={t.id} className="flex justify-between text-xs">
                <span className="text-slate-600">{t.nama || "Tunjangan"}</span>
                <span className="font-medium text-slate-800">{formatRp(t.jumlah)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="font-semibold text-slate-700">Total Penghasilan</span>
            <span className="font-bold text-slate-900">{formatRp(calc.totalPenghasilan)}</span>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Potongan</p>
          <div className="space-y-2">
            {karyawan.include_bpjs_kes && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">BPJS Kesehatan (1%)</span>
                <span className="font-medium text-slate-800">{formatRp(calc.bpjsKes)}</span>
              </div>
            )}
            {karyawan.include_bpjs_jht && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">BPJS JHT (2%)</span>
                <span className="font-medium text-slate-800">{formatRp(calc.bpjsJHT)}</span>
              </div>
            )}
            {karyawan.include_bpjs_jp && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">BPJS JP (1%)</span>
                <span className="font-medium text-slate-800">{formatRp(calc.bpjsJP)}</span>
              </div>
            )}
            {karyawan.include_pph21 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">PPh 21</span>
                <span className="font-medium text-slate-800">{formatRp(calc.pph21)}</span>
              </div>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="font-semibold text-slate-700">Total Potongan</span>
            <span className="font-bold text-red-600">{formatRp(calc.totalPotongan)}</span>
          </div>
        </div>
      </div>

      {/* Gaji bersih */}
      <div className="bg-blue-600 rounded-2xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Gaji Bersih</p>
          <p className="text-white text-xs">Take Home Pay</p>
        </div>
        <p className="text-white text-xl font-bold">{formatRp(calc.gajiBersih)}</p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

const now = new Date();

export default function BulkSlipClient({
  karyawan,
  perusahaan,
}: {
  karyawan: Karyawan[];
  perusahaan: Perusahaan | null;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set(karyawan.map(k => k.id)));
  const [periode, setPeriode] = useState({ bulan: now.getMonth() + 1, tahun: now.getFullYear() });
  const [generated, setGenerated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const selectedList = karyawan.filter(k => selected.has(k.id));

  function toggleAll() {
    if (selected.size === karyawan.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(karyawan.map(k => k.id)));
    }
  }

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function handleGenerate() {
    if (selected.size === 0) return;
    setGenerated(true);
  }

  function handlePrintAll() {
    window.print();
  }

  return (
    <>
      <style>{`
        #bulk-print-root { display: none; }
        @page { margin: 0; size: A4; }
        @media print {
          body > *:not(#bulk-print-root) { display: none !important; }
          #bulk-print-root {
            display: block !important;
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            box-sizing: border-box;
          }
          .bulk-slip-page {
            padding: 32px;
            page-break-after: always;
            box-sizing: border-box;
          }
          .bulk-slip-page:last-child {
            page-break-after: avoid;
          }
          #bulk-print-root * { border: none !important; box-shadow: none !important; outline: none !important; }
          .bg-blue-600 { background-color: #2563eb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .text-white { color: #fff !important; }
          .text-blue-200 { color: #bfdbfe !important; }
        }
      `}</style>

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
        {!generated ? (
          <div className="grid lg:grid-cols-3 gap-6 items-start">

            {/* Left — config */}
            <div className="lg:col-span-1 space-y-5">
              {/* Periode */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <h2 className="font-semibold text-slate-800">Periode</h2>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Bulan</label>
                  <select
                    value={periode.bulan}
                    onChange={e => setPeriode(p => ({ ...p, bulan: Number(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {BULAN.map((b, i) => (
                      <option key={b} value={i + 1}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Tahun</label>
                  <input
                    type="number"
                    value={periode.tahun}
                    onChange={e => setPeriode(p => ({ ...p, tahun: Number(e.target.value) }))}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Karyawan dipilih</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{selected.size}</p>
                <p className="text-xs text-slate-400 mt-1">dari {karyawan.length} karyawan</p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={selected.size === 0}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm shadow-emerald-200"
              >
                Generate {selected.size} Slip Gaji →
              </button>
            </div>

            {/* Right — karyawan selector */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800">Pilih Karyawan</h2>
                <button
                  onClick={toggleAll}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {selected.size === karyawan.length ? "Hapus Semua" : "Pilih Semua"}
                </button>
              </div>
              <ul className="divide-y divide-slate-100">
                {karyawan.map(k => (
                  <li
                    key={k.id}
                    onClick={() => toggle(k.id)}
                    className={`px-5 py-4 flex items-center gap-4 cursor-pointer transition-colors ${
                      selected.has(k.id) ? "bg-emerald-50/50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selected.has(k.id)
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-300"
                    }`}>
                      {selected.has(k.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{k.nama}</p>
                      <p className="text-sm text-slate-500 truncate">
                        {[k.jabatan, k.departemen].filter(Boolean).join(" · ") || "—"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-medium text-slate-700">{formatRp(k.gaji_pokok)}</p>
                      <p className="text-xs text-slate-400">{k.status_ptkp}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          /* Generated view */
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-5 py-4">
              <div>
                <p className="font-semibold text-slate-800">
                  {selectedList.length} slip gaji — {BULAN[periode.bulan - 1]} {periode.tahun}
                </p>
                <p className="text-sm text-slate-500 mt-0.5">
                  Cek preview di bawah, lalu print semua atau per karyawan.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGenerated(false)}
                  className="text-sm text-slate-500 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  ← Ubah Pilihan
                </button>
                <button
                  onClick={handlePrintAll}
                  className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                  ⬇ Print Semua PDF
                </button>
              </div>
            </div>

            {/* Slip cards */}
            <div className="space-y-5">
              {selectedList.map(k => (
                <div key={k.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  {/* Card header */}
                  <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <p className="text-sm font-semibold text-slate-700">{k.nama}</p>
                    <button
                      onClick={() => {
                        const prev = selected;
                        setSelected(new Set([k.id]));
                        setTimeout(() => {
                          window.print();
                          setSelected(prev);
                        }, 100);
                      }}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Print satu →
                    </button>
                  </div>
                  <SlipPreviewBulk
                    karyawan={k}
                    perusahaan={perusahaan}
                    periode={periode}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Print portal — all slips with page breaks */}
      {mounted && generated && createPortal(
        <div id="bulk-print-root">
          {selectedList.map(k => (
            <div key={k.id} className="bulk-slip-page">
              <SlipPreviewBulk karyawan={k} perusahaan={perusahaan} periode={periode} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
