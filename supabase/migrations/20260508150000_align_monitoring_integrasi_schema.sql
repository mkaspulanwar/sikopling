alter table if exists public.monitoring_integrasi
  add column if not exists jenis_integrasi text;

create index if not exists monitoring_integrasi_jenis_integrasi_idx
  on public.monitoring_integrasi (jenis_integrasi);
