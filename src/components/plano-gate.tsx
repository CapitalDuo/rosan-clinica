'use client'

import { usePathname } from 'next/navigation'
import { PlanoBloqueado } from '@/components/plano-bloqueado'

// Decide no cliente se o conteúdo da rota atual deve ser bloqueado. `bloqueado`
// vem do servidor (estado do plano/teste, estável na sessão); o pathname é lido
// com usePathname() para reagir a navegações client-side — o layout do dashboard
// é compartilhado e não re-renderiza ao trocar de aba. Configurações sempre passa.
export function PlanoGate({
  bloqueado,
  children,
}: {
  bloqueado: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  if (bloqueado && !pathname.startsWith('/configuracoes')) {
    return <PlanoBloqueado />
  }
  return <>{children}</>
}
