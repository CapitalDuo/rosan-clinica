'use client'

import { useEffect } from 'react'

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    // Em produção o erro vem com `digest` para casar com os logs do servidor.
    console.error('[dashboard] erro ao renderizar a página:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 rounded-full border-2 border-[#5b4bd4]/25 flex items-center justify-center mx-auto mb-5">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5b4bd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 className="font-playfair text-xl font-bold text-[#1e1b4b] mb-2">
          Não foi possível carregar esta página
        </h2>
        <p className="text-sm text-muted mb-6">
          Foi um erro temporário. Tente novamente — nada do que você salvou foi perdido.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => unstable_retry()}
            className="px-6 py-2.5 rounded-[13px] bg-text text-white text-sm font-semibold hover:bg-[#333] transition-colors cursor-pointer"
          >
            Tentar novamente
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-[13px] border border-border text-sm font-semibold hover:bg-bg transition-colors cursor-pointer"
          >
            Recarregar
          </button>
        </div>
      </div>
    </div>
  )
}
