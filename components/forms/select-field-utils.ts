const FAKE_SELECT_OPTIONS = new Set([
	"Select an option",
	"Select category",
]);

export function sanitizeSelectOptions(options: string[]) {
	return options.filter((option) => !FAKE_SELECT_OPTIONS.has(option));
}

export function resolveSelectPlaceholder(
	label: string,
	placeholder?: string,
	defaultValue?: string,
	value?: string,
) {
	if (placeholder) {
		return placeholder;
	}

	if (defaultValue !== undefined || value !== undefined) {
		return undefined;
	}

	const trimmed = label.trim();
	if (/^select\b/i.test(trimmed)) {
		return trimmed;
	}

	return `Select ${trimmed.toLowerCase()}`;
}
