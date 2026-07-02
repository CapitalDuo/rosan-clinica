'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function excluirPrescricaoAction(
  prescricaoId: string,
  pacienteId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Não autenticado' }

  const { data: prescricao } = await supabase
    .from('prescricoes')
    .select('pdf_url')
    .eq('id', prescricaoId)
    .maybeSingle()

  if (!prescricao) return { ok: false, error: 'Prescrição não encontrada' }

  // Remove o PDF do Storage se existir. pdf_url guarda o path do objeto;
  // linhas criadas antes da migration podem ainda ter a URL pública antiga.
  if (prescricao.pdf_url) {
    const path = prescricao.pdf_url.replace(/^.*\/storage\/v1\/object\/public\/prescricoes\//, '')
    await supabase.storage.from('prescricoes').remove([decodeURIComponent(path)])
  }

  const { error } = await supabase.from('prescricoes').delete().eq('id', prescricaoId)
  if (error) return { ok: false, error: error.message }

  revalidatePath(`/pacientes/${pacienteId}/prescricoes`)
  return { ok: true }
}
