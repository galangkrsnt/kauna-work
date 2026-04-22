"use client";

import { useState } from "react";
import { upsertPerusahaan, type PerusahaanInput } from "@/lib/actions/perusahaan";

export default function PerusahaanForm({ defaultValues }: { defaultValues?: Partial<PerusahaanInput> }) {
  const [nama, setNama] = useState(defaultValues?.nama ?? "");
  const [logoUrl, setLogoUrl] = useState(defaultValues?.logo_url ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nama.trim()) { setError("Nama perusahaan wajib diisi."); return; }
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      await upsertPerusahaan({ nama, logo_url: logoUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-lg">
          Profil perusahaan berhasil disimpan.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Nama Perusahaan <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="PT. Contoh Maju Bersama"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Logo Perusahaan <span className="text-slate-400 font-normal">(opsional)</span>
        </label>
        {logoUrl ? (
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain rounded-lg border border-slate-200 p-1 bg-white" />
            <button
              type="button"
              onClick={() => setLogoUrl("")}
              className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors"
            >
              Hapus logo
            </button>
          </div>
        ) : (
          <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-slate-300 text-sm text-slate-400 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer w-fit">
            <span>📁</span>
            <span>Upload logo (PNG, JPG)</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
          </label>
        )}
        <p className="text-xs text-slate-400 mt-1.5">Logo akan otomatis muncul di setiap slip gaji yang kamu buat.</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
      >
        {loading ? "Menyimpan..." : "Simpan Profil Perusahaan"}
      </button>
    </form>
  );
}
