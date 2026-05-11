import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import Navbar from "../components/Navbar";
import FakturClient from "./FakturClient";
import { isPro } from "@/lib/actions/perusahaan";
import { getFakturItems, getFakturById } from "@/lib/actions/faktur";

export const metadata: Metadata = {
  title: "Generator Faktur Online Gratis — Kauna Work",
  description:
    "Buat faktur dan invoice profesional secara online. Hitung PPN otomatis, download PDF gratis. Tanpa daftar, langsung pakai.",
  keywords: ["faktur online", "invoice generator", "buat faktur pdf", "kalkulator ppn", "invoice indonesia gratis"],
  alternates: { canonical: "https://work.getkauna.com/faktur" },
  openGraph: {
    title: "Generator Faktur Online Gratis — Kauna Work",
    description: "Buat faktur profesional, hitung PPN otomatis, download PDF. Gratis.",
    type: "website",
  },
};

const faqs = [
  {
    q: "Apa itu faktur dan kapan harus dibuat?",
    a: "Faktur (invoice) adalah dokumen tagihan resmi dari penjual kepada pembeli. Kamu perlu membuat faktur setiap kali memberikan jasa atau menjual barang secara kredit — freelancer, kontraktor, atau pemilik usaha wajib membuatnya agar pembayaran tercatat dan profesional.",
  },
  {
    q: "Apakah faktur yang dibuat di sini sah secara hukum?",
    a: "Faktur dari generator ini mengandung semua elemen yang disyaratkan: nama penjual & pembeli, nomor faktur, tanggal, rincian barang/jasa, dan total tagihan. Untuk keabsahan pajak (faktur pajak PKP), kamu perlu menerbitkannya melalui e-Faktur DJP. Generator ini cocok untuk faktur komersial non-PKP.",
  },
  {
    q: "Bagaimana cara menambahkan PPN ke faktur?",
    a: "Aktifkan toggle PPN 11% di bagian Pajak & Lainnya. Sistem akan otomatis menghitung DPP (Dasar Pengenaan Pajak) dan PPN 11% berdasarkan subtotal setelah diskon, lalu menampilkannya di faktur dan preview.",
  },
  {
    q: "Bagaimana cara download faktur sebagai PDF?",
    a: "Klik tombol 'Download / Print PDF'. Di dialog print browser, pilih tujuan 'Save as PDF'. Faktur akan tercetak format A4 tanpa elemen UI tambahan — hanya dokumen faktur yang bersih.",
  },
  {
    q: "Apa perbedaan Free dan Pro untuk fitur faktur?",
    a: "Free: buat dan download faktur tanpa batas, tanpa perlu daftar. Pro: simpan faktur ke riwayat dan buka kapan saja, kelola katalog item/jasa yang bisa dipilih ulang tanpa mengetik, serta simpan profil perusahaan yang auto-fill di setiap faktur.",
  },
  {
    q: "Apakah data faktur saya aman?",
    a: "Pengguna Free mengisi form di browser — tidak ada data yang dikirim ke server. Pengguna Pro yang memilih 'Simpan ke Riwayat' akan menyimpan data terenkripsi di database kami (Supabase) yang hanya bisa diakses oleh akun kamu sendiri.",
  },
];

export default async function FakturPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { userId } = await auth();
  const pro = userId ? await isPro() : false;
  const { from } = await searchParams;

  const [savedItems, historyRow] = await Promise.all([
    pro ? getFakturItems() : Promise.resolve([]),
    pro && from ? getFakturById(from) : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <FakturClient
        isPro={pro}
        savedItems={savedItems}
        initialData={historyRow?.data_faktur as Record<string, unknown> | undefined}
        historyId={historyRow?.id}
      />

      {/* SEO Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-20 w-full space-y-16 mt-4">

        {/* What is faktur */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Apa itu Faktur / Invoice?</h2>
          <div className="prose prose-sm text-slate-600 max-w-none space-y-3">
            <p>
              <strong>Faktur</strong> (disebut juga <em>invoice</em>) adalah dokumen tagihan resmi yang diterbitkan oleh
              penjual kepada pembeli sebagai bukti transaksi dan permintaan pembayaran. Faktur memuat detail barang atau
              jasa yang dijual, jumlah yang harus dibayar, tenggat waktu pembayaran, serta informasi pajak jika
              diperlukan.
            </p>
            <p>
              Bagi <strong>freelancer, kontraktor, dan pemilik usaha</strong>, faktur yang profesional adalah kunci agar
              klien melakukan pembayaran tepat waktu dan transaksi tercatat dengan rapi. Faktur juga menjadi bukti sah
              untuk keperluan pembukuan dan perpajakan.
            </p>
            <p>
              Generator faktur Kauna Work memungkinkan kamu membuat faktur profesional dalam hitungan menit — isi form,
              preview langsung, download PDF. Gratis, tanpa perlu daftar akun.
            </p>
          </div>
        </section>

        {/* Komponen faktur */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Komponen Faktur yang Lengkap</h2>
          <p className="text-sm text-slate-500 mb-5">
            Faktur yang profesional dan sah secara komersial harus memuat elemen-elemen berikut:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Nomor Faktur", desc: "Identifikasi unik untuk setiap faktur — penting untuk arsip." },
              { label: "Tanggal & Jatuh Tempo", desc: "Tanggal diterbitkan dan batas waktu pembayaran." },
              { label: "Identitas Penjual", desc: "Nama perusahaan/freelancer, alamat, telp, dan email." },
              { label: "Identitas Pembeli / Klien", desc: "Nama dan kontak klien atau perusahaan pembeli." },
              { label: "Rincian Barang / Jasa", desc: "Nama item, qty, satuan, harga satuan, dan subtotal." },
              { label: "PPN (jika PKP)", desc: "Pajak Pertambahan Nilai 11% untuk pengusaha kena pajak." },
              { label: "Total Tagihan", desc: "Jumlah akhir yang harus dibayarkan oleh klien." },
              { label: "Catatan Pembayaran", desc: "Nomor rekening, metode pembayaran, atau instruksi khusus." },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 bg-white rounded-xl border border-slate-200 p-4">
                <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">✓</span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cara membuat faktur */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Cara Membuat Faktur Online di Kauna Work</h2>
          <ol className="space-y-4">
            {[
              {
                step: "1",
                title: "Isi Detail Faktur",
                desc: "Masukkan nomor faktur (misal: INV-001), tanggal penerbitan, dan jatuh tempo pembayaran.",
              },
              {
                step: "2",
                title: "Isi Data Penjual",
                desc: "Masukkan nama perusahaan atau nama kamu sebagai freelancer, alamat, dan kontak. Upload logo jika ada.",
              },
              {
                step: "3",
                title: "Isi Data Klien",
                desc: "Masukkan nama klien atau perusahaan pembeli beserta alamat dan kontaknya.",
              },
              {
                step: "4",
                title: "Tambahkan Item / Jasa",
                desc: "Masukkan nama barang atau jasa, qty, satuan, dan harga satuan. Tambahkan baris baru untuk setiap item.",
              },
              {
                step: "5",
                title: "Atur Pajak & Diskon",
                desc: "Aktifkan PPN 11% jika kamu PKP. Masukkan diskon jika ada. Tambahkan catatan rekening pembayaran.",
              },
              {
                step: "6",
                title: "Download PDF",
                desc: "Klik 'Download / Print PDF', lalu di dialog browser pilih 'Save as PDF'. Faktur siap dikirim ke klien.",
              },
            ].map((s) => (
              <li key={s.step} className="flex gap-4 bg-white rounded-xl border border-slate-200 p-4">
                <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{s.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Pertanyaan yang Sering Ditanyakan</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-white rounded-xl border border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-800 mb-1.5">{faq.q}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
