import Link from 'next/link'

function greeting(hour: number) {
  return hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
}

function emoji(hour: number) {
  return hour < 12 ? '☀️' : hour < 18 ? '🌿' : '🌙'
}

export function DashboardHero({ userName }: { userName: string }) {
  const now = new Date()
  const hour = now.getHours()
  const firstName = userName.split(' ').slice(0, 2).join(' ')
  const dateStr = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="relative overflow-hidden rounded-[14px] text-white p-7" style={{ background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)' }}>
      <div className="relative z-10 max-w-[60%]">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-semibold mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span className="capitalize">{dateStr}</span>
          <span className="opacity-60">·</span>
          <span>{timeStr}</span>
        </div>
        <h1 className="font-playfair text-[32px] font-extrabold tracking-tight leading-tight">
          {greeting(hour)}, {firstName}! {emoji(hour)}
        </h1>
        <p className="text-sm text-white/80 mt-2 max-w-md">
          Tenha uma jornada produtiva. Confira a sua agenda e os atendimentos do dia.
        </p>

        <Link
          href="/agenda/novo"
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-text rounded-[10px] text-sm font-semibold hover:bg-white/90 transition-all hover:-translate-y-px shadow-lg"
        >
          + Nova consulta
        </Link>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-[42%] opacity-95 pointer-events-none hidden md:block">
        <DoctorIllustration />
      </div>

      <svg className="absolute -bottom-8 -right-8 w-40 h-40 opacity-10 pointer-events-none" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2" />
        <circle cx="50" cy="50" r="32" stroke="white" strokeWidth="2" />
      </svg>
    </div>
  )
}

function DoctorIllustration() {
  return (
    <svg viewBox="0 0 300 220" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <circle cx="195" cy="110" r="95" fill="white" fillOpacity="0.08" />
      <circle cx="195" cy="110" r="70" fill="white" fillOpacity="0.06" />

      <g transform="translate(155, 30)">
        <path d="M30 80 L18 200 L82 200 L70 80 Z" fill="white" />
        <path d="M30 80 Q40 70 50 70 Q60 70 70 80 L70 95 L62 95 L50 110 L38 95 L30 95 Z" fill="white" />
        <path d="M38 88 L50 105 L62 88" stroke="#6366F1" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        <circle cx="58" cy="170" r="5.5" fill="none" stroke="#1f2937" strokeWidth="1.8" />
        <path d="M58 164.5 Q70 145 50 130 Q34 120 36 105" stroke="#1f2937" strokeWidth="1.8" fill="none" strokeLinecap="round" />

        <circle cx="50" cy="50" r="22" fill="#FCD9B6" />
        <path d="M28 50 Q28 27 50 24 Q72 27 72 50 L67 47 Q67 30 50 30 Q33 30 33 47 Z" fill="#3b2a20" />
        <circle cx="43" cy="50" r="1.8" fill="#1f2937" />
        <circle cx="57" cy="50" r="1.8" fill="#1f2937" />
        <path d="M44 60 Q50 64 56 60" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        <rect x="38" y="100" width="8" height="14" rx="2" fill="#e5e7eb" />
        <line x1="42" y1="100" x2="42" y2="114" stroke="#9ca3af" strokeWidth="0.5" />
      </g>

      <g opacity="0.85">
        <g transform="translate(65, 50)">
          <rect x="-4" y="-12" width="8" height="24" rx="2" fill="white" />
          <rect x="-12" y="-4" width="24" height="8" rx="2" fill="white" />
        </g>
        <g transform="translate(35, 130)">
          <rect x="-3" y="-9" width="6" height="18" rx="1.5" fill="white" fillOpacity="0.7" />
          <rect x="-9" y="-3" width="18" height="6" rx="1.5" fill="white" fillOpacity="0.7" />
        </g>
        <g transform="translate(110, 35)">
          <rect x="-14" y="-6" width="28" height="12" rx="6" fill="white" />
          <rect x="-14" y="-6" width="14" height="12" rx="6" fill="white" stroke="#6366F1" strokeWidth="0.5" />
          <line x1="0" y1="-6" x2="0" y2="6" stroke="#6366F1" strokeWidth="1" />
        </g>
        <circle cx="80" cy="180" r="3.5" fill="white" fillOpacity="0.65" />
        <circle cx="125" cy="95" r="2.5" fill="white" fillOpacity="0.6" />
        <circle cx="50" cy="95" r="2" fill="white" fillOpacity="0.5" />
      </g>
    </svg>
  )
}
