'use client'

import { useEffect } from 'react'

// global-error substitui o layout raiz quando um erro escapa de todos os
// boundaries abaixo (inclusive o do layout do dashboard). Por isso precisa
// declarar <html>/<body> e usar estilos inline — o globals.css do layout raiz
// não é garantido aqui.
export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error('[global-error]', error)
  }, [error])

  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f4f3f1',
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          padding: 24,
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '2px solid rgba(91,75,212,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#5b4bd4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: '#1e1b4b', margin: '0 0 8px' }}>
            Algo não carregou como esperado
          </h1>
          <p style={{ fontSize: 14, color: '#6b6b80', margin: '0 0 24px', lineHeight: 1.5 }}>
            Foi um erro temporário. Tente novamente — seus dados estão salvos.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button
              onClick={() => unstable_retry()}
              style={{
                padding: '10px 22px',
                borderRadius: 12,
                border: 'none',
                background: '#1e1b4b',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Tentar novamente
            </button>
            <button
              onClick={() => {
                window.location.href = '/'
              }}
              style={{
                padding: '10px 22px',
                borderRadius: 12,
                border: '1px solid #d8d6e0',
                background: '#fff',
                color: '#1e1b4b',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Ir para o início
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
