// Dias da semana — fonte única da ordem (domingo = 0, igual a Date.getDay()),
// usada por onboarding e configurações na gravação e exibição dos horários.

export const WEEKDAY_KEYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'] as const

export type WeekdayKey = (typeof WEEKDAY_KEYS)[number]

/** key → número do dia (domingo = 0). */
export const WEEKDAY_MAP: Record<string, number> = Object.fromEntries(
  WEEKDAY_KEYS.map((k, i) => [k, i]),
)

export const DAY_LABELS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]
