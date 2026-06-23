import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PacientesView } from '@/components/pacientes-view'

export default async function AtendimentoPage() {
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

  let whatsapp = null
  if (prof?.clinica_id) {
    const { data } = await supabase
      .from('whatsapp_instancias')
      .select('id, nome_instancia, numero, status, qrcode_base64, api_key')
      .eq('clinica_id', prof.clinica_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    whatsapp = data
  }

  return (
    <>
      <div className="flex items-center justify-between px-10 pt-7">
        <div>
          <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Atendimento</h1>
          <p className="text-sm text-muted mt-0.5">Converse com seus pacientes e gerencie atendimentos.</p>
        </div>
        <div className="flex gap-2.5">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-text text-white rounded-[13px] text-sm font-semibold hover:bg-[#333] transition-all hover:-translate-y-px hover:shadow-lg cursor-pointer">
            + Novo agendamento
          </button>
        </div>
      </div>
      <PacientesView whatsapp={whatsapp} />
    </>
  )
}
