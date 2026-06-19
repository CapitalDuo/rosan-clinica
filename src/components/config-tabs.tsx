'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/configuracoes/perfil', label: 'Clínica' },
  { href: '/configuracoes/horarios', label: 'Horários' },
  { href: '/configuracoes/whatsapp', label: 'WhatsApp' },
  { href: '/configuracoes/meu-perfil', label: 'Meu perfil' },
  { href: '/configuracoes/suporte', label: 'Suporte' },
]

export function ConfigTabs() {
  const pathname = usePathname()
  return (
    <div className="px-10 mt-4 border-b border-border">
      <div className="flex gap-1">
        {TABS.map((t) => {
          const active = pathname.startsWith(t.href)
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
                active ? 'border-text text-text' : 'border-transparent text-muted hover:text-text'
              }`}
            >
              {t.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
