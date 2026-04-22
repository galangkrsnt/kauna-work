import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import { isPro } from "@/lib/actions/perusahaan";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upgrade ke Pro — Kauna Work",
};

const WA_NUMBER = "6281252156651";
const WA_MESSAGE_QRIS = encodeURIComponent(
  "Halo, saya sudah bayar Pro Kauna Work via QRIS. Ini bukti transfernya 👇"
);
const WA_MESSAGE_CHAT = encodeURIComponent(
  "Halo, saya mau upgrade ke Pro Kauna Work. Bisa minta info pembayarannya?"
);

export default async function UpgradePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-up");

  const alreadyPro = await isPro();
  if (alreadyPro) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Upgrade ke Pro</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Pilih cara bayar yang paling nyaman buat kamu.
            Aktivasi manual dalam 1×24 jam hari kerja.
          </p>
        </div>

        {/* Pricing summary */}
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden mb-8 max-w-lg mx-auto">
          <div className="p-5 flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-800">Pro Bulanan</p>
              <p className="text-xs text-slate-400 mt-0.5">Aktif 30 hari setelah konfirmasi</p>
            </div>
            <p className="text-xl font-bold text-slate-900">Rp 49.000</p>
          </div>
          <div className="p-5 flex items-center justify-between bg-blue-50/40">
            <div>
              <p className="font-semibold text-slate-800">Pro Tahunan</p>
              <p className="text-xs text-slate-400 mt-0.5">Hemat Rp 120.000 · Aktif 365 hari</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-slate-900">Rp 468.000</p>
              <p className="text-xs text-blue-600 font-medium">Rp 39.000/bln</p>
            </div>
          </div>
        </div>

        {/* Two payment options */}
        <div className="grid sm:grid-cols-2 gap-5">

          {/* Option A — QRIS */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col gap-5">
            <div>
              <span className="inline-block text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                Opsi A
              </span>
              <h2 className="text-lg font-bold text-slate-900">Scan QRIS Langsung</h2>
              <p className="text-sm text-slate-500 mt-1">
                Bayar sendiri via GoPay, OVO, Dana, ShopeePay, atau m-banking. Lalu kirim bukti ke WA kami.
              </p>
            </div>

            {/* QRIS image */}
            <div className="flex justify-center">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 inline-block">
                <Image
                  src="/qris.png"
                  alt="QRIS Kauna Work"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            </div>

            <ol className="text-xs text-slate-500 space-y-1.5">
              <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">1.</span> Scan QR di atas dengan aplikasi apapun</li>
              <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">2.</span> Masukkan nominal: <span className="font-semibold">Rp 49.000</span> atau <span className="font-semibold">Rp 468.000</span></li>
              <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">3.</span> Screenshot bukti pembayaran</li>
              <li className="flex gap-2"><span className="font-bold text-slate-700 shrink-0">4.</span> Kirim screenshot ke WhatsApp kami</li>
            </ol>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE_QRIS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-100"
            >
              <WhatsAppIcon />
              Kirim Bukti via WhatsApp
            </a>
          </div>

          {/* Option B — Chat WA first */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 flex flex-col gap-5">
            <div>
              <span className="inline-block text-xs font-bold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full mb-3 uppercase tracking-wider">
                Opsi B
              </span>
              <h2 className="text-lg font-bold text-slate-900">Chat WhatsApp Dulu</h2>
              <p className="text-sm text-slate-500 mt-1">
                Hubungi kami lewat WhatsApp. Kami akan kirimkan rekening atau QR untuk transfer, dan bantu proses aktivasi.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 space-y-3 flex-1">
              <p className="text-xs font-semibold text-slate-600">Yang akan kamu terima:</p>
              <ul className="text-sm text-slate-600 space-y-2">
                {[
                  "Nomor rekening / QR transfer",
                  "Konfirmasi langsung setelah bayar",
                  "Bantuan jika ada kendala",
                  "Aktivasi Pro dari kami",
                ].map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-slate-400 text-center">
              Biasanya dibalas dalam beberapa menit di jam kerja
            </div>

            <a
              href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE_CHAT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-100"
            >
              <WhatsAppIcon />
              Chat WhatsApp Sekarang
            </a>
          </div>

        </div>

        {/* What you get */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Yang kamu dapat setelah upgrade</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              "Simpan data karyawan unlimited",
              "Auto-fill slip gaji dari data tersimpan",
              "Bulk generate semua karyawan sekaligus",
              "Simpan profil & logo perusahaan",
              "Riwayat slip per karyawan",
              "Dashboard manajemen karyawan",
            ].map(f => (
              <div key={f} className="flex items-start gap-2.5 text-sm text-slate-700">
                <span className="text-emerald-500 mt-0.5 shrink-0 font-bold">✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Ada pertanyaan lain?{" "}
          <a href={`https://wa.me/${WA_NUMBER}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            WhatsApp
          </a>{" "}
          atau{" "}
          <a href="mailto:kaunaverse@gmail.com" className="text-blue-500 hover:underline">
            kaunaverse@gmail.com
          </a>
        </p>

      </main>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}
