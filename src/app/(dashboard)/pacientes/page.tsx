import { PacientesTable } from '@/components/pacientes-table'

export default function PacientesPage() {
  return (
    <>
      <div className="flex items-center justify-between px-10 pt-7">
        <div>
          <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Pacientes</h1>
          <p className="text-sm text-muted mt-0.5">2.450 cadastrados</p>
        </div>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] border border-border bg-card text-[13px] font-semibold hover:bg-bg transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Importar
          </button>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] border border-border bg-card text-[13px] font-semibold hover:bg-bg transition-colors cursor-pointer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Exportar
          </button>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-text text-white rounded-[10px] text-sm font-semibold hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg cursor-pointer">
            + Novo Paciente
          </button>
        </div>
      </div>
      <PacientesTable />
    </>
  )
}
