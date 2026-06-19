import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditarAgendamentoForm } from './form'

export default async function EditarAgendamentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: ag }, { data: pacientes }, { data: profissionais }, { data: tipos }] = await Promise.all([
    supabase
      .from('agendamentos')
      .select('id, paciente_id, profissional_id, tipo_consulta_id, data, hora_inicio, hora_fim, status, notas, valor')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('pacientes').select('id, nome').eq('status', 'ativo').order('nome'),
    supabase.from('profissionais').select('id, nome, especialidade').eq('ativo', true).order('nome'),
    supabase.from('tipos_consulta').select('id, nome, cor, duracao_padrao').order('nome'),
  ])

  if (!ag) notFound()

  const pacienteNome = pacientes?.find((p) => p.id === ag.paciente_id)?.nome ?? '—'

  return (
    <div className="px-10 pt-7 pb-10 max-w-[780px]">
      <div className="mb-5">
        <Link href="/agenda" className="text-xs text-muted hover:text-text font-medium">
          ← Voltar para agenda
        </Link>
      </div>
      <div className="mb-7">
        <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Editar consulta</h1>
        <p className="text-sm text-muted mt-0.5">{pacienteNome} · {new Date(ag.data + 'T00:00:00').toLocaleDateString('pt-BR')} · {ag.hora_inicio.slice(0, 5)}</p>
      </div>

      <EditarAgendamentoForm
        agendamento={ag}
        pacientes={pacientes ?? []}
        profissionais={profissionais ?? []}
        tipos={tipos ?? []}
      />
    </div>
  )
}
