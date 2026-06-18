'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createProntuarioAction(pacienteId: string, formData: FormData) {
  const descricao = String(formData.get('descricao') ?? '').trim()
  const diagnostico = String(formData.get('diagnostico') ?? '').trim()
  const prescricao = String(formData.get('prescricao') ?? '').trim()

  if (!descricao) {
    return { ok: false as const, error: 'A descrição é obrigatória' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Não autenticado' }

  const { data: prof } = await supabase
    .from('profissionais')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!prof) return { ok: false as const, error: 'Profissional não encontrado' }

  const { error } = await supabase.from('prontuarios').insert({
    paciente_id: pacienteId,
    profissional_id: prof.id,
    descricao,
    diagnostico: diagnostico || null,
    prescricao: prescricao || null,
  })

  if (error) return { ok: false as const, error: error.message }

  revalidatePath(`/pacientes/${pacienteId}/prontuario`)
  return { ok: true as const }
}
