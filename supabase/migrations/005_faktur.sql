-- ─── Faktur Item Catalog ─────────────────────────────────────────────────────
-- Reusable items/jasa that Pro users can pick from when building a faktur

create table if not exists faktur_items (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  nama         text not null,
  satuan       text not null default 'pcs',
  harga_satuan bigint not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table faktur_items enable row level security;

create policy "Users can manage own faktur_items"
  on faktur_items for all
  using (user_id = requesting_user_id())
  with check (user_id = requesting_user_id());

create index faktur_items_user_id_idx on faktur_items(user_id);


-- ─── Faktur History ───────────────────────────────────────────────────────────
-- Saved invoices for Pro users

create table if not exists faktur_history (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  nomor_faktur text not null default '',
  tanggal      date not null,
  nama_klien   text not null default '',
  total        bigint not null default 0,
  data_faktur  jsonb not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table faktur_history enable row level security;

create policy "Users can manage own faktur_history"
  on faktur_history for all
  using (user_id = requesting_user_id())
  with check (user_id = requesting_user_id());

create index faktur_history_user_id_idx on faktur_history(user_id);
