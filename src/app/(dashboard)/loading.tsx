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
            <path d="M20 8 C16 12, 12 14, 12 20 C12 24, 14 28, 20 32 C26 28, 28 24, 28 20 C28 14, 24 12, 20 8Z" stroke="#5b4bd4" strokeWidth="1.2" fill="none" />
          </svg>
        </div>
        <p className="text-sm font-medium text-muted">Carregando seu painel...</p>
      </div>
    </div>
  )
}
