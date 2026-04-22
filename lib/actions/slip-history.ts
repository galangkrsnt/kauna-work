"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";
import type { SlipItem, CalcInput } from "@/lib/slip";
import { calcAll } from "@/lib/slip";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SlipHistoryData = {
  namaKaryawan: string;
  jabatan: string;
  departemen: string;
  namaPerusahaan: string;
  logoUrl: string;
  statusPTKP: string;
  punyaNPWP: boolean;
  gajiPokok: number;
  tunjangan: SlipItem[];
  potonganManual: SlipItem[];
  includeBpjsKes: boolean;
  includeBpjsJHT: boolean;
  includeBpjsJP: boolean;
  includePph21: boolean;
  calc: ReturnType<typeof calcAll>;
};

export type SlipHistory = {
  id: string;
  user_id: string;
  karyawan_id: string;
  periode_bulan: number;
  periode_tahun: number;
  data_slip: SlipHistoryData;
  created_at: string;
};

async function getUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

// ─── Actions ──────────────────────────────────────────────────────────────────

export async function saveSlipHistory(
  karyawanId: string,
  periodeBulan: number,
  periodeTahun: number,
  input: Omit<SlipHistoryData, "calc"> & { calc?: ReturnType<typeof calcAll> }
): Promise<void> {
  const userId = await getUserId();

  const calcInput: CalcInput = {
    gajiPokok: input.gajiPokok,
    tunjangan: input.tunjangan,
    statusPTKP: input.statusPTKP,
    punyaNPWP: input.punyaNPWP,
    includeBpjsKes: input.includeBpjsKes,
    includeBpjsJHT: input.includeBpjsJHT,
    includeBpjsJP: input.includeBpjsJP,
    includePph21: input.includePph21,
    potonganManual: input.potonganManual,
  };

  const data_slip: SlipHistoryData = {
    ...input,
    calc: input.calc ?? calcAll(calcInput),
  };

  // Upsert — one slip per karyawan per periode
  const { error } = await supabaseAdmin
    .from("slip_history")
    .upsert(
      {
        user_id: userId,
        karyawan_id: karyawanId,
        periode_bulan: periodeBulan,
        periode_tahun: periodeTahun,
        data_slip,
      },
      { onConflict: "karyawan_id,periode_bulan,periode_tahun" }
    );

  if (error) throw new Error(error.message);
  revalidatePath(`/karyawan/${karyawanId}`);
}

export async function getSlipHistory(karyawanId: string): Promise<SlipHistory[]> {
  const userId = await getUserId();

  const { data, error } = await supabaseAdmin
    .from("slip_history")
    .select("*")
    .eq("user_id", userId)
    .eq("karyawan_id", karyawanId)
    .order("periode_tahun", { ascending: false })
    .order("periode_bulan", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deleteSlipHistory(id: string): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabaseAdmin
    .from("slip_history")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
}
