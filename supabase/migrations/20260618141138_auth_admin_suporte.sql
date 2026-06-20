-- 1. Link entre auth.users e profissionais
alter table profissionais
  add column user_id uuid unique references auth.users(id) on delete set null;

create index idx_profissionais_user on profissionais(user_id);

-- 2. Tabela de admins da plataforma
create table plataforma_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  created_at timestamptz not null default now()
);

-- 3. Tickets de suporte
create table suporte_tickets (
  id uuid primary key default uuid_generate_v4(),
  clinica_id uuid not null references clinica(id) on delete cascade,
  criado_por uuid not null references auth.users(id) on delete cascade,
  assunto text not null,
  categoria text not null default 'geral'
    check (categoria in ('geral', 'bug', 'duvida', 'cobranca', 'feature')),
  status text not null default 'aberto'
    check (status in ('aberto', 'em_andamento', 'aguardando_cliente', 'resolvido', 'fechado')),
  prioridade text not null default 'normal'
    check (prioridade in ('baixa', 'normal', 'alta', 'urgente')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_suporte_tickets_clinica on suporte_tickets(clinica_id);
create index idx_suporte_tickets_status on suporte_tickets(status);
create index idx_suporte_tickets_created on suporte_tickets(created_at desc);

create trigger trg_suporte_tickets_updated
  before update on suporte_tickets
  for each row execute function fn_updated_at();

-- 4. Mensagens dentro de um ticket
create table suporte_mensagens (
  id uuid primary key default uuid_generate_v4(),
  ticket_id uuid not null references suporte_tickets(id) on delete cascade,
  autor_id uuid not null references auth.users(id) on delete cascade,
  autor_tipo text not null check (autor_tipo in ('cliente', 'admin')),
  conteudo text not null,
  created_at timestamptz not null default now()
);

create index idx_suporte_mensagens_ticket on suporte_mensagens(ticket_id, created_at);

-- 5. View consolidada para a inbox do admin
create view v_suporte_inbox as
select
  t.id,
  t.assunto,
  t.categoria,
  t.status,
  t.prioridade,
  t.created_at,
  t.updated_at,
  t.clinica_id,
  c.nome as clinica_nome,
  (select count(*) from suporte_mensagens m where m.ticket_id = t.id) as total_mensagens,
  (select m.conteudo from suporte_mensagens m where m.ticket_id = t.id order by m.created_at desc limit 1) as ultima_mensagem,
  (select m.created_at from suporte_mensagens m where m.ticket_id = t.id order by m.created_at desc limit 1) as ultima_mensagem_at
from suporte_tickets t
join clinica c on c.id = t.clinica_id;
