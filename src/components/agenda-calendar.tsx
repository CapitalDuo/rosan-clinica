'use client'

import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, InfoIcon } from '@/components/icons'

interface CalEvent {
  time: string
  title: string
  sub: string
  category: 'ordenha' | 'manejo' | 'saude' | 'gestao' | 'reuniao' | 'outros'
  startHour: number
  durationHours: number
}

const categoryStyles = {
  ordenha: { bg: 'bg-[#e8f4fc]', border: 'border-l-blue', text: 'text-[#1a5276]', dot: 'bg-blue' },
  manejo: { bg: 'bg-green-light', border: 'border-l-green', text: 'text-[#1b5e20]', dot: 'bg-green' },
  saude: { bg: 'bg-orange-light', border: 'border-l-orange', text: 'text-[#7a4a00]', dot: 'bg-orange' },
  gestao: { bg: 'bg-yellow-light', border: 'border-l-yellow', text: 'text-[#6d5a00]', dot: 'bg-yellow' },
  reuniao: { bg: 'bg-purple-light', border: 'border-l-purple', text: 'text-[#4a1a6b]', dot: 'bg-purple' },
  outros: { bg: 'bg-[#f0f0f0]', border: 'border-l-[#999]', text: 'text-[#444]', dot: 'bg-[#999]' },
}

const weekEvents: Record<number, CalEvent[]> = {
  0: [
    { time: '08:00 – 09:00', title: 'Ordenha', sub: 'Setor A', category: 'ordenha', startHour: 8, durationHours: 1 },
    { time: '10:00 – 11:00', title: 'Manejo do Rebanho', sub: 'Eduardo Silva', category: 'manejo', startHour: 10, durationHours: 1 },
    { time: '14:00 – 15:00', title: 'Check-up Veterinário', sub: 'Dra. Amanda', category: 'saude', startHour: 14, durationHours: 1 },
    { time: '16:00 – 17:00', title: 'Alimentação', sub: 'Consultoria', category: 'outros', startHour: 16, durationHours: 1 },
  ],
  1: [
    { time: '09:00 – 10:00', title: 'Reunião de Equipe', sub: 'Sala de Reunião', category: 'reuniao', startHour: 9, durationHours: 1 },
    { time: '11:00 – 12:00', title: 'Acompanhamento', sub: 'Produção', category: 'gestao', startHour: 11, durationHours: 1 },
    { time: '15:00 – 16:00', title: 'Controle de Qualidade', sub: 'Leite', category: 'gestao', startHour: 15, durationHours: 1 },
  ],
  2: [
    { time: '08:00 – 09:00', title: 'Ordenha', sub: 'Setor B', category: 'ordenha', startHour: 8, durationHours: 1 },
    { time: '10:00 – 11:00', title: 'Vacinação', sub: 'Bezerros', category: 'saude', startHour: 10, durationHours: 1 },
    { time: '14:00 – 15:00', title: 'Visita Técnica', sub: 'Cliente', category: 'gestao', startHour: 14, durationHours: 1 },
    { time: '17:00 – 18:00', title: 'Análise de Dados', sub: 'Produção', category: 'outros', startHour: 17, durationHours: 1 },
  ],
  3: [
    { time: '09:00 – 10:00', title: 'Treinamento', sub: 'Equipe', category: 'reuniao', startHour: 9, durationHours: 1 },
    { time: '11:00 – 12:00', title: 'Gestão de Estoque', sub: 'Insumos', category: 'gestao', startHour: 11, durationHours: 1 },
    { time: '15:00 – 16:00', title: 'Manutenção', sub: 'Equipamentos', category: 'saude', startHour: 15, durationHours: 1 },
  ],
  4: [
    { time: '08:00 – 09:00', title: 'Ordenha', sub: 'Setor A', category: 'ordenha', startHour: 8, durationHours: 1 },
    { time: '10:00 – 11:00', title: 'Avaliação de Saúde', sub: 'Rebanho', category: 'saude', startHour: 10, durationHours: 1 },
    { time: '14:00 – 15:00', title: 'Relatórios', sub: 'Produção', category: 'outros', startHour: 14, durationHours: 1 },
  ],
}

const hours = Array.from({ length: 12 }, (_, i) => 7 + i)
const days = ['Seg 26/05', 'Ter 27/05', 'Qua 28/05', 'Qui 29/05', 'Sex 30/05', 'Sáb 31/05', 'Dom 01/06']

const legendItems = [
  { label: 'Ordenha', color: 'bg-blue' },
  { label: 'Manejo', color: 'bg-green' },
  { label: 'Saúde', color: 'bg-orange' },
  { label: 'Gestão', color: 'bg-yellow' },
  { label: 'Reunião', color: 'bg-purple' },
  { label: 'Outros', color: 'bg-[#999]' },
]

export function AgendaCalendar() {
  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-[10px] border border-border bg-card flex items-center justify-center cursor-pointer hover:bg-bg transition-colors">
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-[10px] border border-border bg-card flex items-center justify-center cursor-pointer hover:bg-bg transition-colors">
            <ChevronRightIcon className="w-4 h-4" />
          </button>
          <button className="px-[18px] py-2 rounded-[10px] border border-border bg-card text-[13px] font-semibold cursor-pointer hover:bg-bg transition-colors">
            Hoje
          </button>
          <div className="flex items-center gap-2 ml-3 text-sm font-medium text-text cursor-pointer">
            <CalendarIcon className="w-[18px] h-[18px] text-muted" />
            <span>26 de maio – 1 de junho, 2026</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-muted">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
        <div className="flex bg-bg rounded-[10px] p-[3px]">
          {['Semana', 'Dia', 'Mês'].map((tab) => (
            <button
              key={tab}
              className={`px-5 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-all ${
                tab === 'Semana' ? 'bg-text text-white' : 'text-muted hover:text-text'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded-[14px] overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
          <div className="p-3.5 border-r border-border" />
          {days.map((day) => (
            <div key={day} className="p-3.5 text-center text-[13px] font-semibold text-muted">
              {day}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid grid-cols-[60px_repeat(7,1fr)]">
          {/* Time column */}
          <div className="border-r border-border">
            {hours.map((h) => (
              <div key={h} className="h-20 flex items-start justify-end px-2.5 text-xs text-muted font-medium -translate-y-2">
                {String(h).padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {Array.from({ length: 7 }, (_, dayIdx) => (
            <div key={dayIdx} className={`relative ${dayIdx < 6 ? 'border-r border-border' : ''}`} style={{ minHeight: `${hours.length * 80}px` }}>
              {/* Hour lines */}
              {hours.map((_, i) => (
                <div key={i} className="absolute left-0 right-0 h-px bg-border" style={{ top: `${i * 80}px` }} />
              ))}

              {/* Events */}
              {(weekEvents[dayIdx] || []).map((ev, i) => {
                const style = categoryStyles[ev.category]
                const top = (ev.startHour - 7) * 80
                const height = ev.durationHours * 80 - 4
                return (
                  <div
                    key={i}
                    className={`absolute left-1 right-1 rounded-lg p-2 px-2.5 text-[11px] cursor-pointer border-l-[3px] transition-transform hover:scale-[1.02] hover:shadow-md hover:z-10 ${style.bg} ${style.border} ${style.text}`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <div className="font-medium mb-0.5 flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                      {ev.time}
                    </div>
                    <div className="font-bold text-xs">{ev.title}</div>
                    <div className="opacity-70 text-[11px] mt-px">{ev.sub}</div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 px-6 py-4 border-t border-border">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-xs text-muted font-medium">
              <div className={`w-2 h-2 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
          <div className="flex-1" />
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <InfoIcon className="w-4 h-4" />
            Dica: arraste para criar ou mover uma consulta
          </div>
        </div>
      </div>
    </>
  )
}
