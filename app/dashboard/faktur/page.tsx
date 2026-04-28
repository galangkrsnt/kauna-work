import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { isPro } from "@/lib/actions/perusahaan";
import { getFakturHistory, getFakturItems } from "@/lib/actions/faktur";
import type { Metadata } from "next";
import FakturDashboardClient from "./FakturDashboardClient";

export const metadata: Metadata = {
  title: "Faktur — Dashboard Kauna Work",
};

export default async function DashboardFakturPage() {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const pro = await isPro();
  if (!pro) redirect("/upgrade");

  const [history, items] = await Promise.all([getFakturHistory(), getFakturItems()]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center shrink-0">
              <span className="font-bold text-emerald-600 text-base tracking-tight">Kauna</span>
              <span className="font-bold text-blue-600 text-base tracking-tight">Work</span>
            </Link>
            <div className="h-5 w-px bg-slate-200" />
            <h1 className="text-base font-bold text-slate-900">Faktur</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-sm text-slate-500 border border-slate-200 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              ← Dashboard
            </Link>
            <Link href="/faktur" className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              + Buat Faktur
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <FakturDashboardClient history={history} items={items} />
      </div>
    </div>
  );
}
