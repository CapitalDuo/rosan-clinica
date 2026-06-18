import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TicketThread } from '@/components/ticket-thread'

export default async function AdminTicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: ticket } = await supabase
    .from('suporte_tickets')
    .select('id, assunto, categoria, status, prioridade, created_at, clinica_id')
    .eq('id', id)
    .maybeSingle()

  if (!ticket) notFound()

  const [{ data: clinica }, { data: mensagens }] = await Promise.all([
    supabase.from('clinica').select('nome').eq('id', ticket.clinica_id).maybeSingle(),
    supabase
      .from('suporte_mensagens')
      .select('id, autor_tipo, conteudo, created_at')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true }),
  ])

  const clinicaNome = clinica?.nome ?? null

  return (
    <div className="px-10 pt-7 pb-10 max-w-[820px]">
      <div className="mb-5">
        <Link href="/admin/suporte" className="text-xs text-muted hover:text-text font-medium">
          ← Voltar para suporte
        </Link>
      </div>
      <TicketThread
        ticket={{ ...ticket, clinica_nome: clinicaNome }}
        mensagens={mensagens ?? []}
        asRole="admin"
      />
    </div>
  )
}
