import { redirect } from 'next/navigation'
import { createClient, getProfissional } from '@/lib/supabase/server'
import { FinanceiroView, type ContaAPagarRow, type EntradaRow, type SeriePonto } from '@/components/financeiro-view'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/database.types'

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1)
}

function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0)
}

function iso(d: Date) {
  return d.toISOString().slice(0, 10)
}

function startOfWeek(d: Date) {
  const day = d.getDay() // 0=dom..6=sab
  const diff = day === 0 ? -6 : 1 - day // move pra segunda
  const m = new Date(d)
  m.setDate(d.getDate() + diff)
  m.setHours(0, 0, 0, 0)
  return m
}

type Entrada = {
  id: string | null
  data: string | null
  valor: number | null
  status: string | null
  tipo: string | null
  agendamento_id: string | null
  paciente_nome: string | null
  paciente_iniciais: string | null
  paciente_cor: string | null
  tipo_consulta_nome: string | null
  agendamento_hora: string | null
  descricao: string | null
}

const ENTRADA_COLS =
  'id, data, valor, status, tipo, agendamento_id, paciente_nome, paciente_iniciais, paciente_cor, tipo_consulta_nome, agendamento_hora, descricao'

/**
 * Garante que as despesas fixas ativas da clínica tenham uma transação
 * gerada pro mês corrente. Geração lazy (sem cron): roda a cada carregamento
 * da página. upsert com ignoreDuplicates usa o índice único parcial
 * (despesa_fixa_id, mes_referencia) — evita duplicar sob concorrência.
 * ponytail: sem backfill de meses pulados; cobre-se manualmente com
 * lançamento avulso se a clínica ficar sem abrir Financeiro num mês inteiro.
 */
async function gerarDespesasFixasDoMes(
  supabase: SupabaseClient<Database>,
  clinicaId: string,
  monthStart: Date,
) {
  const { data: fixas } = await supabase
    .from('despesas_fixas')
    .select('id, nome, valor, dia_vencimento')
    .eq('clinica_id', clinicaId)
    .eq('ativo', true)

  if (!fixas?.length) return

  const rows = fixas.map((f) => ({
    clinica_id: clinicaId,
    despesa_fixa_id: f.id,
    tipo: 'despesa' as const,
    status: 'pendente' as const,
    valor: f.valor,
    descricao: f.nome,
    data: iso(new Date(monthStart.getFullYear(), monthStart.getMonth(), f.dia_vencimento)),
  }))

  await supabase
    .from('transacoes')
    .upsert(rows, { onConflict: 'despesa_fixa_id,mes_referencia', ignoreDuplicates: true })
}

export default async function FinanceiroPage() {
  const supabase = await createClient()
  const { user, prof } = await getProfissional(supabase)
  if (!user) redirect('/login')

  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(today)

  if (prof?.clinica_id) {
    await gerarDespesasFixasDoMes(supabase, prof.clinica_id, monthStart)
  }

  // Carrega TODAS as entradas do mês (faturamento mensal) +
  // entradas pra montar sparkline (semana atual) + contas a pagar
  const [{ data: entradasMes }, { data: despesasMesData }, { data: recentes }, { data: contasAPagarData }] = await Promise.all([
    supabase
      .from('v_financeiro_entradas')
      .select(ENTRADA_COLS)
      .eq('tipo', 'receita')
      .gte('data', iso(monthStart))
      .lte('data', iso(monthEnd))
      .order('data', { ascending: true }),
    supabase
      .from('v_financeiro_entradas')
      .select(ENTRADA_COLS)
      .eq('tipo', 'despesa')
      .gte('data', iso(monthStart))
      .lte('data', iso(monthEnd))
      .order('data', { ascending: true }),
    supabase
      .from('v_financeiro_entradas')
      .select(ENTRADA_COLS)
      .order('data', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8),
    // Pendências de despesas fixas — inclui atrasadas de meses anteriores
    // (sem filtro de início de período: senão uma pendência esquecida
    // sumiria do radar assim que o mês virasse), exclui vencimentos futuros.
    supabase
      .from('transacoes')
      .select('id, descricao, valor, data')
      .not('despesa_fixa_id', 'is', null)
      .eq('status', 'pendente')
      .lte('data', iso(monthEnd))
      .order('data', { ascending: true }),
  ])

  const entradas: Entrada[] = (entradasMes ?? []) as Entrada[]
  const despesasMes: Entrada[] = (despesasMesData ?? []) as Entrada[]

  // KPIs
  let faturamentoMensal = 0
  let recebidoPago = 0
  let aReceber = 0
  for (const e of entradas) {
    const v = Number(e.valor ?? 0)
    if (e.status === 'cancelado') continue
    faturamentoMensal += v
    if (e.status === 'pago') recebidoPago += v
    else if (e.status === 'pendente') aReceber += v
  }

  let despesasMensal = 0
  for (const d of despesasMes) {
    if (d.status === 'cancelado') continue
    despesasMensal += Number(d.valor ?? 0)
  }

  // Série semanal: agrega valor pago por dia da semana atual (seg-dom)
  const weekStart = startOfWeek(today)
  const weekSerie: SeriePonto[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    return { label: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i], valor: 0, data: iso(d) }
  })
  for (const e of entradas) {
    if (!e.data || e.status === 'cancelado') continue
    const idx = weekSerie.findIndex((s) => s.data === e.data)
    if (idx >= 0) weekSerie[idx].valor += Number(e.valor ?? 0)
  }

  const hojeISO = iso(today)
  const contasAPagar: ContaAPagarRow[] = (contasAPagarData ?? []).map((c) => ({
    id: c.id,
    nome: c.descricao ?? '—',
    valor: Number(c.valor ?? 0),
    data: c.data,
    vencida: c.data < hojeISO,
  }))

  const ultimasEntradas: EntradaRow[] = ((recentes ?? []) as Entrada[]).map((e) => ({
    id: e.id ?? '',
    tipo: (e.tipo as 'receita' | 'despesa') ?? 'receita',
    avulsa: !e.agendamento_id,
    paciente_nome: e.paciente_nome ?? '—',
    paciente_iniciais: e.paciente_iniciais ?? '—',
    paciente_cor: e.paciente_cor ?? '#9a8aa6',
    data: e.data ?? '',
    hora: e.agendamento_hora?.slice(0, 5) ?? null,
    valor: Number(e.valor ?? 0),
    status: (e.status as 'pago' | 'pendente' | 'cancelado') ?? 'pendente',
    descricao: e.tipo_consulta_nome ?? e.descricao ?? '—',
  }))

  return (
    <FinanceiroView
      faturamentoMensal={faturamentoMensal}
      recebidoPago={recebidoPago}
      aReceber={aReceber}
      despesasMensal={despesasMensal}
      weekSerie={weekSerie}
      contasAPagar={contasAPagar}
      ultimasEntradas={ultimasEntradas}
    />
  )
}
