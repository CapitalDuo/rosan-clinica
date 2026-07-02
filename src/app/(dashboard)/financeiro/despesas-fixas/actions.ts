'use server'

import { revalidatePath } from 'next/cache'
import { createClient, getProfissional } from '@/lib/supabase/server'
import { parseBrlInput } from '@/lib/currency'

const CATEGORIAS = ['aluguel', 'salarios', 'utilidades', 'material', 'marketing', 'impostos', 'assinaturas', 'outros'] as const
type Categoria = (typeof CATEGORIAS)[number]

function parseCategoria(v: string): Categoria {
  return (CATEGORIAS as readonly string[]).includes(v) ? (v as Categoria) : 'outros'
}

function parseDiaVencimento(formData: FormData): number | null {
  const dia = Number(formData.get('dia_vencimento') ?? 0)
  if (!Number.isInteger(dia) || dia < 1 || dia > 28) return null
  return dia
}

export async function criarDespesaFixaAction(
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()
  const { user, prof } = await getProfissional(supabase)
  if (!user) return { ok: false, error: 'Não autenticado' }
  if (!prof?.clinica_id) return { ok: false, error: 'Conta sem clínica vinculada' }

  const nome = String(formData.get('nome') ?? '').trim()
  if (!nome) return { ok: false, error: 'Nome é obrigatório' }

  const categoria = parseCategoria(String(formData.get('categoria') ?? ''))

  const parsed = parseBrlInput(String(formData.get('valor') ?? '').trim())
  if (!parsed || parsed.valor <= 0) return { ok: false, error: 'Valor inválido' }

  const diaVencimento = parseDiaVencimento(formData)
  if (diaVencimento === null) return { ok: false, error: 'Dia de vencimento deve ser entre 1 e 28' }

  const { error } = await supabase.from('despesas_fixas').insert({
    clinica_id: prof.clinica_id,
    nome,
    categoria,
    valor: parsed.valor,
    dia_vencimento: diaVencimento,
  })

  if (error) return { ok: false, error: error.message }

  revalidatePath('/financeiro/despesas-fixas')
  revalidatePath('/financeiro')
  return { ok: true }
}

export async function atualizarDespesaFixaAction(
  id: string,
  formData: FormData,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Não autenticado' }

  const nome = String(formData.get('nome') ?? '').trim()
  if (!nome) return { ok: false, error: 'Nome é obrigatório' }

  const categoria = parseCategoria(String(formData.get('categoria') ?? ''))

  const parsed = parseBrlInput(String(formData.get('valor') ?? '').trim())
  if (!parsed || parsed.valor <= 0) return { ok: false, error: 'Valor inválido' }

  const diaVencimento = parseDiaVencimento(formData)
  if (diaVencimento === null) return { ok: false, error: 'Dia de vencimento deve ser entre 1 e 28' }

  const ativo = formData.get('ativo') === 'on'

  const { error } = await supabase
    .from('despesas_fixas')
    .update({ nome, categoria, valor: parsed.valor, dia_vencimento: diaVencimento, ativo })
    .eq('id', id)

  if (error) return { ok: false, error: error.message }

  revalidatePath('/financeiro/despesas-fixas')
  revalidatePath('/financeiro')
  return { ok: true }
}

export async function excluirDespesaFixaAction(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Não autenticado' }

  // Histórico gerado permanece — a FK é ON DELETE SET NULL, não CASCADE.
  const { error } = await supabase.from('despesas_fixas').delete().eq('id', id)
  if (error) return { ok: false, error: error.message }

  revalidatePath('/financeiro/despesas-fixas')
  revalidatePath('/financeiro')
  return { ok: true }
}

export async function getDespesaFixaAction(id: string): Promise<
  | { ok: true; despesaFixa: { id: string; nome: string; categoria: string; valor: number; dia_vencimento: number; ativo: boolean } }
  | { ok: false; error: string }
> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('despesas_fixas')
    .select('id, nome, categoria, valor, dia_vencimento, ativo')
    .eq('id', id)
    .maybeSingle()

  if (error) return { ok: false, error: error.message }
  if (!data) return { ok: false, error: 'Despesa fixa não encontrada' }
  return { ok: true, despesaFixa: data }
}
