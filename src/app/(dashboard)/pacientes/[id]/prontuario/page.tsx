import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NovoProntuarioForm } from './form'

export default async function ProntuarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: paciente }, { data: prontuarios }] = await Promise.all([
    supabase.from('pacientes').select('id, nome, iniciais, cor').eq('id', id).maybeSingle(),
    supabase
      .from('prontuarios')
      .select('id, descricao, diagnostico, prescricao, created_at, profissional_id')
      .eq('paciente_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!paciente) notFound()

  const profIds = Array.from(new Set((prontuarios ?? []).map((p) => p.profissional_id)))
  const { data: profs } = profIds.length
    ? await supabase.from('profissionais').select('id, nome').in('id', profIds)
    : { data: [] }
  const profNomeById = new Map((profs ?? []).map((p) => [p.id, p.nome]))

  return (
    <div className="px-10 pt-7 pb-10 max-w-[820px]">
      <div className="mb-5">
        <Link href="/pacientes" className="text-xs text-muted hover:text-text font-medium">
          ← Voltar para pacientes
        </Link>
      </div>

      <div className="flex items-center gap-4 mb-7">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: paciente.cor ?? '#b8a88a' }}
        >
          {paciente.iniciais ?? paciente.nome.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">{paciente.nome}</h1>
          <p className="text-sm text-muted mt-0.5">Prontuário · {prontuarios?.length ?? 0} registro{prontuarios?.length === 1 ? '' : 's'}</p>
        </div>
      </div>

      <NovoProntuarioForm pacienteId={id} />

      <div className="mt-8 flex flex-col gap-4">
        {!prontuarios || prontuarios.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted bg-card border border-border rounded-[14px]">
            Nenhum registro no prontuário ainda. Use o formulário acima pra criar o primeiro.
          </div>
        ) : (
          prontuarios.map((r) => (
            <div key={r.id} className="bg-card border border-border rounded-[14px] p-6">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-border">
                <div className="text-xs text-muted">
                  <span className="font-semibold text-text">{profNomeById.get(r.profissional_id) ?? 'Profissional'}</span>
                  {' · '}
                  {new Date(r.created_at).toLocaleString('pt-BR')}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <Section title="Descrição" content={r.descricao} />
                {r.diagnostico && <Section title="Diagnóstico" content={r.diagnostico} />}
                {r.prescricao && <Section title="Prescrição" content={r.prescricao} />}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">{title}</div>
      <div className="text-sm leading-relaxed whitespace-pre-wrap">{content}</div>
    </div>
  )
}
