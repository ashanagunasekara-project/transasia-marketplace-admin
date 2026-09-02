export function formatCurrency(value: number, currency = "USD") {
	return new Intl.NumberFormat("en", {
		currency,
		style: "currency",
	}).format(value);
}
