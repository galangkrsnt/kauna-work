import Link from "next/link";
import Navbar from "../../components/Navbar";
import PPh21Calculator from "./PPh21Calculator";

export default function PPh21Page() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-14 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold mb-5">
            Kalkulator Pajak Penghasilan
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Kalkulator PPh 21 Karyawan
          </h1>
          <p className="text-slate-500 text-base max-w-xl mx-auto">
            Hitung PPh 21 bulanan karyawan berdasarkan tarif progresif terbaru dan status PTKP. Gratis, tanpa daftar.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <PPh21Calculator />
        </section>

        <section className="bg-slate-50 border-y border-slate-200 py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Apa itu PPh 21?</h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                PPh 21 adalah pajak penghasilan yang dipotong dari gaji karyawan oleh perusahaan setiap bulan,
                lalu disetorkan ke negara. Besarnya tergantung penghasilan bruto, status PTKP,
                dan apakah karyawan memiliki NPWP.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Tarif Progresif PPh 21 Terbaru</h2>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3 font-semibold text-slate-600">Penghasilan Kena Pajak (PKP)</th>
                      <th className="text-center px-5 py-3 font-semibold text-slate-600">Tarif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ["0 – Rp 60.000.000", "5%"],
                      ["Rp 60.000.001 – Rp 250.000.000", "15%"],
                      ["Rp 250.000.001 – Rp 500.000.000", "25%"],
                      ["Di atas Rp 500.000.000", "30%"],
                    ].map(([bracket, rate]) => (
                      <tr key={bracket} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-slate-700">{bracket}</td>
                        <td className="px-5 py-3 text-center font-semibold text-blue-600">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-400 mt-2">* Tanpa NPWP: semua tarif dikalikan 120%</p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">PTKP (Penghasilan Tidak Kena Pajak) 2024</h2>
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-3 font-semibold text-slate-600">Status</th>
                      <th className="text-left px-5 py-3 font-semibold text-slate-600">Keterangan</th>
                      <th className="text-right px-5 py-3 font-semibold text-slate-600">PTKP/tahun</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ["TK/0", "Tidak kawin, 0 tanggungan", "Rp 54.000.000"],
                      ["TK/1", "Tidak kawin, 1 tanggungan", "Rp 58.500.000"],
                      ["TK/2", "Tidak kawin, 2 tanggungan", "Rp 63.000.000"],
                      ["TK/3", "Tidak kawin, 3 tanggungan", "Rp 67.500.000"],
                      ["K/0",  "Kawin, 0 tanggungan",       "Rp 58.500.000"],
                      ["K/1",  "Kawin, 1 tanggungan",       "Rp 63.000.000"],
                      ["K/2",  "Kawin, 2 tanggungan",       "Rp 67.500.000"],
                      ["K/3",  "Kawin, 3 tanggungan",       "Rp 72.000.000"],
                    ].map(([status, ket, ptkp]) => (
                      <tr key={status} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-medium text-slate-800">{status}</td>
                        <td className="px-5 py-3 text-slate-500">{ket}</td>
                        <td className="px-5 py-3 text-right font-medium text-slate-800">{ptkp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Mau slip gaji langsung jadi?</h2>
          <p className="text-slate-500 text-sm mb-6">PPh 21 dihitung otomatis — tinggal isi data karyawan dan download PDF.</p>
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
