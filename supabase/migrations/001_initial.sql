-- ─── Helper function for RLS ──────────────────────────────────────────────────
-- Must be created FIRST before any policies that reference it

create or replace function requesting_user_id()
returns text
language sql stable
as $$
  select nullif(
    current_setting('request.jwt.claims', true)::jsonb ->> 'sub',
    ''
  )::text;
$$;


-- ─── Perusahaan ──────────────────────────────────────────────────────────────
-- One profile per user (clerk user_id)

create table if not exists perusahaan (
  id         uuid primary key default gen_random_uuid(),
  user_id    text not null unique,
  nama       text not null default '',
  logo_url   text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table perusahaan enable row level security;

create policy "Users can manage own perusahaan"
  on perusahaan for all
  using (user_id = requesting_user_id())
  with check (user_id = requesting_user_id());


-- ─── Karyawan ─────────────────────────────────────────────────────────────────
-- Employees saved by a user

create table if not exists karyawan (
  id           uuid primary key default gen_random_uuid(),
  user_id      text not null,
  nama         text not null,
  jabatan      text not null default '',
  departemen   text not null default '',
  status_ptkp  text not null default 'TK/0',
  punya_npwp   boolean not null default true,
  gaji_pokok   bigint not null default 0,
  tunjangan    jsonb not null default '[]',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table karyawan enable row level security;

create policy "Users can manage own karyawan"
  on karyawan for all
  using (user_id = requesting_user_id())
  with check (user_id = requesting_user_id());

create index karyawan_user_id_idx on karyawan (user_id);


-- ─── Slip History ─────────────────────────────────────────────────────────────
-- Generated slips per employee

create table if not exists slip_history (
  id             uuid primary key default gen_random_uuid(),
  user_id        text not null,
  karyawan_id    uuid not null references karyawan (id) on delete cascade,
  periode_bulan  smallint not null check (periode_bulan between 1 and 12),
  periode_tahun  smallint not null,
  data_slip      jsonb not null default '{}',
  created_at     timestamptz not null default now()
);

alter table slip_history enable row level security;

create policy "Users can manage own slip_history"
  on slip_history for all
  using (user_id = requesting_user_id())
  with check (user_id = requesting_user_id());

create index slip_history_user_id_idx       on slip_history (user_id);
create index slip_history_karyawan_id_idx   on slip_history (karyawan_id);
create index slip_history_periode_idx       on slip_history (periode_tahun, periode_bulan);


