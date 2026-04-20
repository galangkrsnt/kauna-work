import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Tentang | Kauna Work",
  description:
    "Kauna Work adalah platform alat kerja online untuk profesional dan bisnis Indonesia. Buat slip gaji, faktur, dan dokumen kerja lainnya dengan mudah dan gratis.",
  alternates: { canonical: "https://work.getkauna.com/tentang" },
};

const tools = [
  { icon: "🧾", name: "Slip Gaji Generator", desc: "Generate slip gaji profesional dengan PPh 21 & BPJS otomatis.", status: "Live" },
  { icon: "📄", name: "Faktur / Invoice", desc: "Buat faktur profesional untuk klien, lengkap dengan PPN.", status: "Soon" },
  { icon: "🏢", name: "Dashboard Perusahaan", desc: "Kelola seluruh karyawan dan penggajian dalam satu tempat.", status: "Soon" },
];

export default function TentangPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-16 w-full">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Tentang Kauna Work</h1>
          <p className="text-slate-500">Platform alat kerja online untuk profesional dan bisnis Indonesia.</p>
        </header>

        <div className="space-y-8 text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Apa itu Kauna Work?</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Kauna Work adalah bagian dari ekosistem Kauna — platform alat-alat praktis yang dibuat
              untuk membantu profesional dan pemilik bisnis Indonesia bekerja lebih efisien.
              Kauna Work fokus pada dokumen kerja: slip gaji, faktur, dan administrasi karyawan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Misi Kami</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Membuat pekerjaan administrasi yang repetitif — seperti bikin slip gaji dan faktur —
              bisa selesai dalam hitungan menit, bukan jam. Gratis untuk penggunaan dasar,
              tanpa perlu daftar, tanpa setup yang ribet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Alat yang Tersedia</h2>
            <div className="space-y-3">
              {tools.map((t) => (
                <div key={t.name} className="flex items-start gap-4 bg-white rounded-2xl border border-slate-200 p-4">
                  <span className="text-2xl shrink-0">{t.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-slate-800 text-sm">{t.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        t.status === "Live"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}>
                        {t.status === "Live" ? "Tersedia" : "Segera Hadir"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">Disclaimer</h2>
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm leading-relaxed text-amber-700/80">
                Hasil kalkulasi PPh 21 dan BPJS di Kauna Work bersifat estimasi berdasarkan
                regulasi yang berlaku. Untuk kebutuhan pelaporan pajak resmi, selalu konsultasikan
                dengan konsultan pajak atau akuntan yang berkualifikasi.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Hubungi Kami</h2>
            <p className="text-sm text-slate-500 mb-3">Ada pertanyaan atau saran? Kami terbuka untuk diskusi.</p>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
            >
              Lihat Kontak →
            </Link>
          </section>
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
