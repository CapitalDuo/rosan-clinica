'use server'

import { supabase } from '@/lib/supabase'

const WEEKDAY_MAP: Record<string, number> = {
  dom: 0, seg: 1, ter: 2, qua: 3, qui: 4, sex: 5, sab: 6,
}

const PALETTE = ['#b8a88a', '#8ab89b', '#a88ab8', '#8a8ab8', '#b88a8a', '#8ab8b8']

function iniciais(nome: string) {
  const parts = nome.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export type OnboardingPayload = {
  clinic: { nome: string; telefone: string; cnpj: string; endereco: string }
  professionals: { nome: string; especialidade: string; registro: string }[]
  schedule: Record<string, { aberto: boolean; inicio: string; fim: string }>
  whatsapp: { instancia: string; numero: string }
}

export async function completeOnboarding(payload: OnboardingPayload) {
  const { clinic, professionals, schedule, whatsapp } = payload

  const { data: clinica, error: clinicError } = await supabase
    .from('clinica')
    .insert({
      nome: clinic.nome,
      telefone: clinic.telefone || null,
      cnpj: clinic.cnpj || null,
      endereco: clinic.endereco || null,
      onboarding_completo: true,
      onboarding_step: 4,
    })
    .select('id')
    .single()

  if (clinicError || !clinica) {
    return { ok: false as const, error: clinicError?.message ?? 'Falha ao criar clínica' }
  }

  const clinicaId = clinica.id

  const profsToInsert = professionals
    .filter(p => p.nome.trim())
    .map((p, i) => ({
      clinica_id: clinicaId,
      nome: p.nome,
      especialidade: p.especialidade || null,
      registro: p.registro || null,
      role: i === 0 ? 'admin' : 'profissional',
      iniciais: iniciais(p.nome),
      cor: PALETTE[i % PALETTE.length],
    }))

  if (profsToInsert.length > 0) {
    const { error: profError } = await supabase.from('profissionais').insert(profsToInsert)
    if (profError) return { ok: false as const, error: profError.message }
  }

  const horarios = Object.entries(schedule).map(([key, day]) => ({
    clinica_id: clinicaId,
    dia_semana: WEEKDAY_MAP[key],
    aberto: day.aberto,
    hora_inicio: day.aberto ? day.inicio : null,
    hora_fim: day.aberto ? day.fim : null,
  }))

  const { error: schedError } = await supabase.from('horarios_funcionamento').insert(horarios)
  if (schedError) return { ok: false as const, error: schedError.message }

  if (whatsapp.instancia.trim() && whatsapp.numero.trim()) {
    const { error: waError } = await supabase.from('whatsapp_instancias').insert({
      clinica_id: clinicaId,
      nome_instancia: whatsapp.instancia,
      numero: whatsapp.numero,
      status: 'desconectado',
    })
    if (waError) return { ok: false as const, error: waError.message }
  }

  return { ok: true as const, clinicaId }
}
