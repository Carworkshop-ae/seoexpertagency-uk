import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function makeLimiter(prefix: string, limiter: Ratelimit['limiter']): Ratelimit | null {
  try {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN
    if (!url || !token || !url.startsWith('https://')) {
      // Callers guard on `limiter !== null`, so a missing Upstash config
      // silently disables rate limiting entirely. That is fine locally and
      // dangerous in production — say so loudly rather than failing open in
      // silence.
      if (process.env.NODE_ENV === 'production') {
        console.error(
          `[rate-limit] ${prefix}: UPSTASH_REDIS_REST_URL/TOKEN not configured — ` +
          'rate limiting is DISABLED for this endpoint.'
        )
      }
      return null
    }
    return new Ratelimit({ redis: new Redis({ url, token }), limiter, analytics: true, prefix })
  } catch (err) {
    console.error(`[rate-limit] ${prefix}: failed to initialise, rate limiting DISABLED:`, err)
    return null
  }
}

export const leadFormLimiter = makeLimiter('rl:lead', Ratelimit.slidingWindow(5, '1 h'))
export const adminLoginLimiter = makeLimiter('rl:admin-login', Ratelimit.slidingWindow(10, '15 m'))
