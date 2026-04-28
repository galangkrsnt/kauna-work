"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase-server";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FakturItem = {
  id: string;
  user_id: string;
  nama: string;
  satuan: string;
  harga_satuan: number;
  created_at: string;
  updated_at: string;
};

export type FakturHistoryRow = {
  id: string;
  user_id: string;
  nomor_faktur: string;
  tanggal: string;
  nama_klien: string;
  total: number;
  data_faktur: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

async function getUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

// ─── Item Catalog ─────────────────────────────────────────────────────────────

export async function getFakturItems(): Promise<FakturItem[]> {
  const userId = await getUserId();
  const { data, error } = await supabaseAdmin
    .from("faktur_items")
    .select("*")
    .eq("user_id", userId)
    .order("nama", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveFakturItem(input: {
  id?: string;
  nama: string;
  satuan: string;
  harga_satuan: number;
}): Promise<void> {
  const userId = await getUserId();

  if (input.id) {
    const { error } = await supabaseAdmin
      .from("faktur_items")
      .update({ nama: input.nama, satuan: input.satuan, harga_satuan: input.harga_satuan, updated_at: new Date().toISOString() })
      .eq("id", input.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
  } else {
    const { error } = await supabaseAdmin
      .from("faktur_items")
      .insert({ user_id: userId, nama: input.nama, satuan: input.satuan, harga_satuan: input.harga_satuan });
    if (error) throw new Error(error.message);
  }

  revalidatePath("/dashboard/faktur");
  revalidatePath("/faktur");
}

export async function deleteFakturItem(id: string): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabaseAdmin
    .from("faktur_items")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/faktur");
}

// ─── Faktur History ───────────────────────────────────────────────────────────

export async function getFakturHistory(): Promise<FakturHistoryRow[]> {
  const userId = await getUserId();
  const { data, error } = await supabaseAdmin
    .from("faktur_history")
    .select("*")
    .eq("user_id", userId)
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveFakturHistory(input: {
  id?: string;
  nomor_faktur: string;
  tanggal: string;
  nama_klien: string;
  total: number;
  data_faktur: Record<string, unknown>;
}): Promise<string> {
  const userId = await getUserId();

  if (input.id) {
    const { error } = await supabaseAdmin
      .from("faktur_history")
      .update({
        nomor_faktur: input.nomor_faktur,
        tanggal: input.tanggal,
        nama_klien: input.nama_klien,
        total: input.total,
        data_faktur: input.data_faktur,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    revalidatePath("/dashboard/faktur");
    return input.id;
  }

  const { data, error } = await supabaseAdmin
    .from("faktur_history")
    .insert({
      user_id: userId,
      nomor_faktur: input.nomor_faktur,
      tanggal: input.tanggal,
      nama_klien: input.nama_klien,
      total: input.total,
      data_faktur: input.data_faktur,
    })
    .select("id")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Failed to save");
  revalidatePath("/dashboard/faktur");
  return data.id;
}

export async function deleteFakturHistory(id: string): Promise<void> {
  const userId = await getUserId();
  const { error } = await supabaseAdmin
    .from("faktur_history")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  revalidatePath("/dashboard/faktur");
}

export async function getFakturById(id: string): Promise<FakturHistoryRow | null> {
  const userId = await getUserId();
  const { data } = await supabaseAdmin
    .from("faktur_history")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  return data ?? null;
}
