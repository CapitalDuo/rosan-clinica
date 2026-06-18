-- ============================================================
-- Rosan Clínica Integrativa — Supabase Schema
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- CLÍNICA
-- ============================================================

create table clinica (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  subtitulo text,
  cnpj text,
  telefone text,
  email text,
  endereco text,
  logo_url text,
  onboarding_completo boolean not null default false,
  onboarding_step smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table horarios_funcionamento (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinica(id) on delete cascade,
  dia_semana smallint not null check (dia_semana between 0 and 6), -- 0=Dom, 1=Seg ... 6=Sáb
  aberto boolean not null default true,
  hora_inicio time,
  hora_fim time,
  unique (clinica_id, dia_semana)
);

create table notificacao_config (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinica(id) on delete cascade,
  tipo text not null, -- 'email_novo_agendamento', 'sms_lembrete', 'push_cancelamento', etc.
  ativo boolean not null default true,
  unique (clinica_id, tipo)
);

-- ============================================================
-- WHATSAPP / EVOLUTION API
-- ============================================================

create table whatsapp_instancias (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinica(id) on delete cascade,
  nome_instancia text not null,
  numero text not null,
  status text not null default 'desconectado'
    check (status in ('desconectado', 'aguardando_scan', 'conectado', 'erro')),
  qrcode_base64 text,
  qrcode_expires_at timestamptz,
  webhook_url text,
  api_url text,
  api_key text,
  ultimo_ping timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_whatsapp_clinica on whatsapp_instancias(clinica_id);

-- Log de eventos do webhook (conexão, desconexão, erros)
create table whatsapp_eventos (
  id uuid primary key default uuid_generate_v4(),
  instancia_id uuid not null references whatsapp_instancias(id) on delete cascade,
  tipo text not null, -- 'qrcode_updated', 'connected', 'disconnected', 'message_received', 'message_sent', 'erro'
  payload jsonb default '{}',
  created_at timestamptz not null default now()
);

create index idx_whatsapp_eventos_instancia on whatsapp_eventos(instancia_id);
create index idx_whatsapp_eventos_created on whatsapp_eventos(created_at);

-- ============================================================
-- PROFISSIONAIS
-- ============================================================

create table profissionais (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid references clinica(id) on delete cascade,
  nome text not null,
  especialidade text,
  registro text, -- CRM / CRO / etc.
  email text unique,
  telefone text,
  role text not null default 'profissional', -- 'admin', 'profissional', 'recepcionista'
  avatar_url text,
  iniciais text,
  cor text, -- hex para avatar fallback
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- PACIENTES
-- ============================================================

create table planos (
  id uuid primary key default uuid_generate_v4(),
  nome text not null unique, -- 'Unimed', 'Bradesco', 'Particular'
  tipo text not null default 'convenio' -- 'convenio', 'particular'
);

create table pacientes (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid references clinica(id) on delete cascade,
  codigo serial unique, -- ID numérico visível na tabela (1, 2, 3...)
  nome text not null,
  cpf text unique,
  data_nascimento date,
  telefone text,
  whatsapp text, -- número no formato internacional (5511999999999)
  email text,
  endereco text,
  plano_id uuid references planos(id) on delete set null,
  valor_plano numeric(10,2),
  documento text, -- RG ou outro documento
  observacoes text,
  avatar_url text,
  iniciais text,
  cor text, -- hex para avatar fallback
  status text not null default 'ativo' check (status in ('ativo', 'inativo')),
  cliente_desde date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_pacientes_clinica on pacientes(clinica_id);
create index idx_pacientes_status on pacientes(status);
create index idx_pacientes_whatsapp on pacientes(whatsapp);

create table tags (
  id uuid primary key default uuid_generate_v4(),
  nome text not null unique, -- 'Retorno', 'Crônico', 'Gestante', 'Idoso'
  cor text -- hex opcional
);

create table paciente_tags (
  paciente_id uuid not null references pacientes(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (paciente_id, tag_id)
);

-- ============================================================
-- AGENDAMENTOS
-- ============================================================

create table tipos_consulta (
  id uuid primary key default uuid_generate_v4(),
  nome text not null unique, -- 'Consulta', 'Retorno', 'Limpeza', 'Avaliação', 'Exame'
  cor text not null, -- hex para código de cor no calendário
  duracao_padrao interval default '30 minutes'
);

create table agendamentos (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid not null references profissionais(id) on delete cascade,
  tipo_consulta_id uuid references tipos_consulta(id) on delete set null,
  data date not null,
  hora_inicio time not null,
  hora_fim time not null,
  status text not null default 'agendado'
    check (status in ('agendado', 'confirmado', 'em_atendimento', 'concluido', 'cancelado', 'faltou')),
  notas text,
  valor numeric(10,2),
  lembrete_enviado boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_agendamentos_data on agendamentos(data);
create index idx_agendamentos_paciente on agendamentos(paciente_id);
create index idx_agendamentos_profissional on agendamentos(profissional_id);
create index idx_agendamentos_status on agendamentos(status);

-- ============================================================
-- PRONTUÁRIOS (registros clínicos)
-- ============================================================

create table prontuarios (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid not null references profissionais(id),
  agendamento_id uuid references agendamentos(id) on delete set null,
  descricao text not null,
  diagnostico text,
  prescricao text,
  anexos jsonb default '[]', -- [{url, nome, tipo}]
  created_at timestamptz not null default now()
);

create index idx_prontuarios_paciente on prontuarios(paciente_id);

-- ============================================================
-- ATENDIMENTO (chat / mensagens via WhatsApp)
-- ============================================================

create table conversas (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  instancia_id uuid references whatsapp_instancias(id) on delete set null,
  canal text not null default 'whatsapp' check (canal in ('whatsapp', 'interno')),
  status text not null default 'aberta' check (status in ('aberta', 'fechada', 'arquivada')),
  ultima_mensagem_at timestamptz,
  mensagens_nao_lidas int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_conversas_paciente on conversas(paciente_id);
create index idx_conversas_status on conversas(status);
create index idx_conversas_ultima on conversas(ultima_mensagem_at desc);

create table mensagens (
  id uuid primary key default uuid_generate_v4(),
  conversa_id uuid not null references conversas(id) on delete cascade,
  remetente_tipo text not null check (remetente_tipo in ('profissional', 'paciente', 'sistema')),
  remetente_id uuid,
  conteudo text not null,
  tipo_midia text not null default 'texto'
    check (tipo_midia in ('texto', 'imagem', 'audio', 'documento', 'video', 'localizacao')),
  midia_url text,
  midia_nome text,
  whatsapp_message_id text, -- ID da mensagem no WhatsApp para rastreio
  lida boolean not null default false,
  entregue boolean not null default false,
  erro text, -- mensagem de erro se falhou o envio
  created_at timestamptz not null default now()
);

create index idx_mensagens_conversa on mensagens(conversa_id);
create index idx_mensagens_created on mensagens(created_at);
create index idx_mensagens_whatsapp_id on mensagens(whatsapp_message_id);

-- ============================================================
-- FINANCEIRO (base para KPIs do dashboard)
-- ============================================================

create table transacoes (
  id uuid primary key default uuid_generate_v4(),
  agendamento_id uuid references agendamentos(id) on delete set null,
  paciente_id uuid not null references pacientes(id),
  tipo text not null check (tipo in ('receita', 'despesa')),
  valor numeric(10,2) not null,
  descricao text,
  forma_pagamento text, -- 'pix', 'cartao', 'dinheiro', 'convenio'
  status text not null default 'pendente' check (status in ('pendente', 'pago', 'cancelado')),
  data date not null default current_date,
  created_at timestamptz not null default now()
);

create index idx_transacoes_data on transacoes(data);

-- ============================================================
-- VIEWS ÚTEIS
-- ============================================================

-- Pacientes com dados completos para a tabela /pacientes
create view v_pacientes_tabela as
select
  p.id,
  p.codigo,
  p.nome,
  p.cpf,
  p.data_nascimento,
  p.telefone,
  p.whatsapp,
  p.email,
  p.iniciais,
  p.cor,
  p.status,
  p.cliente_desde,
  p.observacoes,
  pl.nome as plano_nome,
  pl.tipo as plano_tipo,
  p.valor_plano,
  (
    select max(a.data)
    from agendamentos a
    where a.paciente_id = p.id and a.status = 'concluido'
  ) as ultima_consulta,
  (
    select min(a.data)
    from agendamentos a
    where a.paciente_id = p.id and a.status in ('agendado', 'confirmado') and a.data >= current_date
  ) as proxima_consulta,
  (
    select coalesce(sum(t.valor), 0)
    from transacoes t
    where t.paciente_id = p.id and t.tipo = 'receita' and t.status = 'pago'
  ) as total_gasto,
  (
    select count(*)
    from agendamentos a
    where a.paciente_id = p.id and a.status = 'concluido'
  ) as total_atendimentos,
  array(
    select t.nome
    from paciente_tags pt
    join tags t on t.id = pt.tag_id
    where pt.paciente_id = p.id
  ) as tags
from pacientes p
left join planos pl on pl.id = p.plano_id;

-- Agenda semanal com nomes
create view v_agenda as
select
  a.id,
  a.data,
  a.hora_inicio,
  a.hora_fim,
  a.status,
  a.notas,
  a.lembrete_enviado,
  p.nome as paciente_nome,
  p.iniciais as paciente_iniciais,
  p.whatsapp as paciente_whatsapp,
  pr.nome as profissional_nome,
  tc.nome as tipo_nome,
  tc.cor as tipo_cor
from agendamentos a
join pacientes p on p.id = a.paciente_id
join profissionais pr on pr.id = a.profissional_id
left join tipos_consulta tc on tc.id = a.tipo_consulta_id;

-- Conversas com dados do paciente para o painel de Atendimento
create view v_atendimento as
select
  c.id as conversa_id,
  c.canal,
  c.status as conversa_status,
  c.ultima_mensagem_at,
  c.mensagens_nao_lidas,
  p.id as paciente_id,
  p.nome as paciente_nome,
  p.iniciais as paciente_iniciais,
  p.cor as paciente_cor,
  p.telefone as paciente_telefone,
  p.whatsapp as paciente_whatsapp,
  p.data_nascimento,
  p.observacoes,
  p.valor_plano,
  p.cliente_desde,
  (
    select coalesce(sum(t.valor), 0)
    from transacoes t
    where t.paciente_id = p.id and t.tipo = 'receita' and t.status = 'pago'
  ) as total_gasto,
  (
    select count(*)
    from agendamentos a
    where a.paciente_id = p.id and a.status = 'concluido'
  ) as total_atendimentos,
  (
    select min(a.data)
    from agendamentos a
    where a.paciente_id = p.id and a.status in ('agendado', 'confirmado') and a.data >= current_date
  ) as proximo_agendamento,
  (
    select m.conteudo
    from mensagens m
    where m.conversa_id = c.id
    order by m.created_at desc
    limit 1
  ) as ultima_mensagem_texto,
  wi.status as whatsapp_status
from conversas c
join pacientes p on p.id = c.paciente_id
left join whatsapp_instancias wi on wi.id = c.instancia_id;

-- KPIs do dashboard
create view v_dashboard_kpis as
select
  (select count(*) from pacientes where status = 'ativo') as pacientes_ativos,
  (select count(*) from pacientes) as pacientes_total,
  (
    select count(*)
    from pacientes
    where created_at >= date_trunc('month', current_date)
  ) as pacientes_novos_mes,
  (
    select coalesce(sum(valor), 0)
    from transacoes
    where tipo = 'receita' and status = 'pago'
      and data >= date_trunc('month', current_date)
  ) as receita_mensal,
  (
    select count(*)
    from agendamentos
    where data = current_date
  ) as consultas_hoje,
  (
    select count(*)
    from agendamentos
    where data >= date_trunc('month', current_date) and status = 'concluido'
  ) as consultas_mes;

-- Status do WhatsApp para a clínica
create view v_whatsapp_status as
select
  wi.id,
  wi.clinica_id,
  wi.nome_instancia,
  wi.numero,
  wi.status,
  wi.ultimo_ping,
  wi.created_at,
  (wi.status = 'conectado' and wi.ultimo_ping > now() - interval '5 minutes') as online
from whatsapp_instancias wi;

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Atualizar updated_at automaticamente
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

-- Atualizar ultima_mensagem_at e contagem na conversa ao inserir mensagem
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

-- ============================================================
-- SEED DATA (dados de exemplo)
-- ============================================================

-- Clínica
insert into clinica (nome, subtitulo, cnpj, telefone, email, endereco, onboarding_completo) values
  ('Rosan', 'Clínica Integrativa', '12.345.678/0001-99', '(11) 3456-7890', 'contato@rosanclinica.com.br', 'Rua das Flores, 123 - São Paulo/SP', true);

-- Planos
insert into planos (nome, tipo) values
  ('Unimed', 'convenio'),
  ('Bradesco', 'convenio'),
  ('SulAmérica', 'convenio'),
  ('Amil', 'convenio'),
  ('Particular', 'particular');

-- Tags
insert into tags (nome) values
  ('Retorno'),
  ('Crônico'),
  ('Gestante'),
  ('Idoso'),
  ('Pediátrico'),
  ('Urgência');

-- Tipos de consulta
insert into tipos_consulta (nome, cor, duracao_padrao) values
  ('Consulta', '#b8a88a', '30 minutes'),
  ('Retorno', '#8ab89b', '20 minutes'),
  ('Limpeza', '#a88ab8', '45 minutes'),
  ('Avaliação', '#8a8ab8', '40 minutes'),
  ('Exame', '#b88a8a', '30 minutes');

-- Profissionais
insert into profissionais (nome, especialidade, registro, email, role, iniciais, cor) values
  ('Dr. Rodrigo Alves', 'Clínico Geral', 'CRM 123456', 'rodrigo@rosanclinica.com.br', 'admin', 'DR', '#b8a88a'),
  ('Dra. Camila Santos', 'Dermatologia', 'CRM 654321', 'camila@rosanclinica.com.br', 'profissional', 'CS', '#8ab89b'),
  ('Dr. Felipe Mendes', 'Ortopedia', 'CRM 789012', 'felipe@rosanclinica.com.br', 'profissional', 'FM', '#a88ab8');
