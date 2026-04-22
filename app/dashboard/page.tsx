import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getKaryawan } from "@/lib/actions/karyawan";
import { getPerusahaan, isPro } from "@/lib/actions/perusahaan";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Kauna Work",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const pro = await isPro();
  if (!pro) redirect("/upgrade");

  const [karyawan, perusahaan] = await Promise.all([getKaryawan(), getPerusahaan()]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center shrink-0">
              <span className="font-bold text-emerald-600 text-base tracking-tight">Kauna</span>
              <span className="font-bold text-blue-600 text-base tracking-tight">Work</span>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <div>
              <h1 className="text-base font-bold text-slate-900">Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/settings"
              className="text-sm text-slate-500 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
            >
              ⚙ Pengaturan
            </Link>
            <Link
              href="/karyawan/tambah"
              className="bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              + Tambah Karyawan
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Perusahaan card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {perusahaan?.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={perusahaan.logo_url}
                  alt="Logo"
                  className="h-12 w-12 object-contain rounded-lg border border-slate-100 bg-white p-1 shrink-0"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-300 shrink-0 text-xl">
                  🏢
                </div>
              )}
              <div className="min-w-0">
                {perusahaan?.nama ? (
                  <>
                    <p className="font-semibold text-slate-900 truncate">{perusahaan.nama}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Profil perusahaan aktif — auto-fill di slip gaji</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-slate-500">Profil perusahaan belum diisi</p>
                    <p className="text-xs text-slate-400 mt-0.5">Isi sekali, auto-fill di setiap slip gaji</p>
                  </>
                )}
              </div>
            </div>
            <Link
              href="/settings"
              className="shrink-0 text-sm text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {perusahaan?.nama ? "Edit" : "Isi Sekarang"}
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Total Karyawan</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{karyawan.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-1">
            <p className="text-sm text-slate-500">Slip Dibuat</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">—</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-2 sm:col-span-1">
            <p className="text-sm text-slate-500">Bulan Ini</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">—</p>
          </div>
        </div>

        {/* Karyawan list */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">Daftar Karyawan</h2>
            <div className="flex items-center gap-3">
              {karyawan.length > 0 && (
                <Link href="/gaji/slip/bulk" className="text-sm text-emerald-600 font-medium hover:underline">
                  Bulk Slip Gaji
                </Link>
              )}
              <Link href="/karyawan" className="text-sm text-blue-600 hover:underline">
                Lihat semua
              </Link>
            </div>
          </div>

          {karyawan.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-slate-400 text-sm">Belum ada karyawan.</p>
              <Link
                href="/karyawan/tambah"
                className="mt-3 inline-block text-sm text-emerald-600 font-medium hover:underline"
              >
                Tambah karyawan pertama →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {karyawan.slice(0, 8).map((k) => (
                <li key={k.id} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-800">{k.nama}</p>
                    <p className="text-sm text-slate-500">
                      {k.jabatan || "—"}{k.departemen ? ` · ${k.departemen}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/gaji/slip?karyawanId=${k.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Buat Slip
                    </Link>
                    <Link
                      href={`/karyawan/${k.id}`}
                      className="text-sm text-slate-500 hover:text-slate-800"
                    >
                      Detail & Riwayat
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link
            href="/gaji/slip"
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
          >
            <p className="font-semibold text-slate-800 group-hover:text-blue-600">Buat Slip Gaji</p>
            <p className="text-sm text-slate-500 mt-1">Generate satu slip dan download PDF</p>
          </Link>
          <Link
            href="/gaji/slip/bulk"
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-300 hover:shadow-sm transition-all group"
          >
            <p className="font-semibold text-slate-800 group-hover:text-emerald-600">Bulk Slip Gaji</p>
            <p className="text-sm text-slate-500 mt-1">Generate slip untuk semua karyawan sekaligus</p>
          </Link>
          <Link
            href="/karyawan/tambah"
            className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 hover:shadow-sm transition-all group"
          >
            <p className="font-semibold text-slate-800 group-hover:text-slate-900">Tambah Karyawan</p>
            <p className="text-sm text-slate-500 mt-1">Simpan data karyawan baru</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
