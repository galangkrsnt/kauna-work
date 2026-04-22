import Link from "next/link";
import Navbar from "../../components/Navbar";
import BpjsCalculator from "./BpjsCalculator";

export default function BpjsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold mb-5">
            Kalkulator BPJS
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Kalkulator Iuran BPJS Karyawan
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Hitung iuran BPJS Kesehatan, JHT, JP, JKK, dan JKM — bagian karyawan dan perusahaan. Otomatis, gratis.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <BpjsCalculator />
        </section>

        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
            <h2 className="text-xl font-bold text-slate-900">Panduan Iuran BPJS Ketenagakerjaan & Kesehatan</h2>
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 font-semibold text-slate-600">Program</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Karyawan</th>
                    <th className="text-center px-4 py-3 font-semibold text-slate-600">Perusahaan</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-600">Batas Gaji</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["BPJS Kesehatan", "1%",   "4%",    "Maks Rp 12.000.000"],
                    ["BPJS JHT",       "2%",   "3,7%",  "Tidak ada batas"],
                    ["BPJS JP",        "1%",   "2%",    "Maks Rp 9.559.600"],
                    ["BPJS JKK",       "—",    "0,24%*","Tidak ada batas"],
                    ["BPJS JKM",       "—",    "0,3%",  "Tidak ada batas"],
                  ].map(([prog, k, p, batas]) => (
                    <tr key={prog} className="hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-medium text-slate-800">{prog}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{k}</td>
                      <td className="px-4 py-3 text-center text-slate-600">{p}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{batas}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400">* JKK bervariasi 0.24%–1.74% tergantung risiko pekerjaan. Kalkulator ini memakai 0.24% (risiko sangat rendah).</p>
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Slip gaji dengan BPJS otomatis</h2>
          <p className="text-slate-500 text-sm mb-6">Semua potongan BPJS dihitung dan tampil langsung di slip gaji. Download PDF gratis.</p>
          <Link href="/gaji/slip" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
            Buat Slip Gaji Gratis →
          </Link>
        </section>
      </main>

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
