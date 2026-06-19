'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createAgendamentoAction(formData: FormData) {
  const paciente_id = String(formData.get('paciente_id') ?? '')
  const profissional_id = String(formData.get('profissional_id') ?? '')
  const tipo_consulta_id_raw = String(formData.get('tipo_consulta_id') ?? '')
  const data = String(formData.get('data') ?? '').trim()
  const hora_inicio = String(formData.get('hora_inicio') ?? '').trim()
  const hora_fim = String(formData.get('hora_fim') ?? '').trim()
  const notas = String(formData.get('notas') ?? '').trim()
  const valor_raw = String(formData.get('valor') ?? '').trim()
  const status = String(formData.get('status') ?? 'agendado')

  if (!paciente_id || !profissional_id || !data || !hora_inicio || !hora_fim) {
    return { ok: false as const, error: 'Paciente, profissional, data e horários são obrigatórios' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Não autenticado' }

  const valor = valor_raw ? Number(valor_raw.replace(',', '.')) : null

  const { error } = await supabase.from('agendamentos').insert({
    paciente_id,
    profissional_id,
    tipo_consulta_id: tipo_consulta_id_raw && tipo_consulta_id_raw !== 'none' ? tipo_consulta_id_raw : null,
    data,
    hora_inicio,
    hora_fim,
    status,
    notas: notas || null,
    valor: valor && !Number.isNaN(valor) ? valor : null,
  })

  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/agenda')
  revalidatePath('/')
  redirect('/agenda')
}

export async function updateAgendamentoAction(id: string, formData: FormData) {
  const paciente_id = String(formData.get('paciente_id') ?? '')
  const profissional_id = String(formData.get('profissional_id') ?? '')
  const tipo_consulta_id_raw = String(formData.get('tipo_consulta_id') ?? '')
  const data = String(formData.get('data') ?? '').trim()
  const hora_inicio = String(formData.get('hora_inicio') ?? '').trim()
  const hora_fim = String(formData.get('hora_fim') ?? '').trim()
  const notas = String(formData.get('notas') ?? '').trim()
  const valor_raw = String(formData.get('valor') ?? '').trim()
  const status = String(formData.get('status') ?? 'agendado')

  if (!paciente_id || !profissional_id || !data || !hora_inicio || !hora_fim) {
    return { ok: false as const, error: 'Paciente, profissional, data e horários são obrigatórios' }
  }

  const supabase = await createClient()
  const valor = valor_raw ? Number(valor_raw.replace(',', '.')) : null

  const { error } = await supabase
    .from('agendamentos')
    .update({
      paciente_id,
      profissional_id,
      tipo_consulta_id: tipo_consulta_id_raw && tipo_consulta_id_raw !== 'none' ? tipo_consulta_id_raw : null,
      data,
      hora_inicio,
      hora_fim,
      status,
      notas: notas || null,
      valor: valor && !Number.isNaN(valor) ? valor : null,
    })
    .eq('id', id)

  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/agenda')
  revalidatePath('/')
  revalidatePath(`/agenda/${id}`)
  redirect('/agenda')
}

export async function deleteAgendamentoAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('agendamentos').delete().eq('id', id)
  if (error) return { ok: false as const, error: error.message }

  revalidatePath('/agenda')
  revalidatePath('/')
  redirect('/agenda')
}
