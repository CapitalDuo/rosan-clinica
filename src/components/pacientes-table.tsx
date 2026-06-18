'use client'

import { useState } from 'react'
import { SearchIcon } from '@/components/icons'

interface Patient {
  id: number
  name: string
  initials: string
  color: string
  tags: string[]
  cpf: string
  nasc: string
  ultimaConsulta: string
  proximaConsulta: string
  plano: string
  planoColor: string
  status: 'Ativo' | 'Inativo'
}

const patients: Patient[] = [
  { id: 1, name: 'Ana Silva', initials: 'AS', color: 'bg-[#b8a88a]', tags: ['Retorno', 'Crônico'], cpf: '123.456.789-01', nasc: '15/05/1990', ultimaConsulta: '20/10/2023', proximaConsulta: '12/11/2023', plano: 'Unimed', planoColor: 'bg-green-light text-green border border-green/20', status: 'Ativo' },
  { id: 2, name: 'Carlos Oliveira', initials: 'CO', color: 'bg-[#8ab89b]', tags: ['Retorno', 'Crônico'], cpf: '987.654.321-00', nasc: '02/09/1985', ultimaConsulta: '05/10/2023', proximaConsulta: '12/11/2023', plano: 'Particular', planoColor: 'bg-bg text-muted border border-border', status: 'Inativo' },
  { id: 3, name: 'Clara Oliveira', initials: 'CO', color: 'bg-[#a88ab8]', tags: ['Retorno', 'Crônico'], cpf: '123.456.789-01', nasc: '15/05/1990', ultimaConsulta: '20/10/2023', proximaConsulta: '12/11/2023', plano: 'Unimed', planoColor: 'bg-green-light text-green border border-green/20', status: 'Ativo' },
  { id: 4, name: 'Carlos Oliveira', initials: 'CO', color: 'bg-[#b88a8a]', tags: ['Retorno'], cpf: '987.654.321-00', nasc: '17/09/1985', ultimaConsulta: '05/10/2023', proximaConsulta: '', plano: 'Particular', planoColor: 'bg-bg text-muted border border-border', status: 'Inativo' },
  { id: 5, name: 'Mariana Costa', initials: 'MC', color: 'bg-[#8ab8b8]', tags: ['Crônico'], cpf: '987.654.321-00', nasc: '10/05/1990', ultimaConsulta: '20/10/2023', proximaConsulta: '12/11/2023', plano: 'Particular', planoColor: 'bg-bg text-muted border border-border', status: 'Ativo' },
  { id: 6, name: 'Fernanda Lima', initials: 'FL', color: 'bg-[#b8b88a]', tags: ['Retorno', 'Crônico'], cpf: '987.654.321-00', nasc: '02/09/1985', ultimaConsulta: '05/10/2023', proximaConsulta: '', plano: 'Particular', planoColor: 'bg-bg text-muted border border-border', status: 'Inativo' },
  { id: 7, name: 'Bianca Torres', initials: 'BT', color: 'bg-[#a88a8a]', tags: ['Retorno', 'Crônico'], cpf: '987.654.321-00', nasc: '15/09/1985', ultimaConsulta: '05/10/2023', proximaConsulta: '', plano: 'Particular', planoColor: 'bg-bg text-muted border border-border', status: 'Inativo' },
  { id: 8, name: 'Juliana Rocha', initials: 'JR', color: 'bg-[#8a8ab8]', tags: ['Retorno'], cpf: '456.789.123-00', nasc: '22/03/1992', ultimaConsulta: '18/10/2023', proximaConsulta: '15/11/2023', plano: 'Bradesco', planoColor: 'bg-red-light text-red border border-red/20', status: 'Ativo' },
]

const statusFilters = ['Todos', 'Ativo', 'Inativo'] as const
const planoFilters = ['Todos', 'Unimed', 'Bradesco', 'Particular'] as const

const updates = [
  { name: 'Ana Silva', text: 'Consulta realizada · 20/10', dot: 'bg-green' },
  { name: 'Clara Oliveira', text: 'Cadastro atualizado · 19/10', dot: 'bg-blue' },
  { name: 'Carlos Oliveira', text: 'Status: Inativo · 18/10', dot: 'bg-orange' },
  { name: 'Mariana Costa', text: 'Novo cadastro · 17/10', dot: 'bg-purple' },
]

export function PacientesTable() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('Todos')
  const [planoFilter, setPlanoFilter] = useState<string>('Todos')

  const filtered = patients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.cpf.includes(search)
    const matchStatus = statusFilter === 'Todos' || p.status === statusFilter
    const matchPlano = planoFilter === 'Todos' || p.plano === planoFilter
    return matchSearch && matchStatus && matchPlano
  })

  return (
    <div className="px-10 pt-5 pb-10">
      {/* Search + Filters row */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Pesquisar por nome, CPF ou contato..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-[10px] border border-border text-[13px] bg-card outline-none focus:border-text transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-medium">Status</span>
          <div className="flex gap-1">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  statusFilter === s
                    ? 'bg-text text-white'
                    : 'bg-card text-muted hover:bg-border border border-border'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-medium">Plano</span>
          <select
            value={planoFilter}
            onChange={(e) => setPlanoFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-card border border-border outline-none cursor-pointer"
          >
            {planoFilters.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-[14px] overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-b border-border bg-bg/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted w-[50px]">ID</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted w-[22%]">Nome Completo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted w-[14%]">CPF / Nasc.</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted w-[10%]">Última</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted w-[10%]">Próxima</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted w-[9%]">Plano</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted w-[8%]">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-bg/30 transition-colors">
                <td className="px-4 py-3.5 text-sm text-muted">{p.id}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 ${p.color}`}>
                      {p.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate">{p.name}</div>
                      <div className="flex gap-1 mt-0.5">
                        {p.tags.map((tag) => (
                          <span key={tag} className="text-[9px] font-semibold px-1.5 py-px rounded bg-bg text-muted border border-border">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="text-[13px]">{p.cpf}</div>
                  <div className="text-[11px] text-muted">{p.nasc}</div>
                </td>
                <td className="px-4 py-3.5 text-[13px]">{p.ultimaConsulta}</td>
                <td className="px-4 py-3.5 text-[13px]">{p.proximaConsulta || <span className="text-muted">—</span>}</td>
                <td className="px-4 py-3.5">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${p.planoColor}`}>
                    {p.plano}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${
                    p.status === 'Ativo'
                      ? 'bg-green-light text-green'
                      : 'bg-orange-light text-orange'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <button className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-text font-medium px-2 py-1.5 rounded-lg hover:bg-bg transition-colors cursor-pointer whitespace-nowrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                      Prontuário
                    </button>
                    <button className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-text font-medium px-2 py-1.5 rounded-lg hover:bg-bg transition-colors cursor-pointer whitespace-nowrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                      Editar
                    </button>
                    <button className="inline-flex items-center gap-1.5 text-[11px] text-muted hover:text-text font-medium px-2 py-1.5 rounded-lg hover:bg-bg transition-colors cursor-pointer whitespace-nowrap">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                      Agendar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent updates */}
      <div className="mt-4 bg-card border border-border rounded-[14px] p-5">
        <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Últimas atualizações</h4>
        <div className="flex gap-6">
          {updates.map((u, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${u.dot}`} />
              <span className="text-[12px] font-medium">{u.name}</span>
              <span className="text-[11px] text-muted">{u.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
