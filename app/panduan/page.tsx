import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { isPro } from "@/lib/actions/perusahaan";

export const metadata: Metadata = {
  title: "Cara Pakai Slip Gaji Generator — Kauna Work",
  description:
    "Panduan lengkap cara membuat slip gaji online dengan Kauna Work. Gratis tanpa daftar, atau upgrade ke Pro untuk simpan data karyawan.",
};

const freeSteps = [
  {
    no: "1",
    title: "Buka Generator",
    desc: "Pergi ke halaman Slip Gaji. Tidak perlu daftar atau login.",
    icon: "🌐",
  },
  {
    no: "2",
    title: "Isi Data Perusahaan",
    desc: "Masukkan nama perusahaan, upload logo (opsional), dan pilih periode bulan/tahun.",
    icon: "🏢",
  },
  {
    no: "3",
    title: "Isi Data Karyawan",
    desc: "Isi nama, jabatan, departemen, status PTKP, dan apakah karyawan punya NPWP.",
    icon: "👤",
  },
  {
    no: "4",
    title: "Masukkan Gaji & Tunjangan",
    desc: "Isi gaji pokok. Tambah tunjangan tetap seperti transport atau makan jika ada.",
    icon: "💰",
  },
  {
    no: "5",
    title: "Pilih Potongan Otomatis",
    desc: "Aktifkan BPJS Kesehatan, JHT, JP, dan/atau PPh 21 sesuai kebijakan perusahaan kamu. Semua dihitung otomatis.",
    icon: "⚙️",
  },
  {
    no: "6",
    title: "Download PDF",
    desc: 'Klik "Download / Print PDF". Di dialog print, pilih "Save as PDF". Slip langsung jadi.',
    icon: "⬇️",
  },
];

const proSteps = [
  {
    no: "1",
    title: "Daftar atau Masuk",
    desc: "Buat akun Kauna Work. Gratis, butuh beberapa detik saja.",
    icon: "🔐",
  },
  {
    no: "2",
    title: "Tambah Karyawan",
    desc: "Di Dashboard → Tambah Karyawan. Isi data sekali — nama, jabatan, gaji, PTKP, tunjangan.",
    icon: "➕",
  },
  {
    no: "3",
    title: "Simpan & Kelola",
    desc: "Data karyawan tersimpan permanen. Bisa diedit kapan saja. Hapus kalau sudah tidak aktif.",
    icon: "💾",
  },
  {
    no: "4",
    title: "Klik 'Buat Slip'",
    desc: "Dari daftar karyawan, klik Buat Slip. Form slip gaji langsung terisi otomatis — tinggal pilih periode.",
    icon: "⚡",
  },
  {
    no: "5",
    title: "Download PDF",
    desc: "Cek preview, sesuaikan jika perlu, lalu download. Prosesnya jauh lebih cepat mulai bulan kedua.",
    icon: "⬇️",
  },
];

const faqs = [
  {
    q: "Apakah benar-benar gratis?",
    a: "Ya. Generate slip gaji dan download PDF 100% gratis, tanpa batas, tanpa perlu daftar. Gratis selamanya untuk penggunaan dasar.",
  },
  {
    q: "Apa bedanya Free dan Pro?",
    a: "Free: kamu isi data manual setiap kali buat slip. Pro: data karyawan tersimpan, tinggal pilih karyawan dan bulan — selesai dalam detik.",
  },
  {
    q: "Apakah perhitungan PPh 21 akurat?",
    a: "Ya. Kami menghitung berdasarkan tarif progresif terbaru dan PTKP yang berlaku. Namun untuk keputusan pajak final, tetap konsultasi dengan akuntan.",
  },
  {
    q: "Data saya disimpan di mana?",
    a: "Untuk pengguna Free, tidak ada data yang disimpan di server kami — semua di browser kamu. Pengguna Pro datanya tersimpan aman di database kami.",
  },
  {
    q: "Bisakah saya upload logo perusahaan?",
    a: "Bisa! Ada opsi upload logo di bagian Informasi Perusahaan. Logo akan muncul di slip gaji dan PDF.",
  },
  {
    q: "Apakah slip gaji ini sah secara hukum?",
    a: "Kauna Work menghasilkan dokumen slip gaji yang informatif dan profesional. Keabsahan legal tergantung kebijakan dan penandatanganan dari perusahaan masing-masing.",
  },
];

export default async function PanduanPage() {
  const pro = await isPro();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 w-full">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-5">
            Panduan Penggunaan
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Cara Pakai Slip Gaji Generator
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Dua cara pakai — gratis tanpa daftar, atau Pro untuk yang butuh lebih cepat dan terorganisir.
          </p>
        </div>

        {/* Free tier */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest">
              Free — Tanpa Daftar
            </span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <p className="text-slate-500 text-sm mb-8">
            Cocok buat kamu yang sesekali bikin slip gaji — untuk 1–2 karyawan, atau coba-coba dulu.
          </p>

          <div className="space-y-4">
            {freeSteps.map((step) => (
              <div key={step.no} className="flex gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-400 shadow-sm">
                  {step.no}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 mb-0.5">
                    <span className="mr-2">{step.icon}</span>{step.title}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/gaji/slip"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors"
            >
              Coba Gratis Sekarang →
            </Link>
          </div>
        </section>

        {/* Divider */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-slate-100" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-xs text-slate-400 font-medium">atau, kalau kamu sering bikin slip</span>
          </div>
        </div>

        {/* Pro tier */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest">
              Pro — Lebih Cepat & Terorganisir
            </span>
            <div className="flex-1 h-px bg-blue-100" />
          </div>

          <p className="text-slate-500 text-sm mb-8">
            Ideal untuk HRD, pemilik bisnis, atau siapa saja yang rutin generate slip untuk banyak karyawan tiap bulan.
            Data karyawan tersimpan — bulan depan tinggal klik.
          </p>

          <div className="space-y-4">
            {proSteps.map((step) => (
              <div key={step.no} className="flex gap-4 p-5 rounded-2xl border border-blue-100 bg-blue-50/30">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                  {step.no}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 mb-0.5">
                    <span className="mr-2">{step.icon}</span>{step.title}
                  </p>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pro comparison callout */}
          <div className="mt-8 p-5 rounded-2xl bg-blue-600 text-white">
            <p className="font-bold text-base mb-1">Bulan pertama: 6 langkah.</p>
            <p className="text-blue-100 text-sm">
              Bulan kedua dan seterusnya: 2 langkah — pilih karyawan, pilih bulan, download. Selesai.
            </p>
          </div>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            {pro ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
              >
                Buka Dashboard →
              </Link>
            ) : (
              <>
                <Link
                  href="/upgrade"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                  Upgrade ke Pro →
                </Link>
                <Link
                  href="/#pricing"
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Lihat harga
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Comparison table */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Free vs Pro — Perbandingan Cepat</h2>
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-5 py-3 font-semibold text-slate-600">Fitur</th>
                  <th className="text-center px-5 py-3 font-semibold text-slate-600">Free</th>
                  <th className="text-center px-5 py-3 font-semibold text-blue-600">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Generate slip gaji", true, true],
                  ["Download PDF", true, true],
                  ["Hitung PPh 21 otomatis", true, true],
                  ["Hitung BPJS otomatis", true, true],
                  ["Upload logo perusahaan", true, true],
                  ["Tanpa perlu daftar", true, false],
                  ["Simpan data karyawan", false, true],
                  ["Riwayat slip per karyawan", false, true],
                  ["Auto-fill dari data tersimpan", false, true],
                  ["Simpan profil perusahaan", false, true],
                ].map(([fitur, free, pro]) => (
                  <tr key={fitur as string} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 text-slate-700">{fitur as string}</td>
                    <td className="px-5 py-3 text-center">
                      {free ? (
                        <span className="text-emerald-500 font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300">✗</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {pro ? (
                        <span className="text-blue-500 font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-slate-200 p-5">
                <p className="font-semibold text-slate-800 mb-2">{faq.q}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-3xl bg-slate-900 text-white p-8 text-center">
          {pro ? (
            <>
              <h2 className="text-2xl font-bold mb-2">Kamu sudah Pro!</h2>
              <p className="text-slate-400 text-sm mb-6">
                Semua fitur Pro aktif. Langsung generate slip dari dashboard.
              </p>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
              >
                Buka Dashboard →
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Siap coba?</h2>
              <p className="text-slate-400 text-sm mb-6">
                Mulai gratis tanpa daftar, atau langsung daftar Pro.
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link
                  href="/gaji/slip"
                  className="px-6 py-3 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors"
                >
                  Coba Gratis
                </Link>
                <Link
                  href="/upgrade"
                  className="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-900"
                >
                  Upgrade Pro
                </Link>
              </div>
            </>
          )}
        </section>

      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 sm:px-6 py-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
