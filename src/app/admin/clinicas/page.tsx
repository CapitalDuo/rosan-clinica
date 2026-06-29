import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { AdminDeleteButton } from '@/components/admin-delete-button'
import { isTrialAtivo } from '@/lib/plano'

const PLANO_LABEL: Record<string, { nome: string; cls: string }> = {
  basico: { nome: 'Básico', cls: 'bg-[#f1eefb] text-[#5b4bd4]' },
  completo: { nome: 'Completo', cls: 'bg-[#eaf8f3] text-[#1c8b66]' },
}

type ClinicaPlano = {
  plano_slug: string
  trial_ends_at: string | null
  plano_periodo_fim: string | null
  plano_cancelando: boolean
}

// Deriva o badge de plano. Gratuito = estado real do teste: "Em teste" enquanto
// ativo, "Sem plano" depois de expirar.
function planoBadge(c: ClinicaPlano): { nome: string; cls: string; sub: string | null } {
  if (c.plano_slug === 'gratuito') {
    if (isTrialAtivo(c.trial_ends_at)) {
      return {
        nome: 'Em teste',
        cls: 'bg-orange-light text-orange',
        sub: c.trial_ends_at ? `termina em ${new Date(c.trial_ends_at).toLocaleDateString('pt-BR')}` : null,
      }
    }
    return { nome: 'Sem plano', cls: 'bg-red-light text-red', sub: 'teste encerrado' }
  }
  const base = PLANO_LABEL[c.plano_slug] ?? { nome: c.plano_slug, cls: 'bg-bg text-muted' }
  return {
    nome: base.nome,
    cls: base.cls,
    sub: c.plano_periodo_fim
      ? `${c.plano_cancelando ? 'cancela em ' : 'renova em '}${new Date(c.plano_periodo_fim).toLocaleDateString('pt-BR')}`
      : null,
  }
}

export default async function AdminClinicasPage() {
  const supabase = await createClient()
  const { data: clinicas } = await supabase
    .from('clinica')
    .select('id, nome, email, telefone, onboarding_completo, created_at, plano_slug, plano_status, plano_cancelando, plano_periodo_fim, trial_ends_at')
    .order('created_at', { ascending: false })

  return (
    <div className="px-10 pt-7 pb-10">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Clínicas</h1>
          <p className="text-sm text-muted mt-0.5">
            {clinicas?.length ?? 0} clínica{clinicas?.length === 1 ? '' : 's'} cadastrada{clinicas?.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          href="/admin/clinicas/novo"
          className="inline-flex items-center gap-2 px-6 py-3 bg-text text-white rounded-[13px] text-sm font-semibold hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg cursor-pointer"
        >
          + Nova clínica
        </Link>
      </div>

      <div className="bg-card border border-border rounded-[14px] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg">
              <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-6 py-3">Nome</th>
              <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-6 py-3">Email</th>
              <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-6 py-3">Telefone</th>
              <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-6 py-3">Status</th>
              <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-6 py-3">Plano</th>
              <th className="text-left text-[11px] font-semibold text-muted uppercase tracking-wider px-6 py-3">Criada em</th>
              <th className="text-right text-[11px] font-semibold text-muted uppercase tracking-wider px-6 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {clinicas?.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-16 text-sm text-muted">
                  Nenhuma clínica ainda. Crie a primeira →
                </td>
              </tr>
            ) : (
              clinicas?.map((c) => {
                const badge = planoBadge(c)
                return (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-bg transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold">{c.nome}</td>
                  <td className="px-6 py-4 text-sm text-muted">{c.email ?? '—'}</td>
                  <td className="px-6 py-4 text-sm text-muted">{c.telefone ?? '—'}</td>
                  <td className="px-6 py-4">
                    {c.onboarding_completo ? (
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-md bg-green-light text-green">Ativa</span>
                    ) : (
                      <span className="text-[11px] font-semibold px-3 py-1 rounded-md bg-orange-light text-orange">Onboarding pendente</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className={`w-fit text-[11px] font-semibold px-3 py-1 rounded-md ${badge.cls}`}>
                        {badge.nome}
                      </span>
                      {badge.sub && (
                        <span className="text-[11px] text-muted">{badge.sub}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted">
                    {new Date(c.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <AdminDeleteButton kind="clinica" id={c.id} nome={c.nome} />
                  </td>
                </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
