import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../components/Navbar";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Kauna Work",
  description:
    "Kebijakan privasi Kauna Work. Data karyawan yang kamu input tidak disimpan di server kami — semua kalkulasi berjalan langsung di browser.",
  alternates: { canonical: "https://work.getkauna.com/kebijakan-privasi" },
};

const sections = [
  {
    title: "Data yang Kami Kumpulkan",
    body: "Kauna Work adalah aplikasi yang berjalan sepenuhnya di browser kamu. Data yang kamu input — nama karyawan, gaji, tunjangan, dan potongan — tidak dikirim atau disimpan di server kami. Semua kalkulasi dilakukan secara lokal di perangkat kamu.",
  },
  {
    title: "Analitik",
    body: "Kami menggunakan Vercel Analytics untuk memantau jumlah pengunjung dan performa halaman secara agregat dan anonim. Data ini tidak dapat digunakan untuk mengidentifikasi individu dan tidak mengandung informasi pribadi.",
  },
  {
    title: "Cookie",
    body: "Kauna Work tidak menggunakan cookie untuk melacak pengguna. Vercel Analytics menggunakan pendekatan privacy-first yang tidak membutuhkan cookie.",
  },
  {
    title: "Pihak Ketiga",
    body: "Situs ini dapat berisi tautan ke layanan pihak ketiga. Kami tidak bertanggung jawab atas kebijakan privasi layanan tersebut.",
  },
  {
    title: "Keamanan Data",
    body: "Karena kami tidak menyimpan data pribadi kamu di server, tidak ada risiko kebocoran data dari sisi kami. Data yang kamu input hanya ada di browser kamu dan hilang saat tab ditutup.",
  },
  {
    title: "Perubahan Kebijakan",
    body: "Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan signifikan akan diinformasikan melalui halaman ini dengan mencantumkan tanggal pembaruan.",
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-16 w-full">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Kebijakan Privasi</h1>
          <p className="text-slate-400 text-sm">Terakhir diperbarui: 20 April 2026</p>
        </header>

        <div className="space-y-8">
          <p className="text-sm leading-relaxed text-slate-500">
            Kauna Work berkomitmen untuk melindungi privasi pengguna. Kebijakan ini menjelaskan
            bagaimana kami menangani informasi saat kamu menggunakan layanan kami di work.getkauna.com.
          </p>

          {sections.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h2>
              <p className="text-sm leading-relaxed text-slate-500">{s.body}</p>
            </section>
          ))}

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Hubungi Kami</h2>
            <p className="text-sm text-slate-500 mb-3">
              Pertanyaan mengenai kebijakan privasi ini dapat dikirim ke:
            </p>
            <a
              href="mailto:kaunaverse@gmail.com"
              className="text-blue-600 font-medium hover:underline text-sm"
            >
              kaunaverse@gmail.com
            </a>
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
