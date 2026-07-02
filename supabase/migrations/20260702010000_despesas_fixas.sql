-- "Contas a pagar": despesas fixas mensais recorrentes (aluguel, salários,
-- assinaturas etc). Substitui a necessidade de recriar manualmente um
-- lançamento avulso todo mês. Geração das transações mensais é feita
-- lazy pelo app (financeiro/page.tsx), não por cron.

create table public.despesas_fixas (
  id uuid not null default uuid_generate_v4() primary key,
  clinica_id uuid not null references public.clinica(id) on delete cascade,
  nome text not null,
  categoria text not null default 'outros'
    check (categoria in ('aluguel','salarios','utilidades','material','marketing','impostos','assinaturas','outros')),
  valor numeric not null check (valor > 0),
  -- 1-28 elimina a classe de bug "dia 31 não existe em fevereiro" sem
  -- precisar de lógica de clamping — make_date/new Date sempre funciona.
  dia_vencimento smallint not null check (dia_vencimento between 1 and 28),
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_despesas_fixas_clinica on public.despesas_fixas(clinica_id);
create index idx_despesas_fixas_ativas on public.despesas_fixas(clinica_id) where ativo;

alter table public.despesas_fixas enable row level security;
create policy "despesas_fixas_all" on public.despesas_fixas for all
  using (private.is_platform_admin() or clinica_id = private.auth_clinica_id())
  with check (private.is_platform_admin() or clinica_id = private.auth_clinica_id());

create trigger trg_despesas_fixas_updated
  before update on public.despesas_fixas
  for each row execute function fn_updated_at();

-- ON DELETE SET NULL (não CASCADE): excluir a definição não pode apagar
-- o histórico financeiro real já gerado — desacopla o lançamento passado
-- da definição que o originou.
alter table public.transacoes
  add column despesa_fixa_id uuid references public.despesas_fixas(id) on delete set null;

-- Coluna gerada: o upsert do PostgREST não aceita expressão arbitrária em
-- onConflict, só nomes de coluna reais que casem com uma constraint.
-- Cast explícito p/ timestamp (não timestamptz) usa o overload IMMUTABLE
-- de date_trunc, exigido em colunas geradas.
alter table public.transacoes
  add column mes_referencia date generated always as (date_trunc('month', data::timestamp)::date) stored;

-- Garante no banco que nunca existem 2 transações da mesma despesa fixa
-- no mesmo mês, mesmo sob concorrência (duas abas abrindo /financeiro).
-- Não-parcial (sem WHERE): o onConflict do PostgREST não consegue casar
-- com um índice único parcial (não há como passar a cláusula WHERE) — e
-- não precisa ser parcial mesmo, já que NULL nunca colide com outro NULL
-- numa constraint UNIQUE padrão, então transações normais (despesa_fixa_id
-- null) continuam ilimitadas.
create unique index idx_transacoes_despesa_fixa_mes
  on public.transacoes (despesa_fixa_id, mes_referencia);
