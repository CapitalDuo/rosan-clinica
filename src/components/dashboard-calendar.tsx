import Link from 'next/link'

const STATUS_COLOR: Record<string, string> = {
  agendado: '#6366F1',
  confirmado: '#6366F1',
  em_atendimento: '#FBBF24',
  concluido: '#34D399',
  faltou: '#F87171',
  cancelado: '#F87171',
}

type Event = {
  id: string
  hora_inicio: string
  hora_fim: string
  status: string
  paciente_nome: string
  tipo_nome: string | null
}

function mondayOf(d: Date) {
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const m = new Date(d)
  m.setDate(d.getDate() + diff)
  m.setHours(0, 0, 0, 0)
  return m
}

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export function DashboardCalendar({ events }: { events: Event[] }) {
  const today = new Date()
  const todayISO = today.toISOString().slice(0, 10)
  const monday = mondayOf(today)
  const monthLabel = today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  return (
    <div className="bg-card border border-border rounded-[14px] p-5 sticky top-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-playfair text-base font-bold">Minha agenda</h2>
        <span className="text-[11px] font-semibold text-muted capitalize">{monthLabel}</span>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-5">
        {days.map((d, i) => {
          const iso = d.toISOString().slice(0, 10)
          const isToday = iso === todayISO
          return (
            <Link
              key={i}
              href={`/agenda?view=day&date=${iso}`}
              className={`flex flex-col items-center py-2 rounded-lg transition-colors ${
                isToday ? 'bg-text text-white shadow-sm' : 'hover:bg-bg text-muted'
              }`}
            >
              <span className={`text-[9px] font-bold uppercase tracking-wider ${isToday ? 'text-white/80' : 'text-muted'}`}>{WEEKDAYS[i]}</span>
              <span className={`text-sm font-bold mt-0.5 ${isToday ? 'text-white' : 'text-text'}`}>{d.getDate()}</span>
            </Link>
          )
        })}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-bold uppercase tracking-wider text-muted">Hoje</div>
          <Link href="/agenda?view=day" className="text-[11px] text-muted hover:text-text font-medium">
            ver tudo →
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="text-center py-8 text-xs text-muted">Sem consultas hoje ☕</div>
        ) : (
          <div className="flex flex-col gap-0.5 max-h-[400px] overflow-y-auto -mx-2">
            {events.map((ev) => {
              const color = STATUS_COLOR[ev.status] ?? '#7aa6d6'
              return (
                <Link
                  key={ev.id}
                  href={`/agenda/${ev.id}`}
                  className="flex items-start gap-2.5 py-2 px-2 hover:bg-bg rounded-lg transition-colors"
                >
                  <div className="text-[11px] font-bold w-12 flex-shrink-0 text-muted pt-0.5">{ev.hora_inicio.slice(0, 5)}</div>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{ev.paciente_nome}</div>
                    {ev.tipo_nome && <div className="text-[10px] text-muted truncate">{ev.tipo_nome}</div>}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
