'use client'

import Image from 'next/image'

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
          </svg>
          {/* Marca oficial Useclin */}
          <Image
            src="/useclin-icon.png"
            alt="Useclin"
            width={16}
            height={16}
            priority
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
          />
        </div>
        <p className="text-sm font-semibold tracking-wide" style={{ color: 'rgba(255,255,255,0.70)' }}>
          {message}
        </p>
      </div>
    </div>
  )
}
