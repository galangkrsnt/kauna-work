import Link from "next/link";
import Navbar from "./components/Navbar";
import { isPro } from "@/lib/actions/perusahaan";

const tools = [
  {
    icon: "🧾",
    title: "Slip Gaji",
    desc: "Generate slip gaji profesional dalam hitungan detik. PPh 21 dan BPJS dihitung otomatis.",
    href: "/gaji/slip",
    badge: null,
    cta: "Buat Slip Gaji",
    active: true,
  },
  {
    icon: "📄",
    title: "Faktur",
    desc: "Buat faktur / invoice profesional untuk klien kamu. Kirim langsung atau download PDF.",
    href: "/faktur",
    badge: "Segera Hadir",
    cta: "Lihat Info",
    active: false,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "Rp 0",
    period: "",
    desc: "Untuk penggunaan sesekali.",
    features: [
      "Generate slip gaji unlimited",
      "Download PDF",
      "Hitung PPh 21 & BPJS otomatis",
      "Tanpa perlu daftar",
    ],
    missing: ["Simpan data karyawan", "Riwayat slip", "Bulk generate", "Simpan profil perusahaan"],
    cta: "Mulai Gratis",
    href: "/gaji/slip",
    highlight: false,
    tag: null,
  },
  {
    name: "Pro Bulanan",
    price: "Rp 49.000",
    period: "/bulan",
    desc: "Untuk HRD dan pemilik bisnis aktif.",
    features: [
      "Semua fitur Free",
      "Simpan data karyawan",
      "Riwayat slip per karyawan",
      "Bulk generate semua karyawan",
      "Simpan profil & logo perusahaan",
    ],
    missing: [],
    cta: "Mulai Pro",
    href: "/upgrade",
    highlight: false,
    tag: null,
  },
  {
    name: "Pro Tahunan",
    price: "Rp 39.000",
    period: "/bulan",
    desc: "Hemat Rp 120.000 per tahun.",
    features: [
      "Semua fitur Free",
      "Simpan data karyawan",
      "Riwayat slip per karyawan",
      "Bulk generate semua karyawan",
      "Simpan profil & logo perusahaan",
    ],
    missing: [],
    cta: "Mulai Pro Tahunan",
    href: "/upgrade",
    highlight: true,
    tag: "Terbaik",
  },
];

export default async function HomePage() {
  const pro = await isPro();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-6">
            <span>✦</span>
            Alat kerja untuk profesional Indonesia
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-5 max-w-3xl mx-auto">
            Dokumen kerja profesional,{" "}
            <span className="text-blue-600">dibuat dalam detik</span>
          </h1>
          <p className="text-slate-500 text-lg leading-relaxed max-w-xl mx-auto mb-8">
            Slip gaji, faktur, dan dokumen kerja lainnya — tanpa Excel, tanpa ribet.
            Gratis untuk penggunaan dasar.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/gaji/slip"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
            >
              Buat Slip Gaji — Gratis
            </Link>
            <Link
              href="#tools"
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Lihat Semua Fitur
            </Link>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Alat yang Tersedia</h2>
          <p className="text-slate-500 text-sm text-center mb-10">Gratis untuk digunakan, upgrade untuk fitur lebih.</p>

          <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {tools.map((tool) => (
              <div
                key={tool.title}
                className={`relative rounded-3xl border p-6 flex flex-col gap-4 ${
                  tool.active
                    ? "border-blue-200 bg-blue-50/40 shadow-sm shadow-blue-100"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                {tool.badge && (
                  <span className="absolute top-4 right-4 text-xs bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-semibold">
                    {tool.badge}
                  </span>
                )}
                <div className="text-3xl">{tool.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{tool.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{tool.desc}</p>
                </div>
                <Link
                  href={tool.href}
                  className={`mt-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    tool.active
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200"
                      : "border border-slate-300 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tool.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        {pro ? (
          <section className="bg-slate-50 border-y border-slate-200 py-16">
            <div className="max-w-lg mx-auto px-4 text-center">
              <span className="inline-block text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                ✓ Kamu sudah Pro
              </span>
              <p className="text-slate-600 text-sm mb-6">
                Semua fitur Pro aktif di akunmu. Kelola karyawan dan buat slip gaji dari dashboard.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                Buka Dashboard →
              </Link>
            </div>
          </section>
        ) : (
          <section className="bg-slate-50 border-y border-slate-200 py-20">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Harga Transparan</h2>
              <p className="text-slate-500 text-sm text-center mb-12">Mulai gratis, upgrade kalau butuh lebih.</p>

              <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
                {pricingPlans.map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative rounded-3xl border p-6 flex flex-col gap-5 bg-white ${
                      plan.highlight
                        ? "border-blue-400 shadow-lg shadow-blue-100 ring-1 ring-blue-400"
                        : "border-slate-200"
                    }`}
                  >
                    {plan.tag && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs bg-blue-600 text-white px-3 py-1 rounded-full font-semibold whitespace-nowrap">
                        {plan.tag}
                      </span>
                    )}
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{plan.name}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                        {plan.period && <span className="text-sm text-slate-400">{plan.period}</span>}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                    </div>
                    <ul className="space-y-2 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
                          {f}
                        </li>
                      ))}
                      {plan.missing.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                          <span className="mt-0.5 shrink-0">✗</span>
                          {f}
                        </li>
                      ))}
                    </ul>
                    {plan.href ? (
                      <Link
                        href={plan.href}
                        className={`text-center px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          plan.highlight
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200"
                            : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {plan.cta}
                      </Link>
                    ) : (
                      <span className="text-center block px-4 py-2.5 rounded-xl text-sm font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                        {plan.cta}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
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
