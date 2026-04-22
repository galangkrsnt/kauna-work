import Link from "next/link";
import Navbar from "../../components/Navbar";
import GajiBersihCalculator from "./GajiBersihCalculator";

export default function GajiBersihPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold mb-5">
            Kalkulator Gaji Bersih
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Hitung Gaji Bersih (Take-Home Pay)
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Berapa gaji yang benar-benar kamu terima setelah dipotong BPJS dan PPh 21? Hitung di sini dalam detik.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <GajiBersihCalculator />
        </section>

        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Komponen Potongan Gaji Karyawan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "BPJS Kesehatan", pct: "1%", desc: "Dari gaji/tunjangan, maks Rp 12.000.000. Perusahaan menanggung 4% tambahan." },
                { title: "BPJS JHT",       pct: "2%", desc: "Jaminan Hari Tua. Dana bisa dicairkan saat pensiun atau keluar kerja." },
                { title: "BPJS JP",        pct: "1%", desc: "Jaminan Pensiun. Maks gaji Rp 9.559.600. Perusahaan menanggung 2%." },
                { title: "PPh 21",         pct: "Progresif", desc: "Pajak penghasilan, dihitung dari PKP setelah dikurangi PTKP dan biaya jabatan." },
              ].map(item => (
                <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{item.pct}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Slip gaji dengan semua potongan otomatis</h2>
          <p className="text-slate-500 text-sm mb-6">Generate slip gaji profesional. BPJS dan PPh 21 dihitung otomatis. Download PDF gratis.</p>
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
