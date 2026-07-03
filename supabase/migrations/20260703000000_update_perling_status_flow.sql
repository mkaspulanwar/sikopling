alter table public.monitoring_perling
  alter column status set default 'Submit / Masuk';

alter table public.monitoring_perling
  drop constraint if exists monitoring_perling_status_check;

alter table public.monitoring_perling
  add constraint monitoring_perling_status_check
  check (
    status in (
      'Submit FKA',
      'Uji Administrasi FKA',
      'Perbaikan Uji Adminstrasi FKA',
      'Penjadwalan Rapat FKA',
      'Pasca Sidang FKA',
      'Submit Andal RKL-RPL',
      'Uji Administrasi Andal RKL-RPL',
      'Penjadwalan Rapat Teknis',
      'Penjadwalan Rapat Komisi',
      'Pasca Sidang Andal RKL-RPL',
      'Drafting SK',
      'SK Terbit',
      'Submit / Masuk',
      'Perbaikan Uji Administrasi',
      'Penjadwalan Rapat',
      'Belum Submit Perbaikan',
      'Uji Administrasi',
      'Ditolak',
      'Pasca Sidang',
      'Evaluasi Dokumen',
      'Hold',
      'Dikembalikan',
      'Penilaian KA'
    )
  );
