import { redirect } from 'next/navigation'

export default async function NovoAgendamentoRedirect({
  searchParams,
}: {
  searchParams: Promise<{ paciente?: string; data?: string }>
}) {
  const sp = await searchParams
  const params = new URLSearchParams()
  params.set('new', '1')
  if (sp.data) params.set('data', sp.data)
  if (sp.paciente) params.set('paciente', sp.paciente)
  redirect(`/agenda?${params.toString()}`)
}
