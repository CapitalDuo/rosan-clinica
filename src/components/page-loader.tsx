'use client'

export function PageLoader({ message = 'Aguarde...' }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(10, 9, 30, 0.88)', backdropFilter: 'blur(10px)' }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Spinner ring com logo mark centralizada */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{ border: '3px solid rgba(91, 75, 212, 0.2)', borderTopColor: '#5b4bd4' }}
          />
          <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
            <circle cx="20" cy="20" r="18" stroke="#5b4bd4" strokeWidth="1.5" />
            <path d="M20 8 C16 12, 12 14, 12 20 C12 24, 14 28, 20 32 C26 28, 28 24, 28 20 C28 14, 24 12, 20 8Z" stroke="#5b4bd4" strokeWidth="1.2" fill="none" />
            <path d="M14 16 Q17 20, 20 16 Q23 20, 26 16" stroke="#5b4bd4" strokeWidth="1" fill="none" />
            <path d="M15 22 Q17.5 26, 20 22 Q22.5 26, 25 22" stroke="#5b4bd4" strokeWidth="1" fill="none" />
          </svg>
        </div>
        <p className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.70)' }}>
          {message}
        </p>
      </div>
    </div>
  )
}
