"use client";

import { useState } from "react";
import { deleteKaryawan } from "@/lib/actions/karyawan";
import { useRouter } from "next/navigation";

export default function KaryawanActions({ id, nama }: { id: string; nama: string }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteKaryawan(id);
      router.refresh();
    } catch {
      alert("Gagal menghapus karyawan.");
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-slate-500 mr-1">Hapus {nama}?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs bg-red-50 text-red-600 font-medium px-2 py-1 rounded hover:bg-red-100 disabled:opacity-50"
        >
          {loading ? "..." : "Ya"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-xs text-slate-500 px-2 py-1 rounded hover:bg-slate-100"
        >
          Batal
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-sm text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
    >
      Hapus
    </button>
  );
}
