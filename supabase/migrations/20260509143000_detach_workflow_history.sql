do $$
begin
  if to_regclass('public.antrian_pengajuan') is not null then
    drop trigger if exists trg_antrian_pengajuan_workflow_history on public.antrian_pengajuan;
  end if;

  if to_regclass('public.monitoring_perling') is not null then
    drop trigger if exists trg_monitoring_perling_workflow_history on public.monitoring_perling;
  end if;

  if to_regclass('public.monitoring_pertek') is not null then
    drop trigger if exists trg_monitoring_pertek_workflow_history on public.monitoring_pertek;
  end if;

  if to_regclass('public.monitoring_integrasi') is not null then
    drop trigger if exists trg_monitoring_integrasi_workflow_history on public.monitoring_integrasi;
  end if;
end;
$$;

drop function if exists public.log_antrian_status_change();
drop function if exists public.log_monitoring_status_change();

drop table if exists public.workflow_history;
