import { AgendaCalendar } from '@/components/agenda-calendar'

export default function AgendaPage() {
  return (
    <>
      <div className="flex items-center justify-between px-10 pt-7">
        <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Agenda</h1>
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-text text-white rounded-[10px] text-sm font-semibold hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg cursor-pointer">
          + Nova consulta
        </button>
      </div>
      <div className="px-10 pb-10">
        <AgendaCalendar />
      </div>
    </>
  )
}
