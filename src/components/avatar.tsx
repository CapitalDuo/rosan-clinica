import { COR_AVATAR_PADRAO } from '@/lib/avatar'

const SIZES = {
  sm: 'w-8 h-8 text-[10px]',
  md: 'w-10 h-10 text-[13px]',
  lg: 'w-12 h-12 text-sm',
  xl: 'w-14 h-14 text-lg',
} as const

/** Círculo com iniciais. Apresentação pura — quem chama decide as iniciais e a
 *  cor (armazenada no banco ou derivada do nome via corParaNome). */
export function Avatar({
  initials,
  cor,
  size = 'md',
  className = '',
}: {
  initials: string
  cor?: string | null
  size?: keyof typeof SIZES
  className?: string
}) {
  return (
    <div
      className={`${SIZES[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{ background: cor ?? COR_AVATAR_PADRAO }}
    >
      {initials}
    </div>
  )
}
