import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MeuPerfilForm } from './form'

export default async function MeuPerfilPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: prof } = await supabase
    .from('profissionais')
    .select('id, nome, especialidade, registro, email, telefone, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!prof) {
    return <div className="px-10 pt-7 pb-10 text-sm text-muted">Profissional não encontrado.</div>
  }

  return (
    <div className="px-10 pt-7 pb-10 max-w-[820px]">
      <MeuPerfilForm profissional={prof} />
    </div>
  )
}
