"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import type { SlipHistory } from "@/lib/actions/slip-history";
import { deleteSlipHistory } from "@/lib/actions/slip-history";
import { BULAN, formatRp } from "@/lib/slip";
import { useRouter } from "next/navigation";

const BULAN_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

function SlipPreviewPrint({ slip }: { slip: SlipHistory }) {
  const d = slip.data_slip;
  const periodeStr = `${BULAN[slip.periode_bulan - 1]} ${slip.periode_tahun}`;

  return (
    <div className="bg-white text-sm font-sans p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {d.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={d.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          )}
          <p className="font-bold text-slate-900 text-base">{d.namaPerusahaan || "Nama Perusahaan"}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Slip Gaji</p>
          <p className="text-xs text-slate-500">{periodeStr}</p>
        </div>
      </div>

      {/* Employee info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5 pb-5 border-b border-slate-100 text-xs">
        <div><span className="text-slate-400">Nama</span><p className="font-semibold text-slate-800">{d.namaKaryawan}</p></div>
        <div><span className="text-slate-400">Jabatan</span><p className="font-semibold text-slate-800">{d.jabatan || "—"}</p></div>
        {d.departemen && <div><span className="text-slate-400">Departemen</span><p className="font-semibold text-slate-800">{d.departemen}</p></div>}
        <div><span className="text-slate-400">Status PTKP</span><p className="font-semibold text-slate-800">{d.statusPTKP}</p></div>
      </div>

      {/* Earnings & deductions */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Penghasilan</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Gaji Pokok</span>
              <span className="font-medium text-slate-800">{formatRp(d.gajiPokok)}</span>
            </div>
            {d.tunjangan.filter(t => t.jumlah > 0).map(t => (
              <div key={t.id} className="flex justify-between text-xs">
                <span className="text-slate-600">{t.nama}</span>
                <span className="font-medium text-slate-800">{formatRp(t.jumlah)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="font-semibold text-slate-700">Total Penghasilan</span>
            <span className="font-bold text-slate-900">{formatRp(d.calc.totalPenghasilan)}</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Potongan</p>
          <div className="space-y-2">
            {d.includeBpjsKes && <div className="flex justify-between text-xs"><span className="text-slate-600">BPJS Kesehatan (1%)</span><span className="font-medium text-slate-800">{formatRp(d.calc.bpjsKes)}</span></div>}
            {d.includeBpjsJHT && <div className="flex justify-between text-xs"><span className="text-slate-600">BPJS JHT (2%)</span><span className="font-medium text-slate-800">{formatRp(d.calc.bpjsJHT)}</span></div>}
            {d.includeBpjsJP && <div className="flex justify-between text-xs"><span className="text-slate-600">BPJS JP (1%)</span><span className="font-medium text-slate-800">{formatRp(d.calc.bpjsJP)}</span></div>}
            {d.includePph21 && <div className="flex justify-between text-xs"><span className="text-slate-600">PPh 21</span><span className="font-medium text-slate-800">{formatRp(d.calc.pph21)}</span></div>}
            {d.potonganManual.filter(p => p.jumlah > 0).map(p => (
              <div key={p.id} className="flex justify-between text-xs"><span className="text-slate-600">{p.nama}</span><span className="font-medium text-slate-800">{formatRp(p.jumlah)}</span></div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="font-semibold text-slate-700">Total Potongan</span>
            <span className="font-bold text-red-600">{formatRp(d.calc.totalPotongan)}</span>
          </div>
        </div>
      </div>

      <div className="bg-blue-600 rounded-2xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest">Gaji Bersih</p>
          <p className="text-white text-xs">Take Home Pay</p>
        </div>
        <p className="text-white text-xl font-bold">{formatRp(d.calc.gajiBersih)}</p>
      </div>
    </div>
  );
}

export default function SlipHistorySection({ history, karyawanId }: { history: SlipHistory[]; karyawanId: string }) {
  const router = useRouter();
  const [viewing, setViewing] = useState<SlipHistory | null>(null);
  const [mounted, setMounted] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  if (typeof window !== "undefined" && !mounted) setMounted(true);

  async function handleDelete(id: string) {
    setDeleting(id);
    try {
      await deleteSlipHistory(id);
      router.refresh();
    } catch {
      alert("Gagal menghapus.");
    } finally {
      setDeleting(null);
    }
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-slate-800 mb-1">Riwayat Slip</h2>
        <p className="text-sm text-slate-400">Belum ada slip tersimpan. Buat slip untuk karyawan ini dari halaman Slip Gaji.</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        #history-print-root { display: none; }
        @page { margin: 0; size: A4; }
        @media print {
          body > *:not(#history-print-root) { display: none !important; }
          #history-print-root { display: block !important; position: absolute; top: 0; left: 0; width: 100%; box-sizing: border-box; }
          #history-print-root * { border: none !important; box-shadow: none !important; outline: none !important; }
          .bg-blue-600 { background-color: #2563eb !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .text-white { color: #fff !important; }
          .text-blue-200 { color: #bfdbfe !important; }
        }
      `}</style>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Riwayat Slip</h2>
          <p className="text-xs text-slate-400 mt-0.5">{history.length} slip tersimpan</p>
        </div>
        <ul className="divide-y divide-slate-100">
          {history.map(h => (
            <li key={h.id} className="px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {BULAN[h.periode_bulan - 1]} {h.periode_tahun}
                </p>
                <p className="text-xs text-slate-400">
                  Gaji Bersih: <span className="font-semibold text-slate-600">{formatRp(h.data_slip.calc.gajiBersih)}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewing(h)}
                  className="text-xs text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Lihat
                </button>
                <button
                  onClick={() => handleDelete(h.id)}
                  disabled={deleting === h.id}
                  className="text-xs text-red-400 px-2.5 py-1 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
                >
                  {deleting === h.id ? "..." : "Hapus"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Slip viewer modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <p className="font-semibold text-slate-800">
                Slip — {BULAN[viewing.periode_bulan - 1]} {viewing.periode_tahun}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ⬇ Print PDF
                </button>
                <button
                  onClick={() => setViewing(null)}
                  className="text-slate-400 hover:text-slate-600 text-xl leading-none px-2"
                >
                  ✕
                </button>
              </div>
            </div>
            <SlipPreviewPrint slip={viewing} />
          </div>
        </div>
      )}

      {/* Print portal */}
      {mounted && viewing && createPortal(
        <div id="history-print-root">
          <SlipPreviewPrint slip={viewing} />
        </div>,
        document.body
      )}
    </>
  );
}
