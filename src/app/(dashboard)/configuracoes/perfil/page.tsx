import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PerfilClinicaForm } from './form'

export default async function PerfilClinicaPage() {
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
    return (
      <div className="px-10 pt-7 pb-10">
        <div className="bg-card border border-border rounded-[14px] p-8 text-sm text-muted">
          Sua conta ainda não está vinculada a uma clínica.
        </div>
      </div>
    )
  }

  const { data: clinica } = await supabase
    .from('clinica')
    .select('id, nome, subtitulo, cnpj, telefone, email, endereco')
    .eq('id', prof.clinica_id)
    .maybeSingle()

  if (!clinica) {
    return (
      <div className="px-10 pt-7 pb-10">
        <div className="bg-card border border-border rounded-[14px] p-8 text-sm text-muted">
          Clínica não encontrada.
        </div>
      </div>
    )
  }

  return (
    <div className="px-10 pt-7 pb-10 max-w-[820px]">
      <PerfilClinicaForm clinica={clinica} />
    </div>
  )
}
