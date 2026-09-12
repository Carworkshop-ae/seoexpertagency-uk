import * as Sentry from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { checkRequiredEnvVars } = await import('@/lib/startup-check')
    checkRequiredEnvVars()
  }

  const dsn = process.env.SENTRY_DSN
  if (!dsn || !dsn.startsWith('http')) return

  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      enabled: process.env.NODE_ENV === 'production',
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.1,
      enabled: process.env.NODE_ENV === 'production',
    })
  }
}

export const onRequestError = Sentry.captureRequestError
