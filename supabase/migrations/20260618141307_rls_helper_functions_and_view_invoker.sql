-- Helper: retorna clinica_id do usuário logado (via profissionais)
create or replace function auth_clinica_id()
returns uuid
language sql
security definer
set search_path = public, auth
stable
as $$
  select clinica_id from profissionais where user_id = auth.uid() limit 1;
$$;

-- Helper: usuário logado é admin da plataforma?
create or replace function is_platform_admin()
returns boolean
language sql
security definer
set search_path = public, auth
stable
as $$
  select exists(select 1 from plataforma_admins where user_id = auth.uid());
$$;

-- Views existentes precisam ser security_invoker (Supabase best practice)
-- Recriar com security_invoker = true para respeitar RLS do consumidor
drop view if exists v_pacientes_tabela;
drop view if exists v_agenda;
drop view if exists v_atendimento;
drop view if exists v_dashboard_kpis;
drop view if exists v_whatsapp_status;
drop view if exists v_suporte_inbox;

create view v_pacientes_tabela with (security_invoker = true) as
select
  p.id, p.codigo, p.nome, p.cpf, p.data_nascimento, p.telefone, p.whatsapp, p.email,
  p.iniciais, p.cor, p.status, p.cliente_desde, p.observacoes, p.clinica_id,
  pl.nome as plano_nome, pl.tipo as plano_tipo, p.valor_plano,
  (select max(a.data) from agendamentos a where a.paciente_id = p.id and a.status = 'concluido') as ultima_consulta,
  (select min(a.data) from agendamentos a where a.paciente_id = p.id and a.status in ('agendado', 'confirmado') and a.data >= current_date) as proxima_consulta,
  (select coalesce(sum(t.valor), 0) from transacoes t where t.paciente_id = p.id and t.tipo = 'receita' and t.status = 'pago') as total_gasto,
  (select count(*) from agendamentos a where a.paciente_id = p.id and a.status = 'concluido') as total_atendimentos,
  array(select t.nome from paciente_tags pt join tags t on t.id = pt.tag_id where pt.paciente_id = p.id) as tags
from pacientes p
left join planos pl on pl.id = p.plano_id;

create view v_agenda with (security_invoker = true) as
select
  a.id, a.data, a.hora_inicio, a.hora_fim, a.status, a.notas, a.lembrete_enviado,
  p.clinica_id,
  p.nome as paciente_nome, p.iniciais as paciente_iniciais, p.whatsapp as paciente_whatsapp,
  pr.nome as profissional_nome, tc.nome as tipo_nome, tc.cor as tipo_cor
from agendamentos a
join pacientes p on p.id = a.paciente_id
join profissionais pr on pr.id = a.profissional_id
left join tipos_consulta tc on tc.id = a.tipo_consulta_id;

create view v_atendimento with (security_invoker = true) as
select
  c.id as conversa_id, c.canal, c.status as conversa_status, c.ultima_mensagem_at, c.mensagens_nao_lidas,
  p.id as paciente_id, p.nome as paciente_nome, p.iniciais as paciente_iniciais, p.cor as paciente_cor,
  p.telefone as paciente_telefone, p.whatsapp as paciente_whatsapp, p.data_nascimento, p.observacoes,
  p.valor_plano, p.cliente_desde, p.clinica_id,
  (select coalesce(sum(t.valor), 0) from transacoes t where t.paciente_id = p.id and t.tipo = 'receita' and t.status = 'pago') as total_gasto,
  (select count(*) from agendamentos a where a.paciente_id = p.id and a.status = 'concluido') as total_atendimentos,
  (select min(a.data) from agendamentos a where a.paciente_id = p.id and a.status in ('agendado', 'confirmado') and a.data >= current_date) as proximo_agendamento,
  (select m.conteudo from mensagens m where m.conversa_id = c.id order by m.created_at desc limit 1) as ultima_mensagem_texto,
  wi.status as whatsapp_status
from conversas c
join pacientes p on p.id = c.paciente_id
left join whatsapp_instancias wi on wi.id = c.instancia_id;

create view v_dashboard_kpis with (security_invoker = true) as
select
  auth_clinica_id() as clinica_id,
  (select count(*) from pacientes where status = 'ativo' and clinica_id = auth_clinica_id()) as pacientes_ativos,
  (select count(*) from pacientes where clinica_id = auth_clinica_id()) as pacientes_total,
  (select count(*) from pacientes where created_at >= date_trunc('month', current_date) and clinica_id = auth_clinica_id()) as pacientes_novos_mes,
  (select coalesce(sum(t.valor), 0) from transacoes t join pacientes p on p.id = t.paciente_id where t.tipo = 'receita' and t.status = 'pago' and t.data >= date_trunc('month', current_date) and p.clinica_id = auth_clinica_id()) as receita_mensal,
  (select count(*) from agendamentos a join pacientes p on p.id = a.paciente_id where a.data = current_date and p.clinica_id = auth_clinica_id()) as consultas_hoje,
  (select count(*) from agendamentos a join pacientes p on p.id = a.paciente_id where a.data >= date_trunc('month', current_date) and a.status = 'concluido' and p.clinica_id = auth_clinica_id()) as consultas_mes;

create view v_whatsapp_status with (security_invoker = true) as
select
  wi.id, wi.clinica_id, wi.nome_instancia, wi.numero, wi.status, wi.ultimo_ping, wi.created_at,
  (wi.status = 'conectado' and wi.ultimo_ping > now() - interval '5 minutes') as online
from whatsapp_instancias wi;

create view v_suporte_inbox with (security_invoker = true) as
select
  t.id, t.assunto, t.categoria, t.status, t.prioridade, t.created_at, t.updated_at,
  t.clinica_id, c.nome as clinica_nome, t.criado_por,
  (select count(*) from suporte_mensagens m where m.ticket_id = t.id) as total_mensagens,
  (select m.conteudo from suporte_mensagens m where m.ticket_id = t.id order by m.created_at desc limit 1) as ultima_mensagem,
  (select m.created_at from suporte_mensagens m where m.ticket_id = t.id order by m.created_at desc limit 1) as ultima_mensagem_at
from suporte_tickets t
join clinica c on c.id = t.clinica_id;
