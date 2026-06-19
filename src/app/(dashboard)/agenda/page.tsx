import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AgendaCalendar } from '@/components/agenda-calendar'

function mondayOf(d: Date) {
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  const m = new Date(d)
  m.setDate(d.getDate() + diff)
  m.setHours(0, 0, 0, 0)
  return m
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string }>
}) {
  const sp = await searchParams
  const ref = sp.week ? new Date(sp.week + 'T00:00:00') : new Date()
  const monday = mondayOf(ref)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const supabase = await createClient()
  const { data: eventos } = await supabase
    .from('v_agenda')
    .select('id, data, hora_inicio, hora_fim, status, notas, paciente_nome, profissional_nome, tipo_nome, tipo_cor')
    .gte('data', isoDate(monday))
    .lte('data', isoDate(sunday))
    .order('data')
    .order('hora_inicio')

  return (
    <>
      <div className="flex items-center justify-between px-10 pt-7">
        <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Agenda</h1>
        <Link
          href="/agenda/novo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-text text-white rounded-[10px] text-sm font-semibold hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg cursor-pointer"
        >
          + Nova consulta
        </Link>
      </div>
      <div className="px-10 pb-10">
        <AgendaCalendar
          mondayISO={isoDate(monday)}
          eventos={(eventos ?? []).map((e) => ({
            id: e.id ?? '',
            data: e.data ?? '',
            hora_inicio: e.hora_inicio ?? '00:00',
            hora_fim: e.hora_fim ?? '00:00',
            status: e.status ?? 'agendado',
            notas: e.notas ?? null,
            paciente_nome: e.paciente_nome ?? '—',
            profissional_nome: e.profissional_nome ?? '—',
            tipo_nome: e.tipo_nome ?? null,
            tipo_cor: e.tipo_cor ?? null,
          }))}
        />
      </div>
    </>
  )
}
