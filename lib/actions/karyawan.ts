"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

export type Karyawan = {
  id: string;
  user_id: string;
  nama: string;
  jabatan: string;
  departemen: string;
  status_ptkp: string;
  punya_npwp: boolean;
  gaji_pokok: number;
  tunjangan: { id: string; nama: string; jumlah: number }[];
  include_bpjs_kes: boolean;
  include_bpjs_jht: boolean;
  include_bpjs_jp: boolean;
  include_pph21: boolean;
  created_at: string;
  updated_at: string;
};

export type KaryawanInput = Omit<Karyawan, "id" | "user_id" | "created_at" | "updated_at">;

async function getUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function getKaryawan(): Promise<Karyawan[]> {
  const userId = await getUserId();
  const { data, error } = await supabaseAdmin
    .from("karyawan")
    .select("*")
    .eq("user_id", userId)
    .order("nama", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createKaryawan(input: KaryawanInput): Promise<Karyawan> {
  const userId = await getUserId();
  const { data, error } = await supabaseAdmin
    .from("karyawan")
    .insert({ ...input, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/karyawan");
  return data;
}

export async function updateKaryawan(id: string, input: Partial<KaryawanInput>): Promise<Karyawan> {
  const userId = await getUserId();
  const { data, error } = await supabaseAdmin
    .from("karyawan")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/karyawan");
  return data;
}

export async function deleteKaryawan(id: string): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabaseAdmin
    .from("karyawan")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/karyawan");
}
