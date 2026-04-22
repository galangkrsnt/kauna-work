"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createKaryawan, updateKaryawan, type KaryawanInput } from "@/lib/actions/karyawan";

const STATUS_PTKP = ["TK/0", "TK/1", "TK/2", "TK/3", "K/0", "K/1", "K/2", "K/3", "K/I/0", "K/I/1", "K/I/2", "K/I/3"];

type Props = {
  mode: "tambah" | "edit";
  id?: string;
  backUrl?: string;
  defaultValues?: Partial<KaryawanInput>;
};

function emptyInput(): KaryawanInput {
  return {
    nama: "",
    jabatan: "",
    departemen: "",
    status_ptkp: "TK/0",
    punya_npwp: true,
    gaji_pokok: 0,
    tunjangan: [],
    include_bpjs_kes: true,
    include_bpjs_jht: true,
    include_bpjs_jp: true,
    include_pph21: true,
  };
}

export default function KaryawanForm({ mode, id, backUrl, defaultValues }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<KaryawanInput>({ ...emptyInput(), ...defaultValues });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof KaryawanInput>(key: K, value: KaryawanInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addTunjangan() {
    setField("tunjangan", [
      ...form.tunjangan,
      { id: crypto.randomUUID(), nama: "", jumlah: 0 },
    ]);
  }

  function updateTunjangan(idx: number, field: "nama" | "jumlah", value: string | number) {
    const next = [...form.tunjangan];
    next[idx] = { ...next[idx], [field]: value };
    setField("tunjangan", next);
  }

  function removeTunjangan(idx: number) {
    setField("tunjangan", form.tunjangan.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nama.trim()) { setError("Nama karyawan wajib diisi."); return; }
    setLoading(true);
    setError("");
    try {
      if (mode === "tambah") {
        await createKaryawan(form);
      } else if (id) {
        await updateKaryawan(id, form);
      }
      router.push(backUrl ?? "/karyawan");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Identitas */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">Identitas Karyawan</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.nama}
            onChange={(e) => setField("nama", e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Contoh: Budi Santoso"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Jabatan</label>
            <input
              type="text"
              value={form.jabatan}
              onChange={(e) => setField("jabatan", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Marketing Manager"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Departemen</label>
            <input
              type="text"
              value={form.departemen}
              onChange={(e) => setField("departemen", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Marketing"
            />
          </div>
        </div>
      </section>

      {/* Pajak */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">Data Pajak</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status PTKP</label>
            <select
              value={form.status_ptkp}
              onChange={(e) => setField("status_ptkp", e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {STATUS_PTKP.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">NPWP</label>
            <div className="flex gap-4 mt-2">
              {[true, false].map((val) => (
                <label key={String(val)} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="npwp"
                    checked={form.punya_npwp === val}
                    onChange={() => setField("punya_npwp", val)}
                    className="accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">{val ? "Punya NPWP" : "Tidak punya"}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gaji */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <h2 className="font-semibold text-slate-800">Kompensasi</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Gaji Pokok (Rp)</label>
          <input
            type="number"
            value={form.gaji_pokok || ""}
            onChange={(e) => setField("gaji_pokok", Number(e.target.value))}
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="5000000"
            min={0}
          />
        </div>

        {/* Tunjangan */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Tunjangan Tetap</label>
            <button
              type="button"
              onClick={addTunjangan}
              className="text-sm text-blue-600 hover:underline"
            >
              + Tambah
            </button>
          </div>
          {form.tunjangan.length === 0 && (
            <p className="text-sm text-slate-400">Belum ada tunjangan.</p>
          )}
          <div className="space-y-2">
            {form.tunjangan.map((t, i) => (
              <div key={t.id} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={t.nama}
                  onChange={(e) => updateTunjangan(i, "nama", e.target.value)}
                  placeholder="Nama tunjangan"
                  className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  value={t.jumlah || ""}
                  onChange={(e) => updateTunjangan(i, "jumlah", Number(e.target.value))}
                  placeholder="Nominal"
                  min={0}
                  className="w-32 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeTunjangan(i)}
                  className="text-red-400 hover:text-red-600 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Potongan */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <h2 className="font-semibold text-slate-800">Potongan Otomatis</h2>
          <p className="text-sm text-slate-400 mt-0.5">Pilih potongan yang berlaku untuk karyawan ini. Akan otomatis terisi saat buat slip gaji.</p>
        </div>
        <div className="space-y-3">
          {(
            [
              { key: "include_bpjs_kes", label: "BPJS Kesehatan", sub: "1% dari gaji" },
              { key: "include_bpjs_jht", label: "BPJS JHT",       sub: "2% dari gaji" },
              { key: "include_bpjs_jp",  label: "BPJS JP",        sub: "1% dari gaji" },
              { key: "include_pph21",    label: "PPh 21",          sub: "Dihitung berdasarkan PTKP" },
            ] as { key: keyof KaryawanInput; label: string; sub: string }[]
          ).map(({ key, label, sub }) => (
            <label key={key} className="flex items-center justify-between cursor-pointer">
              <div>
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <p className="text-xs text-slate-400">{sub}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form[key] as boolean}
                onClick={() => setField(key, !form[key] as KaryawanInput[typeof key])}
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

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={() => backUrl ? router.push(backUrl) : router.back()}
          className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Menyimpan..." : mode === "tambah" ? "Simpan Karyawan" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
