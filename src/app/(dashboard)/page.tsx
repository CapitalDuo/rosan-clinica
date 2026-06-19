import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { KpiCard } from '@/components/kpi-card'
import { CalendarIcon, UsersIcon, DollarIcon, ClockIcon } from '@/components/icons'
import { DonutChart, WeekChart } from '@/components/dashboard-charts'
import { DashboardHero } from '@/components/dashboard-hero'
import { DashboardCalendar } from '@/components/dashboard-calendar'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function formatHora(t: string | null) {
  return (t ?? '').slice(0, 5)
}

function formatBRL(n: number | null) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n ?? 0)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = todayISO()
  const nowTime = new Date().toTimeString().slice(0, 8)
  const firstOfMonth = today.slice(0, 7) + '-01'

  const [{ data: prof }, { data: kpis }, { data: hoje }, { data: candidates }, { data: monthAppts }] = await Promise.all([
    supabase.from('profissionais').select('nome').eq('user_id', user.id).maybeSingle(),
    supabase.from('v_dashboard_kpis').select('*').maybeSingle(),
    supabase
      .from('v_agenda')
      .select('id, hora_inicio, hora_fim, status, paciente_nome, tipo_nome')
      .eq('data', today)
      .order('hora_inicio', { ascending: true }),
    supabase
      .from('v_agenda')
      .select('data, hora_inicio, paciente_nome')
      .gte('data', today)
      .in('status', ['agendado', 'confirmado'])
      .order('data', { ascending: true })
      .order('hora_inicio', { ascending: true })
      .limit(20),
    supabase
      .from('agendamentos')
      .select('status')
      .gte('data', firstOfMonth),
  ])

  const proxima = candidates?.find(
    (c) => (c.data ?? '') > today || ((c.data ?? '') === today && (c.hora_inicio ?? '') >= nowTime),
  ) ?? null

  const statusBuckets = { agendado: 0, em_atendimento: 0, concluido: 0, cancelado: 0 }
  for (const a of monthAppts ?? []) {
    if (a.status === 'agendado' || a.status === 'confirmado') statusBuckets.agendado++
    else if (a.status === 'em_atendimento') statusBuckets.em_atendimento++
    else if (a.status === 'concluido') statusBuckets.concluido++
    else if (a.status === 'cancelado' || a.status === 'faltou') statusBuckets.cancelado++
  }
  const statusChart = [
    { label: 'Agendado', value: statusBuckets.agendado, color: '#6366F1' },
    { label: 'Em andamento', value: statusBuckets.em_atendimento, color: '#FBBF24' },
    { label: 'Finalizado', value: statusBuckets.concluido, color: '#34D399' },
    { label: 'Cancelado / Faltou', value: statusBuckets.cancelado, color: '#F87171' },
  ]

  const userName = prof?.nome ?? user.email ?? 'Doutor(a)'

  return (
    <div className="px-10 pt-7 pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <DashboardHero userName={userName} />

          <div className="grid grid-cols-4 gap-4">
            <KpiCard
              icon={<CalendarIcon className="w-[22px] h-[22px]" />}
              label="Consultas hoje"
              value={String(kpis?.consultas_hoje ?? 0)}
              change={`${kpis?.consultas_mes ?? 0} no mês`}
              color="blue"
            />
            <KpiCard
              icon={<UsersIcon className="w-[22px] h-[22px]" />}
              label="Pacientes ativos"
              value={String(kpis?.pacientes_ativos ?? 0)}
              change={`+${kpis?.pacientes_novos_mes ?? 0} esse mês`}
              color="green"
            />
            <KpiCard
              icon={<DollarIcon className="w-[22px] h-[22px]" />}
              label="Faturamento do mês"
              value={formatBRL(kpis?.receita_mensal ?? 0)}
              change="Receita paga"
              color="orange"
              valueSmall
            />
            <KpiCard
              icon={<ClockIcon className="w-[22px] h-[22px]" />}
              label="Próxima consulta"
              value={proxima ? formatHora(proxima.hora_inicio) : '—'}
              change={proxima?.paciente_nome ?? 'Nada agendado'}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-[14px] p-6">
              <h3 className="font-playfair text-sm font-bold mb-5">Consultas por status</h3>
              <DonutChart data={statusChart} />
            </div>
            <div className="bg-card border border-border rounded-[14px] p-6 relative">
              <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider text-muted bg-bg px-2 py-1 rounded">Demo</div>
              <h3 className="font-playfair text-sm font-bold mb-5">Atendimentos da semana</h3>
              <div className="h-[180px]">
                <WeekChart />
              </div>
            </div>
          </div>
        </div>

        <DashboardCalendar
          events={(hoje ?? []).map((e) => ({
            id: e.id ?? '',
            hora_inicio: e.hora_inicio ?? '00:00',
            hora_fim: e.hora_fim ?? '00:00',
            status: e.status ?? 'agendado',
            paciente_nome: e.paciente_nome ?? '—',
            tipo_nome: e.tipo_nome ?? null,
          }))}
        />
      </div>
    </div>
  )
}
