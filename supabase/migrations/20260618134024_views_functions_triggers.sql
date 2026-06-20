-- Pacientes view
create view v_pacientes_tabela as
select
  p.id, p.codigo, p.nome, p.cpf, p.data_nascimento, p.telefone, p.whatsapp, p.email,
  p.iniciais, p.cor, p.status, p.cliente_desde, p.observacoes,
  pl.nome as plano_nome, pl.tipo as plano_tipo, p.valor_plano,
  (select max(a.data) from agendamentos a where a.paciente_id = p.id and a.status = 'concluido') as ultima_consulta,
  (select min(a.data) from agendamentos a where a.paciente_id = p.id and a.status in ('agendado', 'confirmado') and a.data >= current_date) as proxima_consulta,
  (select coalesce(sum(t.valor), 0) from transacoes t where t.paciente_id = p.id and t.tipo = 'receita' and t.status = 'pago') as total_gasto,
  (select count(*) from agendamentos a where a.paciente_id = p.id and a.status = 'concluido') as total_atendimentos,
  array(select t.nome from paciente_tags pt join tags t on t.id = pt.tag_id where pt.paciente_id = p.id) as tags
from pacientes p
left join planos pl on pl.id = p.plano_id;

-- Agenda view
create view v_agenda as
select
  a.id, a.data, a.hora_inicio, a.hora_fim, a.status, a.notas, a.lembrete_enviado,
  p.nome as paciente_nome, p.iniciais as paciente_iniciais, p.whatsapp as paciente_whatsapp,
  pr.nome as profissional_nome, tc.nome as tipo_nome, tc.cor as tipo_cor
from agendamentos a
join pacientes p on p.id = a.paciente_id
join profissionais pr on pr.id = a.profissional_id
left join tipos_consulta tc on tc.id = a.tipo_consulta_id;

-- Atendimento view
create view v_atendimento as
select
  c.id as conversa_id, c.canal, c.status as conversa_status, c.ultima_mensagem_at, c.mensagens_nao_lidas,
  p.id as paciente_id, p.nome as paciente_nome, p.iniciais as paciente_iniciais, p.cor as paciente_cor,
  p.telefone as paciente_telefone, p.whatsapp as paciente_whatsapp, p.data_nascimento, p.observacoes,
  p.valor_plano, p.cliente_desde,
  (select coalesce(sum(t.valor), 0) from transacoes t where t.paciente_id = p.id and t.tipo = 'receita' and t.status = 'pago') as total_gasto,
  (select count(*) from agendamentos a where a.paciente_id = p.id and a.status = 'concluido') as total_atendimentos,
  (select min(a.data) from agendamentos a where a.paciente_id = p.id and a.status in ('agendado', 'confirmado') and a.data >= current_date) as proximo_agendamento,
  (select m.conteudo from mensagens m where m.conversa_id = c.id order by m.created_at desc limit 1) as ultima_mensagem_texto,
  wi.status as whatsapp_status
from conversas c
join pacientes p on p.id = c.paciente_id
left join whatsapp_instancias wi on wi.id = c.instancia_id;

-- Dashboard KPIs
create view v_dashboard_kpis as
select
  (select count(*) from pacientes where status = 'ativo') as pacientes_ativos,
  (select count(*) from pacientes) as pacientes_total,
  (select count(*) from pacientes where created_at >= date_trunc('month', current_date)) as pacientes_novos_mes,
  (select coalesce(sum(valor), 0) from transacoes where tipo = 'receita' and status = 'pago' and data >= date_trunc('month', current_date)) as receita_mensal,
  (select count(*) from agendamentos where data = current_date) as consultas_hoje,
  (select count(*) from agendamentos where data >= date_trunc('month', current_date) and status = 'concluido') as consultas_mes;

-- WhatsApp status
create view v_whatsapp_status as
select
  wi.id, wi.clinica_id, wi.nome_instancia, wi.numero, wi.status, wi.ultimo_ping, wi.created_at,
  (wi.status = 'conectado' and wi.ultimo_ping > now() - interval '5 minutes') as online
from whatsapp_instancias wi;

-- updated_at function + triggers
create or replace function fn_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_clinica_updated before update on clinica for each row execute function fn_updated_at();
create trigger trg_profissionais_updated before update on profissionais for each row execute function fn_updated_at();
create trigger trg_pacientes_updated before update on pacientes for each row execute function fn_updated_at();
create trigger trg_agendamentos_updated before update on agendamentos for each row execute function fn_updated_at();
create trigger trg_conversas_updated before update on conversas for each row execute function fn_updated_at();
create trigger trg_whatsapp_updated before update on whatsapp_instancias for each row execute function fn_updated_at();

-- Mensagem inserida trigger
create or replace function fn_mensagem_inserida()
returns trigger as $$
begin
  update conversas
  set
    ultima_mensagem_at = new.created_at,
    mensagens_nao_lidas = case
      when new.remetente_tipo = 'paciente' then mensagens_nao_lidas + 1
      else mensagens_nao_lidas
    end
  where id = new.conversa_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_mensagem_inserida after insert on mensagens for each row execute function fn_mensagem_inserida();
