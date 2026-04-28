"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteFakturHistory, deleteFakturItem, saveFakturItem } from "@/lib/actions/faktur";
import { useRouter } from "next/navigation";
import type { FakturHistoryRow, FakturItem } from "@/lib/actions/faktur";

function formatRp(n: number) {
  return "Rp " + Math.round(n).toLocaleString("id-ID");
}

function formatDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

// ─── Katalog section ─────────────────────────────────────────────────────────

function KatalogSection({ items }: { items: FakturItem[] }) {
  const router = useRouter();
  const [list, setList] = useState(items);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ nama: "", satuan: "pcs", harga_satuan: 0 });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ nama: "", satuan: "", harga_satuan: 0 });

  async function handleAdd() {
    if (!form.nama) return;
    setSaving(true);
    try {
      await saveFakturItem(form);
      setForm({ nama: "", satuan: "pcs", harga_satuan: 0 });
      setAdding(false);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(item: FakturItem) {
    setEditingId(item.id);
    setEditForm({ nama: item.nama, satuan: item.satuan, harga_satuan: item.harga_satuan });
  }

  async function handleSaveEdit() {
    if (!editingId || !editForm.nama) return;
    setSaving(true);
    try {
      await saveFakturItem({ id: editingId, ...editForm });
      setEditingId(null);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteFakturItem(id);
      setList((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800">Katalog Item / Jasa</h2>
          <p className="text-xs text-slate-400 mt-0.5">Item yang tersimpan bisa dipilih langsung saat buat faktur</p>
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          + Tambah Item
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nama</label>
              <input
                type="text"
                value={form.nama}
                onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                placeholder="Jasa Desain"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Satuan</label>
              <input
                type="text"
                value={form.satuan}
                onChange={(e) => setForm((f) => ({ ...f, satuan: e.target.value }))}
                placeholder="pcs"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Harga Satuan</label>
              <input
                type="number"
                min={0}
                value={form.harga_satuan || ""}
                onChange={(e) => setForm((f) => ({ ...f, harga_satuan: Number(e.target.value) }))}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving || !form.nama}
              className="text-sm font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button onClick={() => setAdding(false)} className="text-sm text-slate-500 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
              Batal
            </button>
          </div>
        </div>
      )}

      {list.length === 0 && !adding ? (
        <div className="px-5 py-10 text-center text-slate-400 text-sm">
          Belum ada item. Tambah item yang sering kamu gunakan di faktur.
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {list.map((item) => (
            <li key={item.id} className="px-5 py-3">
              {editingId === item.id ? (
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={editForm.nama}
                    onChange={(e) => setEditForm((f) => ({ ...f, nama: e.target.value }))}
                    className="col-span-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={editForm.satuan}
                    onChange={(e) => setEditForm((f) => ({ ...f, satuan: e.target.value }))}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      min={0}
                      value={editForm.harga_satuan || ""}
                      onChange={(e) => setEditForm((f) => ({ ...f, harga_satuan: Number(e.target.value) }))}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    />
                    <button onClick={handleSaveEdit} disabled={saving} className="text-xs font-semibold text-blue-600 hover:underline">
                      Simpan
                    </button>
                    <button onClick={() => setEditingId(null)} className="text-xs text-slate-400 hover:text-slate-600">
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{item.nama}</p>
                    <p className="text-xs text-slate-400">{item.satuan} · {formatRp(item.harga_satuan)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEdit(item)} className="text-xs text-blue-500 hover:underline">Edit</button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="text-xs text-red-400 hover:text-red-600 disabled:opacity-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── History section ──────────────────────────────────────────────────────────

function HistorySection({ history }: { history: FakturHistoryRow[] }) {
  const [list, setList] = useState(history);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Hapus faktur ini dari riwayat?")) return;
    setDeletingId(id);
    try {
      await deleteFakturHistory(id);
      setList((prev) => prev.filter((h) => h.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-slate-800">Riwayat Faktur</h2>
          <p className="text-xs text-slate-400 mt-0.5">Klik &quot;Buka&quot; untuk edit atau cetak ulang</p>
        </div>
        <Link href="/faktur" className="text-sm font-medium text-blue-600 hover:underline">
          + Buat Faktur Baru
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="px-5 py-10 text-center text-slate-400 text-sm">
          Belum ada faktur tersimpan.{" "}
          <Link href="/faktur" className="text-blue-500 hover:underline font-medium">
            Buat sekarang →
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {list.map((h) => (
            <li key={h.id} className="px-5 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-slate-800 text-sm">{h.nomor_faktur || "—"}</p>
                  <span className="text-xs text-slate-400">·</span>
                  <p className="text-sm text-slate-500 truncate">{h.nama_klien || "—"}</p>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{formatDate(h.tanggal)} · {formatRp(h.total)}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/faktur?from=${h.id}`}
                  className="text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Buka
                </Link>
                <button
                  onClick={() => handleDelete(h.id)}
                  disabled={deletingId === h.id}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FakturDashboardClient({
  history,
  items,
}: {
  history: FakturHistoryRow[];
  items: FakturItem[];
}) {
  return (
    <div className="space-y-6">
      <HistorySection history={history} />
      <KatalogSection items={items} />
    </div>
  );
}
