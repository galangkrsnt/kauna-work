import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Kontak | Kauna Work",
  description: "Hubungi tim Kauna Work untuk pertanyaan, saran, atau laporan masalah.",
  alternates: { canonical: "https://work.getkauna.com/kontak" },
};

export default function KontakPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-16 w-full">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Kontak</h1>
          <p className="text-slate-500">Ada pertanyaan, saran, atau laporan masalah? Kami siap membantu.</p>
        </header>

        <div className="space-y-4">
          {/* WhatsApp */}
          <a
            href="https://wa.me/6281252156651"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-xl shrink-0">
              💬
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">WhatsApp</p>
              <p className="text-sm text-slate-400">+62 812-5215-6651 · Respon cepat</p>
            </div>
            <span className="text-slate-300 group-hover:text-emerald-400 transition-colors">→</span>
          </a>

          {/* Email */}
          <a
            href="mailto:kaunaverse@gmail.com"
            className="flex items-center gap-4 bg-white rounded-2xl border border-slate-200 p-5 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xl shrink-0">
              ✉️
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">Email</p>
              <p className="text-sm text-slate-400">kaunaverse@gmail.com</p>
            </div>
            <span className="text-slate-300 group-hover:text-blue-400 transition-colors">→</span>
          </a>
        </div>

        <div className="mt-10 rounded-2xl bg-slate-50 border border-slate-200 p-5">
          <p className="text-sm font-semibold text-slate-700 mb-1">Tentang feedback & bug report</p>
          <p className="text-sm text-slate-400 leading-relaxed">
            Kalau ada hasil kalkulasi yang tidak tepat atau tampilan yang rusak, langsung chat via WhatsApp
            atau gunakan form feedback di halaman Slip Gaji. Kami akan respon secepat mungkin.
          </p>
        </div>
      </main>

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
