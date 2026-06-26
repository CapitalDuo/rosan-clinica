import Image from 'next/image'

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-5">
        <div className="relative w-14 h-14 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{ border: '3px solid rgba(91, 75, 212, 0.2)', borderTopColor: '#5b4bd4' }}
          />
          <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
            <circle cx="20" cy="20" r="18" stroke="#5b4bd4" strokeWidth="1.5" />
          </svg>
          {/* Marca oficial Useclin */}
          <Image
            src="/useclin-icon.png"
            alt="Useclin"
            width={14}
            height={14}
            priority
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain"
          />
        </div>
        <p className="text-sm font-medium text-muted">Carregando seu painel...</p>
      </div>
    </div>
  )
}
