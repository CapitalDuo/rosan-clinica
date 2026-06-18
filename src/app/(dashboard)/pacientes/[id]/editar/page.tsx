import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { EditarPacienteForm } from './form'

export default async function EditarPacientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: paciente }, { data: planos }] = await Promise.all([
    supabase
      .from('pacientes')
      .select('id, nome, cpf, data_nascimento, telefone, whatsapp, email, endereco, observacoes, plano_id, valor_plano, status')
      .eq('id', id)
      .maybeSingle(),
    supabase.from('planos').select('id, nome, tipo').order('nome'),
  ])

  if (!paciente) notFound()

  return (
    <div className="px-10 pt-7 pb-10 max-w-[780px]">
      <div className="mb-5">
        <Link href="/pacientes" className="text-xs text-muted hover:text-text font-medium">
          ← Voltar para pacientes
        </Link>
      </div>
      <div className="mb-7">
        <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Editar paciente</h1>
        <p className="text-sm text-muted mt-0.5">{paciente.nome}</p>
      </div>

      <EditarPacienteForm paciente={paciente} planos={planos ?? []} />
    </div>
  )
}
