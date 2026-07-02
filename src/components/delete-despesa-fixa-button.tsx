'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { excluirDespesaFixaAction } from '@/app/(dashboard)/financeiro/despesas-fixas/actions'

export function DeleteDespesaFixaButton({ id }: { id: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await excluirDespesaFixaAction(id)
      setConfirming(false)
      router.refresh()
    })
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className="text-[11px] text-muted">Excluir?</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-[11px] font-semibold px-2.5 py-1 rounded-[8px] bg-red/10 text-red hover:bg-red hover:text-white transition-colors disabled:opacity-50"
        >
          {isPending ? '...' : 'Sim'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={isPending}
          className="text-[11px] font-semibold px-2.5 py-1 rounded-[8px] bg-bg text-muted hover:text-text transition-colors border border-border"
        >
          Não
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 rounded-[8px] text-muted hover:text-red hover:bg-red/10 transition-colors flex-shrink-0"
      title="Excluir despesa fixa"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
      </svg>
    </button>
  )
}
