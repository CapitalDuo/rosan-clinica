'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon } from '@/components/icons'

export type AgendaEvento = {
  id: string
  data: string
  hora_inicio: string
  hora_fim: string
  status: string
  paciente_nome: string
  profissional_nome: string
  tipo_nome: string | null
  tipo_cor: string | null
}

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const HOURS = Array.from({ length: 12 }, (_, i) => 7 + i) // 07h–18h

const statusBorder: Record<string, string> = {
  agendado: '#7aa6d6',
  confirmado: '#4caf50',
  em_atendimento: '#f5a623',
  concluido: '#999',
  cancelado: '#e74c3c',
  faltou: '#e74c3c',
}

function isoToDate(iso: string) {
  return new Date(iso + 'T00:00:00')
}

function shiftDays(iso: string, days: number) {
  const d = isoToDate(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

function formatRange(monday: Date) {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (d: Date) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
  return `${fmt(monday)} – ${fmt(sunday)}, ${sunday.getFullYear()}`
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function parseHour(t: string): { h: number; m: number } {
  const [h, m] = t.split(':').map(Number)
  return { h, m }
}

function eventPosition(ev: AgendaEvento) {
  const start = parseHour(ev.hora_inicio)
  const end = parseHour(ev.hora_fim)
  const startMins = (start.h - HOURS[0]) * 60 + start.m
  const durMins = end.h * 60 + end.m - (start.h * 60 + start.m)
  const ROW_HEIGHT = 64 // px per hour
  return {
    top: (startMins / 60) * ROW_HEIGHT,
    height: Math.max(28, (durMins / 60) * ROW_HEIGHT - 4),
  }
}

function overlaps(a: AgendaEvento, b: AgendaEvento) {
  return a.hora_fim > b.hora_inicio && a.hora_inicio < b.hora_fim
}

// For each event, compute its column index and the total columns of its overlap cluster.
function layoutDay(events: AgendaEvento[]): Map<string, { col: number; total: number }> {
  const sorted = [...events].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
  const placed: { ev: AgendaEvento; col: number }[] = []

  for (const ev of sorted) {
    const usedCols = new Set(placed.filter((p) => overlaps(p.ev, ev)).map((p) => p.col))
    let col = 0
    while (usedCols.has(col)) col++
    placed.push({ ev, col })
  }

  const layout = new Map<string, { col: number; total: number }>()
  for (const p of placed) {
    const cluster = placed.filter((q) => overlaps(q.ev, p.ev))
    const maxCol = Math.max(...cluster.map((q) => q.col))
    layout.set(p.ev.id, { col: p.col, total: maxCol + 1 })
  }
  return layout
}

function hexToBg(hex: string | null, fallback = '#7aa6d6'): string {
  const color = hex ?? fallback
  return `${color}26` // ~15% opacity
}

export function AgendaCalendar({ mondayISO, eventos }: { mondayISO: string; eventos: AgendaEvento[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const monday = isoToDate(mondayISO)
  const today = todayISO()

  function navigate(deltaDays: number) {
    const next = shiftDays(mondayISO, deltaDays)
    const params = new URLSearchParams(searchParams.toString())
    params.set('week', next)
    router.push(`/agenda?${params.toString()}`)
  }

  function goToday() {
    router.push('/agenda')
  }

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })

  const eventosByDay: Record<string, AgendaEvento[]> = {}
  for (const ev of eventos) {
    if (!eventosByDay[ev.data]) eventosByDay[ev.data] = []
    eventosByDay[ev.data].push(ev)
  }

  return (
    <>
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-7)} className="w-9 h-9 rounded-[10px] border border-border bg-card flex items-center justify-center cursor-pointer hover:bg-bg transition-colors">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button onClick={() => navigate(7)} className="w-9 h-9 rounded-[10px] border border-border bg-card flex items-center justify-center cursor-pointer hover:bg-bg transition-colors">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          <button onClick={goToday} className="px-[18px] py-2 rounded-[10px] border border-border bg-card text-[13px] font-semibold cursor-pointer hover:bg-bg transition-colors">
            Hoje
          </button>
          <div className="flex items-center gap-2 ml-3 text-sm font-medium text-text">
            <CalendarIcon className="w-[18px] h-[18px] text-muted" />
            <span>{formatRange(monday)}</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-[14px] overflow-hidden">
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border bg-bg">
          <div />
          {days.map((d, i) => {
            const iso = d.toISOString().slice(0, 10)
            const isToday = iso === today
            return (
              <div key={i} className={`px-3 py-3 text-center border-l border-border ${isToday ? 'bg-card' : ''}`}>
                <div className={`text-xs font-semibold ${isToday ? 'text-text' : 'text-muted'}`}>{WEEKDAYS[i]}</div>
                <div className={`text-sm font-bold mt-0.5 ${isToday ? 'text-text' : 'text-muted'}`}>{String(d.getDate()).padStart(2, '0')}/{String(d.getMonth() + 1).padStart(2, '0')}</div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-[60px_repeat(7,1fr)] relative">
          <div>
            {HOURS.map((h) => (
              <div key={h} className="h-16 border-b border-border text-[11px] text-muted text-center pt-1">
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {days.map((d, dayIdx) => {
            const iso = d.toISOString().slice(0, 10)
            const dayEvents = eventosByDay[iso] ?? []
            const layout = layoutDay(dayEvents)
            return (
              <div key={dayIdx} className="relative border-l border-border">
                {HOURS.map((h) => (
                  <Link
                    key={h}
                    href={`/agenda/novo?data=${iso}`}
                    className="h-16 border-b border-border block hover:bg-bg/50 transition-colors cursor-pointer"
                  />
                ))}
                {dayEvents.map((ev) => {
                  const { top, height } = eventPosition(ev)
                  const bg = hexToBg(ev.tipo_cor)
                  const border = statusBorder[ev.status] ?? '#7aa6d6'
                  const slot = layout.get(ev.id) ?? { col: 0, total: 1 }
                  const widthPct = 100 / slot.total
                  const leftPct = slot.col * widthPct
                  return (
                    <div
                      key={ev.id}
                      className="absolute rounded-[8px] px-2 py-1.5 overflow-hidden text-[11px] cursor-pointer hover:shadow-md transition-shadow"
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                        left: `calc(${leftPct}% + 2px)`,
                        width: `calc(${widthPct}% - 4px)`,
                        background: bg,
                        borderLeft: `3px solid ${border}`,
                      }}
                      title={`${ev.hora_inicio} – ${ev.hora_fim} · ${ev.paciente_nome}\n${ev.profissional_nome}${ev.tipo_nome ? ' · ' + ev.tipo_nome : ''}`}
                    >
                      <div className="font-bold text-[10px] truncate">{ev.hora_inicio.slice(0, 5)} – {ev.hora_fim.slice(0, 5)}</div>
                      <div className="font-semibold text-[11px] truncate">{ev.paciente_nome}</div>
                      {ev.tipo_nome && <div className="text-[10px] opacity-70 truncate">{ev.tipo_nome}</div>}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {eventos.length === 0 && (
        <div className="mt-5 text-center text-sm text-muted">
          Nenhum agendamento nesta semana. Clique num horário pra criar.
        </div>
      )}
    </>
  )
}
