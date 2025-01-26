export const getFormattedPrice = (price: number) =>
	price.toLocaleString("ja-JP", {
		style: "currency",
		currency: "JPY",
	});
