-- Permite lançar despesas/receitas avulsas (sem paciente nem agendamento):
-- aluguel, salários, materiais, etc. Adiciona clinica_id direto na tabela
-- (em vez de depender só de paciente_id, que passa a ser opcional).

alter table transacoes add column clinica_id uuid references clinica(id);

update transacoes t
set clinica_id = p.clinica_id
from pacientes p
where t.paciente_id = p.id and t.clinica_id is null;

alter table transacoes alter column clinica_id set not null;
alter table transacoes alter column paciente_id drop not null;

drop policy if exists "transacoes_all" on transacoes;
create policy "transacoes_all" on transacoes for all
  using (private.is_platform_admin() or clinica_id = private.auth_clinica_id())
  with check (private.is_platform_admin() or clinica_id = private.auth_clinica_id());

drop view if exists v_financeiro_entradas;
create view v_financeiro_entradas with (security_invoker = true) as
select
  t.id,
  t.agendamento_id,
  t.paciente_id,
  t.tipo,
  t.valor,
  t.status,
  t.data,
  t.descricao,
  t.forma_pagamento,
  t.created_at,
  p.nome as paciente_nome,
  p.iniciais as paciente_iniciais,
  p.cor as paciente_cor,
  t.clinica_id,
  a.hora_inicio as agendamento_hora,
  tc.nome as tipo_consulta_nome
from transacoes t
left join pacientes p on p.id = t.paciente_id
left join agendamentos a on a.id = t.agendamento_id
left join tipos_consulta tc on tc.id = a.tipo_consulta_id;
