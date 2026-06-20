-- Extensions
create extension if not exists "uuid-ossp";

-- CLÍNICA
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
  dia_semana smallint not null check (dia_semana between 0 and 6),
  aberto boolean not null default true,
  hora_inicio time,
  hora_fim time,
  unique (clinica_id, dia_semana)
);

create table notificacao_config (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinica(id) on delete cascade,
  tipo text not null,
  ativo boolean not null default true,
  unique (clinica_id, tipo)
);

-- WHATSAPP
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

create table whatsapp_eventos (
  id uuid primary key default uuid_generate_v4(),
  instancia_id uuid not null references whatsapp_instancias(id) on delete cascade,
  tipo text not null,
  payload jsonb default '{}',
  created_at timestamptz not null default now()
);

create index idx_whatsapp_eventos_instancia on whatsapp_eventos(instancia_id);
create index idx_whatsapp_eventos_created on whatsapp_eventos(created_at);

-- PROFISSIONAIS
create table profissionais (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid references clinica(id) on delete cascade,
  nome text not null,
  especialidade text,
  registro text,
  email text unique,
  telefone text,
  role text not null default 'profissional',
  avatar_url text,
  iniciais text,
  cor text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- PACIENTES
create table planos (
  id uuid primary key default uuid_generate_v4(),
  nome text not null unique,
  tipo text not null default 'convenio'
);

create table pacientes (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid references clinica(id) on delete cascade,
  codigo serial unique,
  nome text not null,
  cpf text unique,
  data_nascimento date,
  telefone text,
  whatsapp text,
  email text,
  endereco text,
  plano_id uuid references planos(id) on delete set null,
  valor_plano numeric(10,2),
  documento text,
  observacoes text,
  avatar_url text,
  iniciais text,
  cor text,
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
  nome text not null unique,
  cor text
);

create table paciente_tags (
  paciente_id uuid not null references pacientes(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (paciente_id, tag_id)
);

-- AGENDAMENTOS
create table tipos_consulta (
  id uuid primary key default uuid_generate_v4(),
  nome text not null unique,
  cor text not null,
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

-- PRONTUÁRIOS
create table prontuarios (
  id uuid primary key default uuid_generate_v4(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  profissional_id uuid not null references profissionais(id),
  agendamento_id uuid references agendamentos(id) on delete set null,
  descricao text not null,
  diagnostico text,
  prescricao text,
  anexos jsonb default '[]',
  created_at timestamptz not null default now()
);

create index idx_prontuarios_paciente on prontuarios(paciente_id);

-- ATENDIMENTO
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
  whatsapp_message_id text,
  lida boolean not null default false,
  entregue boolean not null default false,
  erro text,
  created_at timestamptz not null default now()
);

create index idx_mensagens_conversa on mensagens(conversa_id);
create index idx_mensagens_created on mensagens(created_at);
create index idx_mensagens_whatsapp_id on mensagens(whatsapp_message_id);

-- FINANCEIRO
create table transacoes (
  id uuid primary key default uuid_generate_v4(),
  agendamento_id uuid references agendamentos(id) on delete set null,
  paciente_id uuid not null references pacientes(id),
  tipo text not null check (tipo in ('receita', 'despesa')),
  valor numeric(10,2) not null,
  descricao text,
  forma_pagamento text,
  status text not null default 'pendente' check (status in ('pendente', 'pago', 'cancelado')),
  data date not null default current_date,
  created_at timestamptz not null default now()
);

create index idx_transacoes_data on transacoes(data);
