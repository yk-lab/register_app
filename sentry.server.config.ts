import * as Sentry from "@sentry/nuxt";

Sentry.init({
  // dsn: process.env.SENTRY_DSN,
  dsn: useRuntimeConfig().public.sentry.dsn,
  integrations: [Sentry.captureConsoleIntegration(), Sentry.extraErrorDataIntegration(),],
  // Tracing
  // We recommend adjusting this value in production, or using a tracesSampler for finer control.
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // LocalVariables
  // https://docs.sentry.io/platforms/javascript/guides/nuxt/configuration/integrations/localvariables/
  includeLocalVariables: true,
});