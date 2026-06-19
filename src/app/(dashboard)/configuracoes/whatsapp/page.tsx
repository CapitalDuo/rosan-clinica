import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { WhatsappForm } from './form'

const statusStyles: Record<string, string> = {
  conectado: 'bg-green-light text-green',
  aguardando_scan: 'bg-orange-light text-orange',
  desconectado: 'bg-bg text-muted',
  erro: 'bg-red-light text-red',
}

const statusLabel: Record<string, string> = {
  conectado: 'Conectado',
  aguardando_scan: 'Aguardando scan',
  desconectado: 'Desconectado',
  erro: 'Erro',
}

export default async function WhatsappPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: prof } = await supabase
    .from('profissionais')
    .select('clinica_id')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!prof?.clinica_id) {
    return <div className="px-10 pt-7 pb-10 text-sm text-muted">Conta sem clínica vinculada.</div>
  }

  const { data: instancia } = await supabase
    .from('whatsapp_instancias')
    .select('id, nome_instancia, numero, status, ultimo_ping')
    .eq('clinica_id', prof.clinica_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return (
    <div className="px-10 pt-7 pb-10 max-w-[820px]">
      {instancia && (
        <div className="bg-card border border-border rounded-[14px] p-5 mb-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider">Status atual</div>
            <div className="text-sm font-semibold mt-0.5">
              {instancia.nome_instancia} · {instancia.numero}
            </div>
          </div>
          <span className={`text-[11px] font-semibold px-3 py-1 rounded-md ${statusStyles[instancia.status] ?? 'bg-bg text-muted'}`}>
            {statusLabel[instancia.status] ?? instancia.status}
          </span>
        </div>
      )}

      <WhatsappForm
        initial={instancia ? { id: instancia.id, nome_instancia: instancia.nome_instancia, numero: instancia.numero } : null}
      />
    </div>
  )
}
