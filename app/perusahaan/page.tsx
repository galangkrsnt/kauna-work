import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { isPro } from "@/lib/actions/perusahaan";

export const metadata: Metadata = {
  title: "Kauna Work untuk Perusahaan — Segera Hadir",
  description:
    "Kelola slip gaji seluruh karyawan dalam satu dashboard. Fitur khusus perusahaan segera hadir di Kauna Work.",
  alternates: { canonical: "https://work.getkauna.com/perusahaan" },
};

const features = [
  {
    icon: "👥",
    title: "Manajemen Karyawan",
    desc: "Simpan dan kelola data seluruh karyawan perusahaan dalam satu tempat. Tidak perlu input ulang setiap bulan.",
  },
  {
    icon: "🧾",
    title: "Bulk Generate Slip Gaji",
    desc: "Generate slip gaji untuk semua karyawan sekaligus dalam hitungan detik. Hemat waktu HRD.",
  },
  {
    icon: "🏢",
    title: "Branding Perusahaan",
    desc: "Logo dan nama perusahaan tersimpan permanen. Setiap slip otomatis memakai identitas perusahaan kamu.",
  },
  {
    icon: "📊",
    title: "Laporan Penggajian",
    desc: "Ringkasan total penggajian per bulan, total BPJS, dan total PPh 21 yang harus disetorkan.",
  },
  {
    icon: "📁",
    title: "Riwayat Slip per Karyawan",
    desc: "Akses riwayat slip gaji tiap karyawan kapan saja. Cocok untuk audit internal dan klaim karyawan.",
  },
  {
    icon: "🔐",
    title: "Multi-user Akses",
    desc: "Tambahkan akun untuk tim HRD. Setiap user bisa akses data perusahaan yang sama.",
  },
  {
    icon: "📤",
    title: "Export Massal PDF",
    desc: "Download semua slip gaji bulan ini dalam satu klik. Siap untuk distribusi ke karyawan.",
  },
  {
    icon: "⚙️",
    title: "Konfigurasi Komponen Gaji",
    desc: "Atur tunjangan tetap, komponen BPJS, dan kebijakan PPh 21 sekali untuk semua karyawan.",
  },
];

const comparison = [
  { label: "Generate slip gaji",        free: true,  pro: true,  company: true  },
  { label: "Download PDF",              free: true,  pro: true,  company: true  },
  { label: "Hitung PPh 21 & BPJS",      free: true,  pro: true,  company: true  },
  { label: "Simpan data karyawan",      free: false, pro: true,  company: true  },
  { label: "Riwayat slip",              free: false, pro: true,  company: true  },
  { label: "Simpan profil perusahaan",  free: false, pro: true,  company: true  },
  { label: "Bulk generate",             free: false, pro: true,  company: true  },
  { label: "Laporan penggajian",        free: false, pro: false, company: true  },
  { label: "Multi-user HRD",            free: false, pro: false, company: true  },
  { label: "Export massal PDF",         free: false, pro: false, company: true  },
  { label: "Konfigurasi komponen gaji", free: false, pro: false, company: true  },
  { label: "Priority support",          free: false, pro: false, company: true  },
];

function Check({ ok }: { ok: boolean }) {
  return ok
    ? <span className="text-emerald-500 font-bold">✓</span>
    : <span className="text-slate-200">✗</span>;
}

export default async function PerusahaanPage() {
  const pro = await isPro();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-6">
            <span>🚧</span> Segera Hadir
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5 max-w-3xl mx-auto">
            Kauna Work untuk{" "}
            <span className="text-blue-600">Perusahaan</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Satu dashboard untuk kelola seluruh karyawan, generate slip gaji massal,
            dan pantau penggajian bulanan — tanpa Excel, tanpa ribet.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
          >
            ✉ Beritahu Saya Saat Tersedia
          </Link>
        </section>

        {/* Features grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Yang akan tersedia</h2>
          <p className="text-slate-500 text-sm text-center mb-10">Semua yang dibutuhkan tim HRD kamu.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-200 bg-white p-5">
                <span className="text-2xl block mb-3">{f.icon}</span>
                <p className="font-semibold text-slate-800 text-sm mb-1">{f.title}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison table */}
        <section className="bg-slate-50 border-y border-slate-200 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Perbandingan Plan</h2>
            <p className="text-slate-500 text-sm text-center mb-10">Pilih sesuai kebutuhan tim kamu.</p>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-5 py-4 font-semibold text-slate-500 w-1/2">Fitur</th>
                    <th className="text-center px-4 py-4 font-semibold text-slate-500">Free</th>
                    <th className="text-center px-4 py-4 font-semibold text-blue-600">Pro</th>
                    <th className="text-center px-4 py-4 font-bold text-blue-700 bg-blue-50">Perusahaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {comparison.map((row) => (
                    <tr key={row.label} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 text-slate-600">{row.label}</td>
                      <td className="px-4 py-3 text-center"><Check ok={row.free} /></td>
                      <td className="px-4 py-3 text-center"><Check ok={row.pro} /></td>
                      <td className="px-4 py-3 text-center bg-blue-50/40"><Check ok={row.company} /></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-100 bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-slate-700">Harga</td>
                    <td className="px-4 py-4 text-center text-slate-500 text-xs">Rp 0</td>
                    <td className="px-4 py-4 text-center">
                      {pro ? (
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                            ✓ Aktif
                          </span>
                          <Link href="/dashboard" className="text-xs text-blue-600 hover:underline">
                            Buka Dashboard
                          </Link>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="text-xs font-semibold text-slate-700">Rp 49.000<span className="font-normal text-slate-400">/bln</span></span>
                          <Link href="/upgrade" className="text-xs bg-blue-600 text-white font-semibold px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">
                            Mulai Pro
                          </Link>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center bg-blue-50/40">
                      <span className="text-xs text-amber-600 font-semibold bg-amber-100 px-2 py-1 rounded-full">Segera Hadir</span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-xl mx-auto px-4 sm:px-6 py-20 text-center">
          <p className="text-2xl mb-3">📬</p>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Tertarik untuk perusahaan kamu?</h2>
          <p className="text-sm text-slate-500 mb-6">
            Kirim email dan kamu jadi yang pertama tahu saat plan Perusahaan diluncurkan.
            Kami juga terbuka untuk diskusi kebutuhan spesifik tim kamu.
          </p>
          <Link
            href="/kontak"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            ✉ Hubungi Kami
          </Link>
          <div className="mt-6">
            <Link href="/gaji/slip" className="text-sm text-slate-400 hover:text-blue-600 transition-colors">
              Atau coba Slip Gaji gratis sekarang →
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
