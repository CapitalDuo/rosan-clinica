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
  let plano_slug = 'gratuito'

  if (prof?.clinica_id) {
    const [whatsappResult, clinicaResult] = await Promise.all([
      supabase
        .from('whatsapp_instancias')
        .select('id, nome_instancia, numero, status, qrcode_base64, api_key')
        .eq('clinica_id', prof.clinica_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('clinica')
        .select('plano_slug')
        .eq('id', prof.clinica_id)
        .maybeSingle(),
    ])
    whatsapp = whatsappResult.data
    plano_slug = clinicaResult.data?.plano_slug ?? 'gratuito'
  }

  if (plano_slug !== 'completo') {
    return (
      <div className="px-10 pt-7 pb-10">
        <h1 className="font-playfair text-[28px] font-extrabold tracking-tight">Atendimento</h1>
        <p className="text-sm text-muted mt-0.5">Converse com seus pacientes e gerencie atendimentos.</p>
        <div className="mt-10 flex flex-col items-center text-center max-w-md mx-auto gap-6">
          <div className="w-16 h-16 rounded-2xl bg-[#f1eefb] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#5b4bd4" strokeWidth="1.8" className="w-8 h-8">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <div>
            <h2 className="font-playfair text-[22px] font-extrabold tracking-tight mb-2">
              Disponível no Plano Completo
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              O módulo de Atendimento via WhatsApp e Agente de IA está disponível no Plano Completo por R$ 349/mês.
            </p>
          </div>
          <a href="/configuracoes"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#5b4bd4] text-white rounded-[13px] text-sm font-semibold hover:bg-[#4a3cb8] transition-all hover:-translate-y-px hover:shadow-lg">
            Ver planos em Configurações
          </a>
        </div>
      </div>
    )
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
