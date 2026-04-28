import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";
import { isPro } from "@/lib/actions/perusahaan";

export const metadata: Metadata = {
  title: "Panduan Penggunaan — Kauna Work",
  description:
    "Panduan lengkap cara membuat slip gaji dan faktur online dengan Kauna Work. Gratis tanpa daftar, atau upgrade ke Pro untuk simpan data dan riwayat.",
};

// ─── Slip Gaji steps ──────────────────────────────────────────────────────────

const slipFreeSteps = [
  { no: "1", icon: "🌐", title: "Buka Generator", desc: "Pergi ke halaman Slip Gaji. Tidak perlu daftar atau login." },
  { no: "2", icon: "🏢", title: "Isi Data Perusahaan", desc: "Masukkan nama perusahaan, upload logo (opsional), dan pilih periode bulan/tahun." },
  { no: "3", icon: "👤", title: "Isi Data Karyawan", desc: "Isi nama, jabatan, departemen, status PTKP, dan apakah karyawan punya NPWP." },
  { no: "4", icon: "💰", title: "Masukkan Gaji & Tunjangan", desc: "Isi gaji pokok. Tambah tunjangan tetap seperti transport atau makan jika ada." },
  { no: "5", icon: "⚙️", title: "Pilih Potongan Otomatis", desc: "Aktifkan BPJS Kesehatan, JHT, JP, dan/atau PPh 21 sesuai kebijakan perusahaan kamu. Semua dihitung otomatis." },
  { no: "6", icon: "⬇️", title: "Download PDF", desc: 'Klik "Download / Print PDF". Di dialog print, pilih "Save as PDF". Slip langsung jadi.' },
];

const slipProSteps = [
  { no: "1", icon: "🔐", title: "Daftar atau Masuk", desc: "Buat akun Kauna Work. Gratis, butuh beberapa detik saja." },
  { no: "2", icon: "➕", title: "Tambah Karyawan", desc: "Di Dashboard → Tambah Karyawan. Isi data sekali — nama, jabatan, gaji, PTKP, tunjangan." },
  { no: "3", icon: "⚡", title: "Klik 'Buat Slip'", desc: "Dari daftar karyawan, klik Buat Slip. Form slip gaji langsung terisi otomatis — tinggal pilih periode." },
  { no: "4", icon: "⬇️", title: "Download PDF", desc: "Cek preview, sesuaikan jika perlu, lalu download. Bulan depan tinggal ulangi langkah 3–4." },
];

// ─── Faktur steps ─────────────────────────────────────────────────────────────

const fakturFreeSteps = [
  { no: "1", icon: "🌐", title: "Buka Generator Faktur", desc: "Pergi ke halaman Faktur. Tidak perlu daftar atau login." },
  { no: "2", icon: "📋", title: "Isi Detail Faktur", desc: "Masukkan nomor faktur, tanggal, dan jatuh tempo (bisa dinonaktifkan jika tidak perlu)." },
  { no: "3", icon: "🏢", title: "Isi Data Penjual", desc: "Nama perusahaan atau nama kamu sebagai freelancer, alamat, telp, email, dan logo (opsional)." },
  { no: "4", icon: "👥", title: "Isi Data Klien", desc: "Nama klien atau perusahaan klien, beserta alamat dan kontak jika perlu." },
  { no: "5", icon: "📝", title: "Tambah Item / Jasa", desc: "Masukkan nama barang atau jasa, qty, satuan, dan harga satuan. Jumlah dihitung otomatis." },
  { no: "6", icon: "🧮", title: "Aktifkan PPN jika perlu", desc: "Toggle PPN 11% untuk PKP. Tambah diskon dan catatan pembayaran jika ada." },
  { no: "7", icon: "⬇️", title: "Download PDF", desc: 'Klik "Download / Print PDF" → di dialog print pilih "Save as PDF". Faktur profesional langsung jadi.' },
];

const fakturProSteps = [
  { no: "1", icon: "💾", title: "Simpan Katalog Item", desc: 'Klik "+ Simpan ke katalog" di setiap item yang sering kamu pakai. Item tersimpan permanen.' },
  { no: "2", icon: "⚡", title: "Pilih dari Katalog", desc: "Buka halaman Faktur — item katalog muncul sebagai tombol di bagian Item/Jasa. Klik untuk tambah langsung ke faktur." },
  { no: "3", icon: "💾", title: "Simpan Faktur ke Riwayat", desc: 'Klik "Simpan ke Riwayat" setelah selesai. Faktur tersimpan di dashboard.' },
  { no: "4", icon: "📂", title: "Buka & Edit dari Riwayat", desc: "Di Dashboard → Faktur, klik Buka di baris faktur mana saja. Form langsung terisi — edit dan download ulang." },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Apakah benar-benar gratis?",
    a: "Ya. Generate slip gaji, buat faktur, dan download PDF semuanya 100% gratis tanpa perlu daftar. Gratis selamanya untuk penggunaan dasar.",
  },
  {
    q: "Apa bedanya Free dan Pro?",
    a: "Free: kamu isi data manual setiap kali. Pro: data karyawan tersimpan untuk slip gaji, katalog item tersimpan untuk faktur, semua ada riwayatnya — tinggal pilih dan download.",
  },
  {
    q: "Apakah perhitungan PPh 21 akurat?",
    a: "Ya. Kami menghitung berdasarkan tarif progresif terbaru dan PTKP yang berlaku. Namun untuk keputusan pajak final, tetap konsultasi dengan akuntan.",
  },
  {
    q: "Apakah perhitungan PPN di faktur akurat?",
    a: "Ya, PPN 11% dihitung berdasarkan DPP (setelah diskon). Toggle PPN hanya aktifkan jika kamu adalah PKP (Pengusaha Kena Pajak).",
  },
  {
    q: "Data saya disimpan di mana?",
    a: "Untuk pengguna Free, tidak ada data yang disimpan di server kami — semua di browser. Pengguna Pro datanya tersimpan aman di database kami.",
  },
  {
    q: "Bisakah saya upload logo perusahaan?",
    a: "Bisa! Ada opsi upload logo di bagian penjual (faktur) dan informasi perusahaan (slip gaji). Logo akan muncul di PDF.",
  },
  {
    q: "Apakah faktur dan slip gaji ini sah secara hukum?",
    a: "Kauna Work menghasilkan dokumen yang informatif dan profesional. Keabsahan legal tergantung kebijakan dan penandatanganan dari perusahaan masing-masing.",
  },
];

// ─── Shared step component ────────────────────────────────────────────────────

function Steps({ steps, variant }: { steps: typeof slipFreeSteps; variant: "free" | "pro" }) {
  return (
    <div className="space-y-4">
      {steps.map((step) => (
        <div
          key={step.no}
          className={`flex gap-4 p-5 rounded-2xl border ${
            variant === "pro"
              ? "border-blue-100 bg-blue-50/30"
              : "border-slate-100 bg-slate-50/50"
          }`}
        >
          <div
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-sm ${
              variant === "pro"
                ? "bg-blue-600 text-white"
                : "bg-white border border-slate-200 text-slate-400"
            }`}
          >
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
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
            Cara Pakai Kauna Work
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Slip gaji dan faktur online — gratis tanpa daftar, atau Pro untuk yang butuh lebih cepat dan terorganisir.
          </p>
          {/* Jump links */}
          <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
            <a href="#slip-gaji" className="text-sm font-medium text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              🧾 Slip Gaji
            </a>
            <a href="#faktur" className="text-sm font-medium text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              📄 Faktur
            </a>
            <a href="#perbandingan" className="text-sm font-medium text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              ⚖️ Free vs Pro
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-600 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              ❓ FAQ
            </a>
          </div>
        </div>

        {/* ── SLIP GAJI ── */}
        <section id="slip-gaji" className="mb-20 scroll-mt-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-bold text-slate-900">🧾 Slip Gaji Generator</span>
          </div>
          <p className="text-slate-500 text-sm mb-8">
            Generate slip gaji karyawan dengan perhitungan PPh 21 dan BPJS otomatis. Download PDF gratis.
          </p>

          {/* Free */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest">
                Free — Tanpa Daftar
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <p className="text-slate-500 text-sm mb-5">
              Cocok untuk sesekali bikin slip gaji — untuk 1–2 karyawan, atau coba-coba dulu.
            </p>
            <Steps steps={slipFreeSteps} variant="free" />
            <div className="mt-5">
              <Link href="/gaji/slip" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors">
                Coba Gratis Sekarang →
              </Link>
            </div>
          </div>

          {/* Pro */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest">
                Pro — Lebih Cepat
              </span>
              <div className="flex-1 h-px bg-blue-100" />
            </div>
            <p className="text-slate-500 text-sm mb-5">
              Ideal untuk HRD atau pemilik bisnis yang rutin generate slip banyak karyawan tiap bulan. Data tersimpan — bulan depan tinggal klik.
            </p>
            <Steps steps={slipProSteps} variant="pro" />
            <div className="mt-5 p-4 rounded-2xl bg-blue-600 text-white">
              <p className="font-bold text-sm mb-0.5">Bulan pertama: 4 langkah.</p>
              <p className="text-blue-100 text-xs">Bulan kedua dan seterusnya: 2 langkah — pilih karyawan, pilih bulan, download. Selesai.</p>
            </div>
          </div>
        </section>

        <div className="relative my-4 mb-16">
          <div className="w-full h-px bg-slate-100" />
        </div>

        {/* ── FAKTUR ── */}
        <section id="faktur" className="mb-20 scroll-mt-20">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-lg font-bold text-slate-900">📄 Faktur & Invoice Generator</span>
          </div>
          <p className="text-slate-500 text-sm mb-8">
            Buat faktur profesional untuk klien — dengan PPN otomatis, diskon, dan catatan pembayaran. Download PDF gratis.
          </p>

          {/* Free */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest">
                Free — Tanpa Daftar
              </span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>
            <p className="text-slate-500 text-sm mb-5">
              Cocok untuk freelancer atau bisnis yang sesekali perlu faktur. Tidak perlu login, langsung isi dan download.
            </p>
            <Steps steps={fakturFreeSteps} variant="free" />
            <div className="mt-5">
              <Link href="/faktur" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors">
                Coba Buat Faktur →
              </Link>
            </div>
          </div>

          {/* Pro */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest">
                Pro — Katalog & Riwayat
              </span>
              <div className="flex-1 h-px bg-blue-100" />
            </div>
            <p className="text-slate-500 text-sm mb-5">
              Ideal untuk yang sering pakai item/jasa yang sama di setiap faktur. Simpan katalog item sekali, pakai terus — tidak perlu ketik ulang.
            </p>
            <Steps steps={fakturProSteps} variant="pro" />
            <div className="mt-5 p-4 rounded-2xl bg-blue-600 text-white">
              <p className="font-bold text-sm mb-0.5">Faktur pertama: isi lengkap.</p>
              <p className="text-blue-100 text-xs">Faktur berikutnya: pilih item dari katalog, ganti nama klien dan nomor, download. Selesai dalam menit.</p>
            </div>
          </div>
        </section>

        <div className="relative my-4 mb-16">
          <div className="w-full h-px bg-slate-100" />
        </div>

        {/* ── Comparison table ── */}
        <section id="perbandingan" className="mb-16 scroll-mt-20">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Free vs Pro — Perbandingan Lengkap</h2>
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
                {([
                  ["— Slip Gaji —", null, null],
                  ["Generate slip gaji", true, true],
                  ["Download PDF", true, true],
                  ["Hitung PPh 21 & BPJS otomatis", true, true],
                  ["Upload logo perusahaan", true, true],
                  ["Simpan data karyawan", false, true],
                  ["Auto-fill slip dari data tersimpan", false, true],
                  ["Riwayat slip per karyawan", false, true],
                  ["Bulk generate semua karyawan", false, true],
                  ["Simpan profil perusahaan", false, true],
                  ["— Faktur —", null, null],
                  ["Generate faktur & invoice", true, true],
                  ["Download PDF faktur", true, true],
                  ["Hitung PPN 11% otomatis", true, true],
                  ["Toggle jatuh tempo", true, true],
                  ["Katalog item/jasa tersimpan", false, true],
                  ["Riwayat faktur tersimpan", false, true],
                  ["Buka & edit faktur lama", false, true],
                ] as [string, boolean | null, boolean | null][]).map(([fitur, free, pro]) => (
                  fitur.startsWith("—") ? (
                    <tr key={fitur} className="bg-slate-50">
                      <td colSpan={3} className="px-5 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                        {fitur.replace(/—/g, "").trim()}
                      </td>
                    </tr>
                  ) : (
                    <tr key={fitur} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 text-slate-700">{fitur}</td>
                      <td className="px-5 py-3 text-center">
                        {free === true ? <span className="text-emerald-500 font-bold">✓</span> : <span className="text-slate-300">✗</span>}
                      </td>
                      <td className="px-5 py-3 text-center">
                        {pro === true ? <span className="text-blue-500 font-bold">✓</span> : <span className="text-slate-300">✗</span>}
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="faq" className="mb-16 scroll-mt-20">
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
              <p className="text-slate-400 text-sm mb-6">Semua fitur aktif — slip gaji, faktur, katalog, riwayat.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors">
                  Buka Dashboard →
                </Link>
                <Link href="/faktur" className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
                  Buat Faktur
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Siap coba?</h2>
              <p className="text-slate-400 text-sm mb-6">Mulai gratis tanpa daftar, atau langsung upgrade Pro.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/gaji/slip" className="px-5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors">
                  Coba Slip Gaji
                </Link>
                <Link href="/faktur" className="px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors">
                  Coba Faktur
                </Link>
                <Link href="/upgrade" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-900">
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
