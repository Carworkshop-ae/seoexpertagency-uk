import * as Sentry from '@sentry/nextjs'

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn && dsn.startsWith('http')) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    enabled: process.env.NODE_ENV === 'production',
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
