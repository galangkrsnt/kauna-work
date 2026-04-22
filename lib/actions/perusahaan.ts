"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

export type Perusahaan = {
  id: string;
  user_id: string;
  nama: string;
  logo_url: string;
  is_pro: boolean;
  created_at: string;
  updated_at: string;
};

export type PerusahaanInput = {
  nama: string;
  logo_url: string;
};

async function getUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function getPerusahaan(): Promise<Perusahaan | null> {
  const userId = await getUserId();
  const { data, error } = await supabaseAdmin
    .from("perusahaan")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data;
}

export async function isPro(): Promise<boolean> {
  try {
    const p = await getPerusahaan();
    return p?.is_pro ?? false;
  } catch {
    return false;
  }
}

export async function upsertPerusahaan(input: PerusahaanInput): Promise<Perusahaan> {
  const userId = await getUserId();

  const existing = await supabaseAdmin
    .from("perusahaan")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  let data, error;

  if (existing.data) {
    ({ data, error } = await supabaseAdmin
      .from("perusahaan")
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq("user_id", userId)
      .select()
      .single());
  } else {
    ({ data, error } = await supabaseAdmin
      .from("perusahaan")
      .insert({ ...input, user_id: userId })
      .select()
      .single());
  }

  if (error) throw new Error(error.message);
  revalidatePath("/dashboard");
  revalidatePath("/settings");
  revalidatePath("/gaji/slip");
  return data;
}
