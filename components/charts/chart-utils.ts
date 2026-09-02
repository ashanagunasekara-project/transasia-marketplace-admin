export const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
] as const;

export type ChartLike = {
	dispose: () => void;
	getDom: () => HTMLElement;
	resize: (options?: { width?: number; height?: number }) => void;
	setOption: (
		option: Record<string, unknown>,
		options?: { notMerge?: boolean },
	) => void;
};

export function isDarkMode() {
	return document.documentElement.classList.contains("dark");
}

export function labelColor() {
	return isDarkMode() ? "#94a3b8" : "#8a8a8a";
}

export function splitColor() {
	return isDarkMode() ? "rgba(148,163,184,0.14)" : "rgba(136,136,136,0.16)";
}

export function cardBg() {
	return isDarkMode() ? "#181d29" : "#ffffff";
}

export function tooltipBase(trigger: "axis" | "item") {
	return {
		backgroundColor: isDarkMode() ? "#0f131c" : "#ffffff",
		borderColor: isDarkMode() ? "#2f374a" : "#e6e6e6",
		borderWidth: 1,
		extraCssText: "border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,0.12);",
		padding: [8, 12],
		textStyle: {
			color: isDarkMode() ? "#cbd5e1" : "#333333",
			fontFamily: "Cabin",
			fontSize: 13,
		},
		trigger,
	};
}

export function axis(categories: readonly string[]) {
	return {
		axisLabel: { color: labelColor(), fontFamily: "Cabin" },
		axisLine: { show: false },
		axisTick: { show: false },
		boundaryGap: false,
		data: categories,
		type: "category",
	};
}

export function valueAxis(extra: Record<string, unknown> = {}) {
	const axisLabel =
		typeof extra.axisLabel === "object" && extra.axisLabel !== null
			? extra.axisLabel
			: {};

	return {
		...extra,
		axisLabel: {
			color: labelColor(),
			fontFamily: "Cabin",
			...axisLabel,
		},
		axisLine: { show: false },
		axisTick: { show: false },
		splitLine: { lineStyle: { color: splitColor(), type: "dashed" } },
		type: "value",
	};
}

export function bindResponsiveChart(chart: ChartLike, container: HTMLElement) {
	const resize = () => {
		if (container.clientWidth) {
			chart.resize({
				height: container.clientHeight,
				width: container.clientWidth,
			});
		}
	};

	let resizeObserver: ResizeObserver | undefined;
	if (typeof ResizeObserver !== "undefined") {
		resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(container);
	}

	window.addEventListener("resize", resize);
	window.addEventListener("load", resize);
	const timeouts = [50, 200, 500].map((delay) =>
		window.setTimeout(resize, delay),
	);

	return () => {
		timeouts.forEach((timeout) => {
			window.clearTimeout(timeout);
		});
		resizeObserver?.disconnect();
		window.removeEventListener("resize", resize);
		window.removeEventListener("load", resize);
	};
}

export function bindThemeRepaint(repaint: () => void) {
	const onThemeChange = () => repaint();
	window.addEventListener("themechange", onThemeChange);

	const observer = new MutationObserver(() => repaint());
	observer.observe(document.documentElement, {
		attributeFilter: ["class"],
		attributes: true,
	});

	return () => {
		window.removeEventListener("themechange", onThemeChange);
		observer.disconnect();
	};
}
