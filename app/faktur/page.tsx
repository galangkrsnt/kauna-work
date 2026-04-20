import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Faktur Online — Segera Hadir | Kauna Work",
  description:
    "Buat faktur dan invoice profesional secara online. Segera hadir di Kauna Work — daftar untuk notifikasi peluncuran.",
  alternates: { canonical: "https://work.getkauna.com/faktur" },
};

const upcomingFeatures = [
  { icon: "📋", title: "Template Profesional", desc: "Pilih dari berbagai template faktur siap pakai." },
  { icon: "🧮", title: "Hitung PPN Otomatis", desc: "PPN 11% dihitung otomatis, bisa diaktifkan/nonaktifkan." },
  { icon: "📤", title: "Download & Kirim PDF", desc: "Export ke PDF atau kirim langsung ke email klien." },
  { icon: "📁", title: "Kelola Klien & Invoice", desc: "Simpan daftar klien, lacak status pembayaran. (Pro)" },
  { icon: "🔢", title: "Nomor Invoice Otomatis", desc: "Penomoran invoice berurutan dan konsisten. (Pro)" },
  { icon: "📊", title: "Laporan Pendapatan", desc: "Ringkasan pendapatan per bulan dan per klien. (Pro)" },
];

export default function FakturPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-16 w-full">
        {/* Badge + heading */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold mb-6">
            <span>🚧</span>
            Segera Hadir
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Faktur & Invoice Online
          </h1>
          <p className="text-slate-500 text-lg max-w-lg mx-auto leading-relaxed">
            Buat faktur profesional untuk klien kamu — tanpa Word, tanpa Excel.
            Kami sedang membangunnya.
          </p>
        </div>

        {/* Features preview */}
        <div className="mb-14">
          <h2 className="text-lg font-bold text-slate-700 text-center mb-8">Yang akan tersedia</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {upcomingFeatures.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 flex gap-4 items-start"
              >
                <span className="text-2xl shrink-0">{f.icon}</span>
                <div>
                  <p className="font-semibold text-slate-800 text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA — notify */}
        <div className="max-w-md mx-auto text-center bg-blue-50 border border-blue-100 rounded-3xl p-8">
          <p className="text-2xl mb-3">📬</p>
          <h2 className="text-lg font-bold text-slate-900 mb-2">Ingin tahu duluan?</h2>
          <p className="text-sm text-slate-500 mb-5">
            Kirim email ke kami dan kamu jadi yang pertama tahu saat fitur ini meluncur.
          </p>
          <a
            href="mailto:kaunaverse@gmail.com?subject=Notifikasi Faktur Kauna Work&body=Halo, saya ingin diberitahu saat fitur Faktur di Kauna Work sudah tersedia."
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            <span>✉</span>
            Beritahu Saya
          </a>
        </div>

        {/* Back to slip gaji */}
        <div className="text-center mt-10">
          <p className="text-sm text-slate-400 mb-3">Sementara itu, coba fitur yang sudah tersedia:</p>
          <Link
            href="/gaji/slip"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors"
          >
            🧾 Buat Slip Gaji — Gratis
          </Link>
        </div>
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
