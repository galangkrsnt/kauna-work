-- Add potongan toggle columns to karyawan table
alter table karyawan
  add column if not exists include_bpjs_kes boolean not null default true,
  add column if not exists include_bpjs_jht boolean not null default true,
  add column if not exists include_bpjs_jp  boolean not null default true,
  add column if not exists include_pph21    boolean not null default true;
