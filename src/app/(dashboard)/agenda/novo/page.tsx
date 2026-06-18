import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NovoAgendamentoForm } from './form'

export default async function NovoAgendamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ paciente?: string; data?: string }>
}) {
  const sp = await searchParams
  const supabase = await createClient()

  const [{ data: pacientes }, { data: profissionais }, { data: tipos }] = await Promise.all([
    supabase.from('pacientes').select('id, nome').eq('status', 'ativo').order('nome'),
    supabase.from('profissionais').select('id, nome, especialidade').eq('ativo', true).order('nome'),
    supabase.from('tipos_consulta').select('id, nome, cor, duracao_padrao').order('nome'),
  ])

  return (
    <div className="px-10 pt-7 pb-10 max-w-[780px]">
      <div className="mb-5">
        <Link href="/agenda" className="text-xs text-muted hover:text-text font-medium">
          ← Voltar para agenda
        </Link>
      </div>
      <div className="mb-7">
        <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Nova consulta</h1>
        <p className="text-sm text-muted mt-0.5">Agendar uma nova consulta para um paciente</p>
      </div>

      <NovoAgendamentoForm
        pacientes={pacientes ?? []}
        profissionais={profissionais ?? []}
        tipos={tipos ?? []}
        defaultPacienteId={sp.paciente ?? ''}
        defaultData={sp.data ?? ''}
      />
    </div>
  )
}
