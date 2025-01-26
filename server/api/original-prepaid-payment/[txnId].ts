export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	return await $fetch<{
		payUrl: string;
	}>(`/api/payments/${getRouterParam(event, "txnId")}/`, {
		baseURL: config.public.originalPrepaidPayment.url,
		method: "GET",
		headers: {
			"X-API-KEY": config.originalPrepaidPaymentApiKey,
		},
		responseType: "json",
	});
});
