import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

type Limiter = {
  limit: (key: string) => Promise<{ success: boolean; remaining: number; reset: number }>
}

let warned = false

function buildLimiter(window: `${number} ${'s' | 'ms' | 'm' | 'h' | 'd'}`, requests: number): Limiter | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) {
    if (!warned) {
      warned = true
      console.warn(
        '[ratelimit] UPSTASH_REDIS_REST_URL/TOKEN não configuradas. Rate limit desativado (fail-open).',
      )
    }
    return null
  }
  const redis = new Redis({ url, token })
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    analytics: false,
    prefix: 'rosan',
  })
}

// Limites por server action — ajuste se sentir aperto em uso real
const limiters = {
  write: buildLimiter('1 m', 20),       // server actions de escrita (criar consulta, paciente, mensagem)
  ticket: buildLimiter('10 m', 5),      // criar ticket de suporte — flood-prevention agressivo
  message: buildLimiter('1 m', 30),     // mensagens em ticket/conversa
  login: buildLimiter('15 m', 10),      // login attempts por IP
}

export type LimiterKind = keyof typeof limiters

/**
 * Aplica rate limit. Se não configurado (sem env), passa direto (fail-open).
 * Retorna { ok: false, error } pra você devolver ao client.
 */
export async function checkRateLimit(
  kind: LimiterKind,
  identifier: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const limiter = limiters[kind]
  if (!limiter) return { ok: true }

  try {
    const { success, reset } = await limiter.limit(identifier)
    if (success) return { ok: true }
    const waitSec = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
    return {
      ok: false,
      error: `Muitas requisições. Tente novamente em ${waitSec}s.`,
    }
  } catch (err) {
    // Se o Redis falhar, fail-open (não bloqueia o usuário por problema de infra)
    console.error('[ratelimit] erro chamando Upstash:', err)
    return { ok: true }
  }
}
