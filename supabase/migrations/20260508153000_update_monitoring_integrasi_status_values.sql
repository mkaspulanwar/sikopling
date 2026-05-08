update public.monitoring_integrasi
set status = case status
  when 'Uji admin' then 'Uji Admin'
  when 'SK/Rekomendasi' then 'Drafting SK/Rekom'
  when 'Evaluasi Dokumen' then 'Uji Substansi'
  when 'Verifikasi Integrasi' then 'Uji Substansi'
  when 'Dikembalikan' then 'Lainnya'
  when 'Selesai' then 'SK/Rekom Terbit'
  else status
end
where status in (
  'Uji admin',
  'SK/Rekomendasi',
  'Evaluasi Dokumen',
  'Verifikasi Integrasi',
  'Dikembalikan',
  'Selesai'
);

update public.workflow_history
set
  new_status = case new_status
    when 'Uji admin' then 'Uji Admin'
    when 'SK/Rekomendasi' then 'Drafting SK/Rekom'
    when 'Evaluasi Dokumen' then 'Uji Substansi'
    when 'Verifikasi Integrasi' then 'Uji Substansi'
    when 'Dikembalikan' then 'Lainnya'
    when 'Selesai' then 'SK/Rekom Terbit'
    else new_status
  end,
  old_status = case old_status
    when 'Uji admin' then 'Uji Admin'
    when 'SK/Rekomendasi' then 'Drafting SK/Rekom'
    when 'Evaluasi Dokumen' then 'Uji Substansi'
    when 'Verifikasi Integrasi' then 'Uji Substansi'
    when 'Dikembalikan' then 'Lainnya'
    when 'Selesai' then 'SK/Rekom Terbit'
    else old_status
  end
where layanan = 'integrasi'
  and (
    new_status in ('Uji admin', 'SK/Rekomendasi', 'Evaluasi Dokumen', 'Verifikasi Integrasi', 'Dikembalikan', 'Selesai')
    or old_status in ('Uji admin', 'SK/Rekomendasi', 'Evaluasi Dokumen', 'Verifikasi Integrasi', 'Dikembalikan', 'Selesai')
  );

alter table if exists public.monitoring_integrasi
  drop constraint if exists monitoring_integrasi_status_check;

alter table if exists public.monitoring_integrasi
  add constraint monitoring_integrasi_status_check
  check (
    status in (
      'Submit',
      'Uji Admin',
      'Uji Substansi',
      'Drafting SK/Rekom',
      'SK/Rekom Terbit',
      'Ditolak',
      'Lainnya'
    )
  );

alter table if exists public.workflow_history
  drop constraint if exists workflow_history_new_status_check;

alter table if exists public.workflow_history
  add constraint workflow_history_new_status_check
  check (
    new_status in (
      'Submit / Masuk',
      'Perbaikan Uji Administrasi',
      'Penjadwalan Rapat',
      'Drafting SK',
      'SK Terbit',
      'Belum Submit Perbaikan',
      'Uji Administrasi',
      'Ditolak',
      'Pasca Sidang',
      'Evaluasi Dokumen',
      'Hold',
      'Dikembalikan',
      'Penilaian KA',
      'Submit',
      'Uji Admin',
      'Uji Substansi',
      'Drafting SK/Rekom',
      'SK/Rekom Terbit',
      'Lainnya'
    )
  );

alter table if exists public.workflow_history
  drop constraint if exists workflow_history_old_status_check;

alter table if exists public.workflow_history
  add constraint workflow_history_old_status_check
  check (
    old_status is null or old_status in (
      'Submit / Masuk',
      'Perbaikan Uji Administrasi',
      'Penjadwalan Rapat',
      'Drafting SK',
      'SK Terbit',
      'Belum Submit Perbaikan',
      'Uji Administrasi',
      'Ditolak',
      'Pasca Sidang',
      'Evaluasi Dokumen',
      'Hold',
      'Dikembalikan',
      'Penilaian KA',
      'Submit',
      'Uji Admin',
      'Uji Substansi',
      'Drafting SK/Rekom',
      'SK/Rekom Terbit',
      'Lainnya'
    )
  );
