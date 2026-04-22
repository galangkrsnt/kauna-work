-- One slip per karyawan per periode (upsert support)
alter table slip_history
  add constraint slip_history_karyawan_periode_unique
  unique (karyawan_id, periode_bulan, periode_tahun);
