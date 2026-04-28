"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { saveFakturHistory, saveFakturItem } from "@/lib/actions/faktur";
import type { FakturItem } from "@/lib/actions/faktur";

// ─── Types ───────────────────────────────────────────────────────────────────

type Item = { id: string; nama: string; qty: number; satuan: string; hargaSatuan: number };

type FormData = {
  nomorFaktur: string;
  tanggal: string;
  hasJatuhTempo: boolean;
  jatuhTempo: string;
  logoUrl: string;
  namaPerusahaan: string;
  alamatPerusahaan: string;
  telpPerusahaan: string;
  emailPerusahaan: string;
  namaKlien: string;
  alamatKlien: string;
  telpKlien: string;
  emailKlien: string;
  items: Item[];
  includesPPN: boolean;
  diskon: number;
  catatan: string;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function formatRp(n: number): string {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${d} ${bulan[parseInt(m) - 1]} ${y}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function calcTotals(form: FormData) {
  const subtotal = form.items.reduce((s, i) => s + i.qty * i.hargaSatuan, 0);
  const diskon = Math.max(0, form.diskon);
  const dpp = Math.max(0, subtotal - diskon);
  const ppn = form.includesPPN ? Math.round(dpp * 0.11) : 0;
  const total = dpp + ppn;
  return { subtotal, diskon, dpp, ppn, total };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function InputText({
  label, value, onChange, placeholder, optional, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; optional?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">
        {label} {optional && <span className="font-normal text-slate-400">(opsional)</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder:text-slate-300"
      />
    </div>
  );
}

function InputMoney({
  label, value, onChange, optional,
}: {
  label: string; value: number; onChange: (v: number) => void; optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1">
        {label} {optional && <span className="font-normal text-slate-400">(opsional)</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">Rp</span>
        <input
          type="number"
          min={0}
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder:text-slate-300"
        />
      </div>
    </div>
  );
}

function ItemRow({
  item, onChange, onRemove, onSaveToKatalog, isPro,
}: {
  item: Item;
  onChange: (id: string, field: keyof Item, value: string | number) => void;
  onRemove: (id: string) => void;
  onSaveToKatalog?: (item: Item) => void;
  isPro: boolean;
}) {
  const jumlah = item.qty * item.hargaSatuan;
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={item.nama}
          onChange={(e) => onChange(item.id, "nama", e.target.value)}
          placeholder="Nama barang / jasa"
          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition placeholder:text-slate-300 bg-white"
        />
        <button
          onClick={() => onRemove(item.id)}
          className="px-2 text-slate-300 hover:text-red-400 transition-colors text-lg leading-none"
          aria-label="Hapus item"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[10px] text-slate-400 font-semibold mb-1">Qty</label>
          <input
            type="number"
            min={0}
            value={item.qty || ""}
            onChange={(e) => onChange(item.id, "qty", Number(e.target.value))}
            placeholder="1"
            className="w-full px-2 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 font-semibold mb-1">Satuan</label>
          <input
            type="text"
            value={item.satuan}
            onChange={(e) => onChange(item.id, "satuan", e.target.value)}
            placeholder="pcs"
            className="w-full px-2 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] text-slate-400 font-semibold mb-1">Harga Satuan</label>
          <input
            type="number"
            min={0}
            value={item.hargaSatuan || ""}
            onChange={(e) => onChange(item.id, "hargaSatuan", Number(e.target.value))}
            placeholder="0"
            className="w-full px-2 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition bg-white"
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-600">= {formatRp(jumlah)}</p>
        {isPro && item.nama && (
          <button
            onClick={() => onSaveToKatalog?.(item)}
            className="text-[10px] text-blue-500 hover:text-blue-700 font-medium transition-colors"
          >
            + Simpan ke katalog
          </button>
        )}
      </div>
    </div>
  );
}

// ─── FakturPreview ────────────────────────────────────────────────────────────

function FakturPreview({ f, totals }: { f: FormData; totals: ReturnType<typeof calcTotals> }) {
  return (
    <div
      id="faktur-preview-content"
      className="bg-white rounded-2xl border border-slate-200 p-6 text-slate-800 text-sm"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {f.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={f.logoUrl} alt="Logo" className="h-14 w-auto object-contain shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-bold text-base text-slate-900 truncate">
              {f.namaPerusahaan || "Nama Perusahaan"}
            </p>
            {f.alamatPerusahaan && (
              <p className="text-xs text-slate-500 mt-0.5 leading-snug whitespace-pre-line">{f.alamatPerusahaan}</p>
            )}
            {f.telpPerusahaan && <p className="text-xs text-slate-500">Telp: {f.telpPerusahaan}</p>}
            {f.emailPerusahaan && <p className="text-xs text-slate-500">{f.emailPerusahaan}</p>}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-slate-900 tracking-tight">FAKTUR</p>
          <p className="text-xs text-slate-500 mt-1">No: <span className="font-semibold text-slate-700">{f.nomorFaktur || "—"}</span></p>
          <p className="text-xs text-slate-500">Tanggal: <span className="font-semibold text-slate-700">{formatDate(f.tanggal)}</span></p>
          {f.hasJatuhTempo && f.jatuhTempo && (
            <p className="text-xs text-slate-500">Jatuh Tempo: <span className="font-semibold text-slate-700">{formatDate(f.jatuhTempo)}</span></p>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 mb-4" />

      {/* Kepada */}
      <div className="mb-5">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Kepada</p>
        <p className="font-semibold text-slate-900">{f.namaKlien || "Nama Klien"}</p>
        {f.alamatKlien && (
          <p className="text-xs text-slate-500 mt-0.5 leading-snug whitespace-pre-line">{f.alamatKlien}</p>
        )}
        {f.telpKlien && <p className="text-xs text-slate-500">Telp: {f.telpKlien}</p>}
        {f.emailKlien && <p className="text-xs text-slate-500">{f.emailKlien}</p>}
      </div>

      {/* Items table */}
      <table className="w-full text-xs mb-4 border-collapse">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="px-2 py-2 text-left font-semibold rounded-tl-lg w-6">No</th>
            <th className="px-2 py-2 text-left font-semibold">Nama Barang / Jasa</th>
            <th className="px-2 py-2 text-center font-semibold w-10">Qty</th>
            <th className="px-2 py-2 text-center font-semibold w-12">Satuan</th>
            <th className="px-2 py-2 text-right font-semibold w-24">Harga Satuan</th>
            <th className="px-2 py-2 text-right font-semibold rounded-tr-lg w-24">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {f.items.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-2 py-4 text-center text-slate-400 italic">Belum ada item</td>
            </tr>
          ) : (
            f.items.map((item, idx) => (
              <tr key={item.id} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="px-2 py-2 text-slate-500">{idx + 1}</td>
                <td className="px-2 py-2 text-slate-800 font-medium">{item.nama || "—"}</td>
                <td className="px-2 py-2 text-center text-slate-700">{item.qty || 0}</td>
                <td className="px-2 py-2 text-center text-slate-500">{item.satuan || "—"}</td>
                <td className="px-2 py-2 text-right text-slate-700">{formatRp(item.hargaSatuan)}</td>
                <td className="px-2 py-2 text-right font-semibold text-slate-900">{formatRp(item.qty * item.hargaSatuan)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-5">
        <div className="w-56 space-y-1.5">
          <div className="flex justify-between text-xs text-slate-600">
            <span>Subtotal</span>
            <span className="font-medium">{formatRp(totals.subtotal)}</span>
          </div>
          {totals.diskon > 0 && (
            <div className="flex justify-between text-xs text-slate-600">
              <span>Diskon</span>
              <span className="font-medium text-red-500">-{formatRp(totals.diskon)}</span>
            </div>
          )}
          {f.includesPPN && totals.diskon > 0 && (
            <div className="flex justify-between text-xs text-slate-600">
              <span>DPP</span>
              <span className="font-medium">{formatRp(totals.dpp)}</span>
            </div>
          )}
          {f.includesPPN && (
            <div className="flex justify-between text-xs text-slate-600">
              <span>PPN 11%</span>
              <span className="font-medium">{formatRp(totals.ppn)}</span>
            </div>
          )}
          <div className="border-t border-slate-800 pt-1.5 mt-1 flex justify-between text-sm font-bold text-slate-900">
            <span>Total</span>
            <span>{formatRp(totals.total)}</span>
          </div>
        </div>
      </div>

      {f.catatan && (
        <div className="border-t border-slate-200 pt-4 mb-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Catatan</p>
          <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{f.catatan}</p>
        </div>
      )}

      <div className="border-t border-slate-100 pt-4 text-center">
        <p className="text-xs text-slate-400">Terima kasih atas kepercayaan Anda.</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function buildDefaultForm(initial?: Record<string, unknown>): FormData {
  if (initial) {
    return {
      nomorFaktur: (initial.nomorFaktur as string) ?? "INV-001",
      tanggal: (initial.tanggal as string) ?? todayISO(),
      hasJatuhTempo: !!(initial.jatuhTempo),
      jatuhTempo: (initial.jatuhTempo as string) ?? defaultDueDate(),
      logoUrl: (initial.logoUrl as string) ?? "",
      namaPerusahaan: (initial.namaPerusahaan as string) ?? "",
      alamatPerusahaan: (initial.alamatPerusahaan as string) ?? "",
      telpPerusahaan: (initial.telpPerusahaan as string) ?? "",
      emailPerusahaan: (initial.emailPerusahaan as string) ?? "",
      namaKlien: (initial.namaKlien as string) ?? "",
      alamatKlien: (initial.alamatKlien as string) ?? "",
      telpKlien: (initial.telpKlien as string) ?? "",
      emailKlien: (initial.emailKlien as string) ?? "",
      items: (initial.items as Item[]) ?? [{ id: uid(), nama: "", qty: 1, satuan: "pcs", hargaSatuan: 0 }],
      includesPPN: (initial.includesPPN as boolean) ?? false,
      diskon: (initial.diskon as number) ?? 0,
      catatan: (initial.catatan as string) ?? "",
    };
  }
  return {
    nomorFaktur: "INV-001",
    tanggal: todayISO(),
    hasJatuhTempo: true,
    jatuhTempo: defaultDueDate(),
    logoUrl: "",
    namaPerusahaan: "",
    alamatPerusahaan: "",
    telpPerusahaan: "",
    emailPerusahaan: "",
    namaKlien: "",
    alamatKlien: "",
    telpKlien: "",
    emailKlien: "",
    items: [{ id: uid(), nama: "", qty: 1, satuan: "pcs", hargaSatuan: 0 }],
    includesPPN: false,
    diskon: 0,
    catatan: "",
  };
}

export default function FakturClient({
  isPro,
  savedItems = [],
  initialData,
  historyId,
}: {
  isPro: boolean;
  savedItems?: FakturItem[];
  initialData?: Record<string, unknown>;
  historyId?: string;
}) {
  const [form, setForm] = useState<FormData>(() => buildDefaultForm(initialData));
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>(historyId);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [katalogSaveStatus, setKatalogSaveStatus] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const set = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set("logoUrl", ev.target?.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  }, [set]);

  // Items CRUD
  const addItem = () =>
    set("items", [...form.items, { id: uid(), nama: "", qty: 1, satuan: "pcs", hargaSatuan: 0 }]);

  const changeItem = (id: string, field: keyof Item, value: string | number) =>
    set("items", form.items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const removeItem = (id: string) =>
    set("items", form.items.filter((i) => i.id !== id));

  // Add item from catalog
  const addFromKatalog = (catalogItem: FakturItem) => {
    set("items", [
      ...form.items,
      { id: uid(), nama: catalogItem.nama, qty: 1, satuan: catalogItem.satuan, hargaSatuan: catalogItem.harga_satuan },
    ]);
  };

  // Save item to catalog
  const handleSaveToKatalog = async (item: Item) => {
    if (!item.nama) return;
    setKatalogSaveStatus(item.id);
    try {
      await saveFakturItem({ nama: item.nama, satuan: item.satuan, harga_satuan: item.hargaSatuan });
    } finally {
      setTimeout(() => setKatalogSaveStatus(null), 2000);
    }
  };

  // Save faktur
  const handleSave = async () => {
    setSaving(true);
    setSaveStatus("idle");
    try {
      const totals = calcTotals(form);
      const id = await saveFakturHistory({
        id: savedId,
        nomor_faktur: form.nomorFaktur,
        tanggal: form.tanggal,
        nama_klien: form.namaKlien,
        total: totals.total,
        data_faktur: form as unknown as Record<string, unknown>,
      });
      setSavedId(id);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => window.print();

  const totals = calcTotals(form);

  return (
    <>
      <style>{`
        #faktur-print-root { display: none; }
        @page { margin: 16mm; size: A4; }
        @media print {
          body > *:not(#faktur-print-root) { display: none !important; }
          #faktur-print-root {
            display: block !important;
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            box-sizing: border-box;
          }
          #faktur-print-root #faktur-preview-content {
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Generator Faktur</h1>
          <p className="text-slate-500 text-sm">Isi form di kiri, preview langsung di kanan. Download PDF gratis.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── Form ── */}
          <div className="space-y-5">

            {/* Detail Faktur */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Detail Faktur</h2>
              <div className="grid grid-cols-2 gap-3">
                <InputText
                  label="Nomor Faktur"
                  value={form.nomorFaktur}
                  onChange={(v) => set("nomorFaktur", v)}
                  placeholder="INV-001"
                />
                <InputText
                  label="Tanggal"
                  value={form.tanggal}
                  onChange={(v) => set("tanggal", v)}
                  type="date"
                />
              </div>

              {/* Jatuh Tempo with toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-500">Jatuh Tempo</label>
                  <button
                    type="button"
                    onClick={() => set("hasJatuhTempo", !form.hasJatuhTempo)}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                      form.hasJatuhTempo
                        ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {form.hasJatuhTempo ? "Aktif — klik untuk nonaktifkan" : "Nonaktif — klik untuk aktifkan"}
                  </button>
                </div>
                {form.hasJatuhTempo ? (
                  <input
                    type="date"
                    value={form.jatuhTempo}
                    onChange={(e) => set("jatuhTempo", e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  />
                ) : (
                  <div className="w-full px-3 py-2.5 rounded-xl border border-dashed border-slate-200 text-sm text-slate-300 bg-slate-50">
                    Tidak ditampilkan di faktur
                  </div>
                )}
              </div>
            </section>

            {/* Penjual */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Dari (Penjual)</h2>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Logo <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                {form.logoUrl ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.logoUrl} alt="Logo" className="h-10 w-auto object-contain rounded-lg border border-slate-200 p-1 bg-white" />
                    <button onClick={() => set("logoUrl", "")} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">
                      Hapus
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer w-fit">
                    <span>📁</span>
                    <span>Upload logo (PNG, JPG)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                  </label>
                )}
              </div>
              <InputText label="Nama Perusahaan / Freelancer" value={form.namaPerusahaan} onChange={(v) => set("namaPerusahaan", v)} placeholder="PT. Maju Bersama / Nama Kamu" />
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Alamat <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                <textarea
                  value={form.alamatPerusahaan}
                  onChange={(e) => set("alamatPerusahaan", e.target.value)}
                  placeholder="Jl. Sudirman No. 1, Jakarta Selatan"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none placeholder:text-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputText label="No. Telp" value={form.telpPerusahaan} onChange={(v) => set("telpPerusahaan", v)} placeholder="081234567890" optional />
                <InputText label="Email" value={form.emailPerusahaan} onChange={(v) => set("emailPerusahaan", v)} placeholder="email@perusahaan.com" optional />
              </div>
            </section>

            {/* Klien */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Kepada (Klien)</h2>
              <InputText label="Nama Klien / Perusahaan" value={form.namaKlien} onChange={(v) => set("namaKlien", v)} placeholder="CV. Sinar Jaya / Nama Klien" />
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Alamat <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                <textarea
                  value={form.alamatKlien}
                  onChange={(e) => set("alamatKlien", e.target.value)}
                  placeholder="Jl. Gatot Subroto No. 5, Bandung"
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none placeholder:text-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <InputText label="No. Telp" value={form.telpKlien} onChange={(v) => set("telpKlien", v)} placeholder="081234567890" optional />
                <InputText label="Email" value={form.emailKlien} onChange={(v) => set("emailKlien", v)} placeholder="klien@email.com" optional />
              </div>
            </section>

            {/* Items */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Item / Jasa</h2>

              {/* Pro: pick from catalog */}
              {isPro && savedItems.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Pilih dari Katalog</label>
                  <div className="flex flex-wrap gap-2">
                    {savedItems.map((si) => (
                      <button
                        key={si.id}
                        onClick={() => addFromKatalog(si)}
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-blue-200 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors font-medium"
                      >
                        <span>+</span>
                        {si.nama}
                        <span className="text-blue-400">{formatRp(si.harga_satuan)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {form.items.map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    onChange={changeItem}
                    onRemove={removeItem}
                    onSaveToKatalog={handleSaveToKatalog}
                    isPro={isPro}
                  />
                ))}
              </div>
              {katalogSaveStatus && (
                <p className="text-xs text-blue-500 font-medium">✓ Tersimpan ke katalog</p>
              )}
              <button
                onClick={addItem}
                className="w-full py-2 rounded-xl border border-dashed border-slate-300 text-sm text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-colors font-medium"
              >
                + Tambah Item
              </button>
              {!isPro && (
                <p className="text-xs text-slate-400 text-center">
                  <a href="/upgrade" className="text-blue-500 hover:underline font-medium">Upgrade Pro</a> untuk simpan katalog item & reuse.
                </p>
              )}
            </section>

            {/* PPN, Diskon, Catatan */}
            <section className="bg-white rounded-3xl border border-slate-200 p-5 space-y-4">
              <h2 className="text-sm font-bold text-slate-700">Pajak & Lainnya</h2>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-sm font-medium text-slate-700">PPN 11%</p>
                  <p className="text-xs text-slate-400">Pajak Pertambahan Nilai — aktifkan jika PKP</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.includesPPN}
                  onClick={() => set("includesPPN", !form.includesPPN)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${form.includesPPN ? "bg-blue-500" : "bg-slate-200"}`}
                >
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.includesPPN ? "left-5" : "left-1"}`} />
                </button>
              </label>
              <InputMoney label="Diskon" value={form.diskon} onChange={(v) => set("diskon", v)} optional />
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Catatan <span className="font-normal text-slate-400">(opsional)</span>
                </label>
                <textarea
                  value={form.catatan}
                  onChange={(e) => set("catatan", e.target.value)}
                  placeholder="Pembayaran mohon ditransfer ke rekening BCA 1234567890 a/n Nama Anda"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition resize-none placeholder:text-slate-300"
                />
              </div>
            </section>

            {/* Summary */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-medium text-slate-800">{formatRp(totals.subtotal)}</span>
              </div>
              {totals.diskon > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>Diskon</span>
                  <span className="font-medium text-red-500">-{formatRp(totals.diskon)}</span>
                </div>
              )}
              {form.includesPPN && (
                <div className="flex justify-between text-slate-500">
                  <span>PPN 11%</span>
                  <span className="font-medium text-slate-800">{formatRp(totals.ppn)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-blue-600">{formatRp(totals.total)}</span>
              </div>
            </div>
          </div>

          {/* ── Preview & Actions ── */}
          <div className="lg:sticky lg:top-24 space-y-4">
            <FakturPreview f={form} totals={totals} />
            <button
              onClick={handlePrint}
              className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 flex items-center justify-center gap-2"
            >
              <span>⬇</span> Download / Print PDF
            </button>
            {isPro && (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`w-full py-3 rounded-2xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 border ${
                  saveStatus === "saved"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : saveStatus === "error"
                    ? "bg-red-50 text-red-500 border-red-200"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {saveStatus === "saved"
                  ? "✓ Faktur tersimpan"
                  : saveStatus === "error"
                  ? "Gagal menyimpan"
                  : saving
                  ? "Menyimpan..."
                  : "💾 Simpan ke Riwayat"}
              </button>
            )}
            {!isPro && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
                <p className="text-xs font-semibold text-amber-800 mb-1">Kauna Work Pro</p>
                <p className="text-xs text-amber-600 mb-3">Simpan faktur, kelola katalog item, dan akses riwayat kapan saja.</p>
                <a href="/upgrade" className="inline-block text-xs font-semibold text-amber-800 border border-amber-300 px-4 py-2 rounded-xl hover:bg-amber-100 transition-colors">
                  Upgrade ke Pro →
                </a>
              </div>
            )}
            <p className="text-center text-xs text-slate-400">
              Klik Download → di dialog print pilih &ldquo;Save as PDF&rdquo;
            </p>
          </div>
        </div>
      </main>

      {mounted && createPortal(
        <div id="faktur-print-root">
          <FakturPreview f={form} totals={totals} />
        </div>,
        document.body
      )}
    </>
  );
}
