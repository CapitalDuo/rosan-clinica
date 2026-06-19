import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { HorariosForm } from './form'

export default async function HorariosPage() {
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

  const { data: horarios } = await supabase
    .from('horarios_funcionamento')
    .select('dia_semana, aberto, hora_inicio, hora_fim')
    .eq('clinica_id', prof.clinica_id)

  const byDay = new Map((horarios ?? []).map((h) => [h.dia_semana, h]))

  return (
    <div className="px-10 pt-7 pb-10 max-w-[820px]">
      <HorariosForm
        initial={[0, 1, 2, 3, 4, 5, 6].map((d) => {
          const h = byDay.get(d)
          return {
            dia_semana: d,
            aberto: h?.aberto ?? (d !== 0),
            hora_inicio: h?.hora_inicio?.slice(0, 5) ?? '08:00',
            hora_fim: h?.hora_fim?.slice(0, 5) ?? '18:00',
          }
        })}
      />
    </div>
  )
}
