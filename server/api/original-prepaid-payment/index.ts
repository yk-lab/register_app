import { createTransactionApiRequestSchema } from "~/schemas/create-transaction-api";
import type { Transaction } from "~/schemas/transaction";

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed',
    });
  }

  const config = useRuntimeConfig();

  const reqBody = createTransactionApiRequestSchema.parse(await readBody(event));

  const res = await $fetch<Transaction & {
    payUrl: string;
  }>('/api/orders/', {
    baseURL: config.public.originalPrepaidPayment.url,
    method: 'POST',
    headers: {
      'X-API-KEY': config.originalPrepaidPaymentApiKey,
    },
    responseType: 'json',
    body: reqBody,
  });

  if (!res.transactionId || !res.payUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: '不正なレスポンス形式です',
    });
  }

  return {
    transactionId: res.transactionId,
    url: res.payUrl,
  };
});
