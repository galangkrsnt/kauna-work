"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { Karyawan } from "@/lib/actions/karyawan";
import type { Perusahaan } from "@/lib/actions/perusahaan";
import { saveSlipHistory } from "@/lib/actions/slip-history";

// ─── Types ───────────────────────────────────────────────────────────────────

type Item = { id: string; nama: string; jumlah: number };

type FormData = {
  namaPerusahaan: string;
  logoUrl: string;
  periode: { bulan: number; tahun: number };
  namaKaryawan: string;
  jabatan: string;
  departemen: string;
  statusPTKP: string;
  punyaNPWP: boolean;
  gajiPokok: number;
  tunjangan: Item[];
  includeBpjsKes: boolean;
  includeBpjsJHT: boolean;
  includeBpjsJP: boolean;
  includePph21: boolean;
  potonganManual: Item[];
};

// ─── Constants ────────────────────────────────────────────────────────────────

const BULAN = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const PTKP: Record<string, number> = {
  "TK/0": 54_000_000,
  "TK/1": 58_500_000,
  "TK/2": 63_000_000,
  "TK/3": 67_500_000,
  "K/0":  58_500_000,
  "K/1":  63_000_000,
  "K/2":  67_500_000,
  "K/3":  72_000_000,
};

const BPJS_KES_MAX  = 12_000_000;
const BPJS_JP_MAX   = 9_559_600;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function formatRp(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function calcPPh21(totalBulanan: number, ptkpKey: string, punyaNPWP: boolean): number {
  const annual      = totalBulanan * 12;
  const biayaJab    = Math.min(annual * 0.05, 6_000_000);
  const netAnnual   = annual - biayaJab;
  const pkp         = Math.max(0, netAnnual - (PTKP[ptkpKey] ?? PTKP["TK/0"]));

  // Round PKP down to nearest 1000
  const pkpRounded  = Math.floor(pkp / 1_000) * 1_000;

  let tax = 0;
  const brackets = [
    { limit: 60_000_000,    rate: 0.05 },
    { limit: 250_000_000,   rate: 0.15 },
    { limit: 500_000_000,   rate: 0.25 },
    { limit: 5_000_000_000, rate: 0.30 },
    { limit: Infinity,      rate: 0.35 },
  ];

  let remaining = pkpRounded;
  let prev = 0;
  for (const b of brackets) {
    if (remaining <= 0) break;
    const slice = Math.min(remaining, b.limit - prev);
    tax += slice * b.rate;
    remaining -= slice;
    prev = b.limit;
  }

  const monthlyTax = tax / 12;
  return punyaNPWP ? monthlyTax : monthlyTax * 1.2;
}

function calcAll(f: FormData) {
  const totalTunjangan   = f.tunjangan.reduce((s, t) => s + (t.jumlah || 0), 0);
  const totalPenghasilan = (f.gajiPokok || 0) + totalTunjangan;

  const bpjsKes  = f.includeBpjsKes  ? Math.min(totalPenghasilan, BPJS_KES_MAX) * 0.01 : 0;
  const bpjsJHT  = f.includeBpjsJHT  ? totalPenghasilan * 0.02 : 0;
  const bpjsJP   = f.includeBpjsJP   ? Math.min(totalPenghasilan, BPJS_JP_MAX) * 0.01 : 0;
  const pph21    = f.includePph21     ? calcPPh21(totalPenghasilan, f.statusPTKP, f.punyaNPWP) : 0;

  const totalPotonganManual = f.potonganManual.reduce((s, p) => s + (p.jumlah || 0), 0);
  const totalPotongan       = bpjsKes + bpjsJHT + bpjsJP + pph21 + totalPotonganManual;
  const gajiBersih          = totalPenghasilan - totalPotongan;

  return { totalTunjangan, totalPenghasilan, bpjsKes, bpjsJHT, bpjsJP, pph21, totalPotonganManual, totalPotongan, gajiBersih };
}

// ─── Default state ────────────────────────────────────────────────────────────

const now = new Date();

const DEFAULT: FormData = {
  namaPerusahaan: "",
  logoUrl: "",
  periode: { bulan: now.getMonth() + 1, tahun: now.getFullYear() },
  namaKaryawan: "",
  jabatan: "",
  departemen: "",
  statusPTKP: "TK/0",
  punyaNPWP: true,
  gajiPokok: 0,
  tunjangan: [],
  includeBpjsKes: true,
  includeBpjsJHT: true,
  includeBpjsJP: true,
  includePph21: true,
  potonganManual: [],
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function InputText({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
      />
    </div>
  );
}

function InputMoney({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">Rp</span>
        <input
          type="number"
          min={0}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
        />
      </div>
    </div>
  );
}

function ItemList({ items, onAdd, onChange, onRemove, addLabel, namePlaceholder }: {
  items: Item[];
  onAdd: () => void;
  onChange: (id: string, field: "nama" | "jumlah", value: string | number) => void;
  onRemove: (id: string) => void;
  addLabel: string;
  namePlaceholder: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 items-center">
          <input
            type="text"
            value={item.nama}
            onChange={(e) => onChange(item.id, "nama", e.target.value)}
            placeholder={namePlaceholder}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
          <div className="relative w-40 shrink-0">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">Rp</span>
            <input
              type="number"
              min={0}
              value={item.jumlah || ""}
              onChange={(e) => onChange(item.id, "jumlah", Number(e.target.value))}
              placeholder="0"
              className="w-full pl-8 pr-2 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
            />
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-slate-300 hover:text-red-400 transition-colors text-lg leading-none shrink-0"
            aria-label="Hapus"
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="text-xs text-blue-500 hover:text-blue-700 font-semibold transition-colors"
      >
        + {addLabel}
      </button>
    </div>
  );
}

// ─── Slip Preview ─────────────────────────────────────────────────────────────

function SlipPreview({ f, calc }: { f: FormData; calc: ReturnType<typeof calcAll> }) {
  const periode = `${BULAN[f.periode.bulan - 1]} ${f.periode.tahun}`;

  return (
    <div id="slip-preview" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 text-sm font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {f.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.logoUrl} alt="Logo" className="h-10 w-auto object-contain" />
          )}
          <p className="font-bold text-slate-900 text-base">
            {f.namaPerusahaan || "Nama Perusahaan"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Slip Gaji</p>
          <p className="text-xs text-slate-500">{periode}</p>
        </div>
      </div>

      {/* Employee info */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mb-5 pb-5 border-b border-slate-100 text-xs">
        <div>
          <span className="text-slate-400">Nama</span>
          <p className="font-semibold text-slate-800">{f.namaKaryawan || "—"}</p>
        </div>
        <div>
          <span className="text-slate-400">Jabatan</span>
          <p className="font-semibold text-slate-800">{f.jabatan || "—"}</p>
        </div>
        {f.departemen && (
          <div>
            <span className="text-slate-400">Departemen</span>
            <p className="font-semibold text-slate-800">{f.departemen}</p>
          </div>
        )}
        <div>
          <span className="text-slate-400">Status PTKP</span>
          <p className="font-semibold text-slate-800">{f.statusPTKP}</p>
        </div>
      </div>

      {/* Earnings & deductions */}
      <div className="grid grid-cols-2 gap-6 mb-5">
        {/* Penghasilan */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Penghasilan</p>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Gaji Pokok</span>
              <span className="font-medium text-slate-800">{formatRp(f.gajiPokok)}</span>
            </div>
            {f.tunjangan.filter(t => t.nama || t.jumlah > 0).map(t => (
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

        {/* Potongan */}
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Potongan</p>
          <div className="space-y-2">
            {f.includeBpjsKes && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">BPJS Kesehatan (1%)</span>
                <span className="font-medium text-slate-800">{formatRp(calc.bpjsKes)}</span>
              </div>
            )}
            {f.includeBpjsJHT && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">BPJS JHT (2%)</span>
                <span className="font-medium text-slate-800">{formatRp(calc.bpjsJHT)}</span>
              </div>
            )}
            {f.includeBpjsJP && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">BPJS JP (1%)</span>
                <span className="font-medium text-slate-800">{formatRp(calc.bpjsJP)}</span>
              </div>
            )}
            {f.includePph21 && (
              <div className="flex justify-between text-xs">
                <span className="text-slate-600">PPh 21</span>
                <span className="font-medium text-slate-800">{formatRp(calc.pph21)}</span>
              </div>
            )}
            {f.potonganManual.filter(p => p.nama || p.jumlah > 0).map(p => (
              <div key={p.id} className="flex justify-between text-xs">
                <span className="text-slate-600">{p.nama || "Potongan"}</span>
                <span className="font-medium text-slate-800">{formatRp(p.jumlah)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs">
            <span className="font-semibold text-slate-700">Total Potongan</span>
            <span className="font-bold text-red-600">{formatRp(calc.totalPotongan)}</span>
          </div>
        </div>
      </div>

      {/* Take home pay */}
      <div className="bg-blue-600 rounded-2xl px-5 py-4 flex items-center justify-between">
        <div>
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest print-black">Gaji Bersih</p>
          <p className="text-white text-xs print-black">Take Home Pay</p>
        </div>
        <p className="text-white text-xl font-bold print-black">{formatRp(calc.gajiBersih)}</p>
      </div>

    </div>
  );
}

// ─── Feedback Section ─────────────────────────────────────────────────────────

const RATINGS = [
  { emoji: "😞", label: "Buruk" },
  { emoji: "😐", label: "Biasa" },
  { emoji: "🙂", label: "Oke" },
  { emoji: "😄", label: "Bagus" },
  { emoji: "🤩", label: "Luar biasa" },
];

function FeedbackSection() {
  const [selected, setSelected] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    const rating = selected !== null ? RATINGS[selected].label : "Tidak dipilih";
    const body = encodeURIComponent(
      `Rating: ${rating}\n\nFeedback:\n${text || "(kosong)"}`
    );
    window.open(`mailto:kaunaverse@gmail.com?subject=Feedback Slip Gaji Kauna Work&body=${body}`);
    setSent(true);
  };

  return (
    <div className="mt-12 max-w-xl mx-auto bg-white rounded-3xl border border-slate-200 p-6">
      {sent ? (
        <div className="text-center py-4">
          <p className="text-2xl mb-2">🙏</p>
          <p className="font-semibold text-slate-800 mb-1">Terima kasih!</p>
          <p className="text-sm text-slate-400">Feedback kamu sangat membantu kami berkembang.</p>
        </div>
      ) : (
        <>
          <h2 className="text-sm font-bold text-slate-700 mb-1">Bagaimana pengalamanmu?</h2>
          <p className="text-xs text-slate-400 mb-4">Bantu kami bikin Kauna Work lebih baik.</p>

          {/* Emoji rating */}
          <div className="flex gap-2 mb-4">
            {RATINGS.map((r, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-2xl border text-lg transition-all ${
                  selected === i
                    ? "border-blue-400 bg-blue-50 scale-105 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
                title={r.label}
              >
                {r.emoji}
                <span className="text-xs text-slate-400 hidden sm:block">{r.label}</span>
              </button>
            ))}
          </div>

          {/* Text feedback */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ada yang ingin kamu tambahkan? (opsional)"
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none mb-3"
          />

          <button
            onClick={handleSubmit}
            disabled={selected === null && !text.trim()}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Kirim Feedback
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SlipGajiClient({
  initialKaryawan,
  initialPerusahaan,
  karyawanId,
  isPro,
}: {
  initialKaryawan?: Karyawan | null;
  initialPerusahaan?: Perusahaan | null;
  karyawanId?: string;
  isPro?: boolean;
}) {
  const initialForm = useMemo<FormData>(() => {
    const base: FormData = {
      ...DEFAULT,
      namaPerusahaan: initialPerusahaan?.nama ?? DEFAULT.namaPerusahaan,
      logoUrl: initialPerusahaan?.logo_url ?? DEFAULT.logoUrl,
    };
    if (!initialKaryawan) return base;
    return {
      ...base,
      namaKaryawan: initialKaryawan.nama,
      jabatan: initialKaryawan.jabatan,
      departemen: initialKaryawan.departemen,
      statusPTKP: initialKaryawan.status_ptkp,
      punyaNPWP: initialKaryawan.punya_npwp,
      gajiPokok: initialKaryawan.gaji_pokok,
      tunjangan: initialKaryawan.tunjangan.map((t) => ({ ...t })),
      includeBpjsKes: initialKaryawan.include_bpjs_kes,
      includeBpjsJHT: initialKaryawan.include_bpjs_jht,
      includeBpjsJP: initialKaryawan.include_bpjs_jp,
      includePph21: initialKaryawan.include_pph21,
    };
  }, [initialKaryawan, initialPerusahaan]);

  const [form, setForm] = useState<FormData>(initialForm);
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const set = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("logoUrl", reader.result as string);
    reader.readAsDataURL(file);
  };

  // Tunjangan handlers
  const addTunjangan = () =>
    set("tunjangan", [...form.tunjangan, { id: uid(), nama: "", jumlah: 0 }]);

  const changeTunjangan = (id: string, field: "nama" | "jumlah", value: string | number) =>
    set("tunjangan", form.tunjangan.map(t => t.id === id ? { ...t, [field]: value } : t));

  const removeTunjangan = (id: string) =>
    set("tunjangan", form.tunjangan.filter(t => t.id !== id));

  // Potongan manual handlers
  const addPotongan = () =>
    set("potonganManual", [...form.potonganManual, { id: uid(), nama: "", jumlah: 0 }]);

  const changePotongan = (id: string, field: "nama" | "jumlah", value: string | number) =>
    set("potonganManual", form.potonganManual.map(p => p.id === id ? { ...p, [field]: value } : p));

  const removePotongan = (id: string) =>
    set("potonganManual", form.potonganManual.filter(p => p.id !== id));

  const handlePrint = () => window.print();

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!karyawanId) return;
    setSaving(true);
    try {
      await saveSlipHistory(karyawanId, form.periode.bulan, form.periode.tahun, {
        namaKaryawan: form.namaKaryawan,
        jabatan: form.jabatan,
        departemen: form.departemen,
        namaPerusahaan: form.namaPerusahaan,
        logoUrl: form.logoUrl,
        statusPTKP: form.statusPTKP,
        punyaNPWP: form.punyaNPWP,
        gajiPokok: form.gajiPokok,
        tunjangan: form.tunjangan,
        potonganManual: form.potonganManual,
        includeBpjsKes: form.includeBpjsKes,
        includeBpjsJHT: form.includeBpjsJHT,
        includeBpjsJP: form.includeBpjsJP,
        includePph21: form.includePph21,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Gagal menyimpan slip.");
    } finally {
      setSaving(false);
    }
  };

  const calc = calcAll(form);

  return (
    <>
      {/* Print styles */}
      <style>{`
        #slip-print-root { display: none; }
        @page { margin: 0; size: A4; }
        @media print {
          body > *:not(#slip-print-root) { display: none !important; }
          #slip-print-root {
            display: block !important;
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            padding: 32px;
            box-sizing: border-box;
          }
          .print-black { color: #000 !important; }
          #slip-print-root * { border: none !important; box-shadow: none !important; outline: none !important; }
        }
      `}</style>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Generator Slip Gaji</h1>
            <p className="text-slate-500 text-sm">Isi form di kiri, preview langsung di kanan. Download PDF gratis.</p>
          </div>
          <Link
            href="/panduan"
            className="shrink-0 text-xs text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium"
          >
            Cara pakai →
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* ── Form ── */}
          <div className="space-y-6">

            {/* Perusahaan */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Informasi Perusahaan</h2>
              <InputText
                label="Nama Perusahaan"
                value={form.namaPerusahaan}
                onChange={(v) => set("namaPerusahaan", v)}
                placeholder="PT. Contoh Maju Bersama"
              />
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Logo Perusahaan <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                {form.logoUrl ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.logoUrl} alt="Logo preview" className="h-10 w-auto object-contain rounded-lg border border-slate-200 p-1 bg-white" />
                    <button
                      onClick={() => set("logoUrl", "")}
                      className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
                    >
                      Hapus logo
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer w-fit">
                    <span>📁</span>
                    <span>Upload logo (PNG, JPG)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </label>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Bulan</label>
                  <select
                    value={form.periode.bulan}
                    onChange={(e) => set("periode", { ...form.periode, bulan: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  >
                    {BULAN.map((b, i) => (
                      <option key={b} value={i + 1}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Tahun</label>
                  <input
                    type="number"
                    value={form.periode.tahun}
                    onChange={(e) => set("periode", { ...form.periode, tahun: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                </div>
              </div>
            </section>

            {/* Karyawan */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Informasi Karyawan</h2>
              <InputText
                label="Nama Karyawan"
                value={form.namaKaryawan}
                onChange={(v) => set("namaKaryawan", v)}
                placeholder="Budi Santoso"
              />
              <div className="grid grid-cols-2 gap-3">
                <InputText
                  label="Jabatan"
                  value={form.jabatan}
                  onChange={(v) => set("jabatan", v)}
                  placeholder="Staff Marketing"
                />
                <InputText
                  label="Departemen"
                  value={form.departemen}
                  onChange={(v) => set("departemen", v)}
                  placeholder="Marketing"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Status PTKP</label>
                  <select
                    value={form.statusPTKP}
                    onChange={(e) => set("statusPTKP", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  >
                    {Object.keys(PTKP).map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">NPWP</label>
                  <select
                    value={form.punyaNPWP ? "ya" : "tidak"}
                    onChange={(e) => set("punyaNPWP", e.target.value === "ya")}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  >
                    <option value="ya">Punya NPWP</option>
                    <option value="tidak">Tidak Punya (+20%)</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Penghasilan */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Penghasilan</h2>
              <InputMoney
                label="Gaji Pokok"
                value={form.gajiPokok}
                onChange={(v) => set("gajiPokok", v)}
              />
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2">Tunjangan</label>
                <ItemList
                  items={form.tunjangan}
                  onAdd={addTunjangan}
                  onChange={changeTunjangan}
                  onRemove={removeTunjangan}
                  addLabel="Tambah Tunjangan"
                  namePlaceholder="Tunjangan Transport"
                />
              </div>
            </section>

            {/* Potongan otomatis */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-700">Potongan Otomatis</h2>
                <p className="text-xs text-slate-400 mt-0.5">Aktifkan sesuai kebijakan perusahaan.</p>
              </div>
              <div className="space-y-3">
                {(
                  [
                    { key: "includeBpjsKes", label: "BPJS Kesehatan", sub: "1% dari gaji" },
                    { key: "includeBpjsJHT", label: "BPJS JHT", sub: "2% dari gaji" },
                    { key: "includeBpjsJP",  label: "BPJS JP",  sub: "1% dari gaji" },
                    { key: "includePph21",   label: "PPh 21",   sub: "Dihitung berdasarkan PTKP" },
                  ] as { key: keyof FormData; label: string; sub: string }[]
                ).map(({ key, label, sub }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{label}</p>
                      <p className="text-xs text-slate-400">{sub}</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={form[key] as boolean}
                      onClick={() => set(key, !form[key] as FormData[typeof key])}
                      className={`relative w-10 h-6 rounded-full transition-colors ${
                        form[key] ? "bg-blue-500" : "bg-slate-200"
                      }`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        form[key] ? "left-5" : "left-1"
                      }`} />
                    </button>
                  </label>
                ))}
              </div>
            </section>

            {/* Potongan manual */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-700">Potongan Tambahan</h2>
                <p className="text-xs text-slate-400 mt-0.5">Potongan lain di luar BPJS & PPh 21.</p>
              </div>
              <ItemList
                items={form.potonganManual}
                onAdd={addPotongan}
                onChange={changePotongan}
                onRemove={removePotongan}
                addLabel="Tambah Potongan"
                namePlaceholder="Pinjaman Koperasi"
              />
            </section>

            {/* Summary box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 grid grid-cols-3 gap-3 text-center text-xs">
              <div>
                <p className="text-slate-400 mb-1">Total Penghasilan</p>
                <p className="font-bold text-slate-800">{formatRp(calc.totalPenghasilan)}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Total Potongan</p>
                <p className="font-bold text-red-500">{formatRp(calc.totalPotongan)}</p>
              </div>
              <div>
                <p className="text-slate-400 mb-1">Gaji Bersih</p>
                <p className="font-bold text-blue-600">{formatRp(calc.gajiBersih)}</p>
              </div>
            </div>
          </div>

          {/* ── Preview ── */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <SlipPreview f={form} calc={calc} />
            <button
              onClick={handlePrint}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-2"
            >
              <span>⬇</span> Download / Print PDF
            </button>
            {isPro && karyawanId && (
              <button
                onClick={handleSave}
                disabled={saving || saved}
                className={`w-full py-3 rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 ${
                  saved
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {saved ? "✓ Slip tersimpan" : saving ? "Menyimpan..." : "💾 Simpan ke Riwayat"}
              </button>
            )}
            <p className="text-center text-xs text-slate-400">
              Klik Download → di dialog print pilih "Save as PDF"
            </p>
          </div>
        </div>

        {/* Feedback */}
        <FeedbackSection />
      </main>

      {/* Print-only portal — renders as direct child of body, hidden normally */}
      {mounted && createPortal(
        <div id="slip-print-root">
          <SlipPreview f={form} calc={calc} />
        </div>,
        document.body
      )}
    </>
  );
}
