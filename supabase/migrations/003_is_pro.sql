-- Add is_pro flag to perusahaan
alter table perusahaan
  add column if not exists is_pro boolean not null default false;

-- Add is_pro to karyawan owner lookup (via perusahaan user_id)
-- No changes to karyawan table needed — Pro check is done via perusahaan.is_pro
