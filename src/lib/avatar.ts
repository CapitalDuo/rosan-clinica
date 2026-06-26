// Avatar: iniciais, paleta de cores e helpers de cor. Fonte única — antes
// duplicado nas actions de pacientes/onboarding/admin e em vários componentes.

export const AVATAR_PALETTE = [
  '#b8a88a', '#8ab89b', '#a88ab8', '#8a8ab8', '#b88a8a', '#8ab8b8', '#b8b88a',
]

export const COR_AVATAR_PADRAO = '#b8a88a'

/** Iniciais de um nome: 1ª + última palavra, ou 2 letras se for só um nome. */
export function iniciais(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/** Cor aleatória da paleta — para novos cadastros. */
export function randomColor(): string {
  return AVATAR_PALETTE[Math.floor(Math.random() * AVATAR_PALETTE.length)]
}

/** Cor determinística a partir do nome (mesma cor sempre para o mesmo nome). */
export function corParaNome(nome: string): string {
  return AVATAR_PALETTE[(nome.charCodeAt(0) || 0) % AVATAR_PALETTE.length]
}
