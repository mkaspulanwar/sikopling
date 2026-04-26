alter table public.antrian_pengajuan
  alter column no_registrasi drop not null;

alter table public.antrian_pengajuan
  drop constraint if exists antrian_pengajuan_no_registrasi_key;
