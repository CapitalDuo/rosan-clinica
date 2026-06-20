import { redirect } from 'next/navigation'

export default async function EditarAgendamentoRedirect({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  redirect(`/agenda?edit=${encodeURIComponent(id)}`)
}
