-- View de consulta rápida dos planos por clínica (Supabase SQL editor / admin).
create or replace view v_clinica_planos with (security_invoker = true) as
select
  c.id            as clinica_id,
  c.nome          as clinica,
  c.plano_slug    as plano,
  c.plano_status  as status,
  c.plano_cancelando as cancelando,
  c.plano_periodo_fim as acesso_ate,
  c.email         as email_contato,
  c.stripe_customer_id,
  c.stripe_subscription_id
from clinica c;
