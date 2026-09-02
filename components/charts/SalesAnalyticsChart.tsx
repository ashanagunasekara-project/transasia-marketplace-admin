"use client";

import { useEffect, useRef } from "react";
import {
	axis,
	bindResponsiveChart,
	bindThemeRepaint,
	type ChartLike,
	labelColor,
	splitColor,
	tooltipBase,
	valueAxis,
} from "@/components/charts/chart-utils";

export type SalesMode = "2d" | "3d";

export type SalesAnalyticsChartProps = {
	onModeResolved?: (mode: SalesMode) => void;
	selectedMode: SalesMode;
};

type EChartsNamespace = {
	init: (
		element: HTMLElement,
		theme?: string | null,
		options?: { renderer?: "canvas" },
	) => ChartLike;
	use?: (extensions: unknown[]) => void;
};

const cats = ["Grocery", "Bakery", "Drinks", "Snacks", "Dairy", "Frozen"];
const quarters = ["Q1", "Q2", "Q3", "Q4"];
const quarterColors = ["#0da487", "#426de0", "#9061f9", "#ff8a3d"];

const val = (x: number, y: number) => 20 + ((x * 7 + y * 13 + x * y * 3) % 80);

const data3D: Array<[number, number, number]> = [];
let max3D = 0;
cats.forEach((_, x) => {
	quarters.forEach((__, y) => {
		const value = val(x, y);
		data3D.push([x, y, value]);
		if (value > max3D) max3D = value;
	});
});

export function SalesAnalyticsChart({
	onModeResolved,
	selectedMode,
}: SalesAnalyticsChartProps) {
	const chartRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let disposed = false;
		let chart: ChartLike | null = null;
		let mode: SalesMode = selectedMode;
		let coreLib: EChartsNamespace | null = null;
		let fullLib: EChartsNamespace | null = null;
		let glFailed = false;
		let cleanupResize: (() => void) | undefined;
		let cleanupTheme: (() => void) | undefined;

		async function loadCore() {
			if (coreLib) return coreLib;
			const [
				echarts,
				{ BarChart },
				{
					GridComponent,
					TooltipComponent,
					LegendComponent,
					VisualMapComponent,
				},
				{ CanvasRenderer },
			] = await Promise.all([
				import("echarts/core"),
				import("echarts/charts"),
				import("echarts/components"),
				import("echarts/renderers"),
			]);

			echarts.use([
				BarChart,
				GridComponent,
				TooltipComponent,
				LegendComponent,
				VisualMapComponent,
				CanvasRenderer,
			]);
			coreLib = echarts as EChartsNamespace;
			return coreLib;
		}

		async function loadFullGl() {
			if (fullLib || glFailed) return fullLib;
			try {
				const echartsFull = await import("echarts");
				await import("echarts-gl");
				fullLib = echartsFull as EChartsNamespace;
			} catch {
				glFailed = true;
				fullLib = null;
			}
			return fullLib;
		}

		function paint2D() {
			chart?.setOption(
				{
					color: quarterColors,
					grid: {
						bottom: 28,
						containLabel: false,
						left: 44,
						right: 12,
						top: 34,
					},
					legend: {
						data: quarters,
						icon: "roundRect",
						itemGap: 14,
						itemHeight: 8,
						itemWidth: 12,
						right: 0,
						show: true,
						textStyle: {
							color: labelColor(),
							fontFamily: "Cabin",
							fontSize: 12,
						},
						top: 0,
					},
					series: quarters.map((quarter, y) => ({
						barMaxWidth: 14,
						data: cats.map((_, x) => val(x, y)),
						emphasis: { focus: "series" },
						itemStyle: { borderRadius: [4, 4, 0, 0] },
						name: quarter,
						type: "bar",
					})),
					tooltip: {
						...tooltipBase("axis"),
						axisPointer: { type: "shadow" },
						valueFormatter: (value: number) => `$${value}k`,
					},
					xAxis: { ...axis(cats), boundaryGap: true },
					yAxis: valueAxis({
						axisLabel: {
							formatter: (value: number | string) => `$${value}`,
						},
					}),
				},
				{ notMerge: true },
			);
		}

		function paint3D() {
			chart?.setOption(
				{
					grid3D: {
						axisLine: { lineStyle: { color: splitColor() } },
						axisPointer: { lineStyle: { color: "#0da487" } },
						boxDepth: 65,
						boxWidth: 110,
						environment: "auto",
						light: {
							ambient: { intensity: 0.35 },
							main: {
								alpha: 30,
								beta: 40,
								intensity: 1.3,
								shadow: true,
								shadowQuality: "medium",
							},
						},
						splitLine: { lineStyle: { color: splitColor() } },
						viewControl: {
							alpha: 22,
							autoRotate: true,
							autoRotateSpeed: 9,
							beta: 35,
							distance: 200,
						},
					},
					series: [
						{
							bevelSize: 0.35,
							bevelSmoothness: 4,
							data: data3D,
							emphasis: {
								itemStyle: { color: "#ff4c1a" },
								label: { show: false },
							},
							itemStyle: { opacity: 0.96 },
							shading: "lambert",
							type: "bar3D",
						},
					],
					tooltip: {
						...tooltipBase("item"),
						formatter: (params: { value: [number, number, number] }) =>
							`${cats[params.value[0]]} \u00b7 ${quarters[params.value[1]]}<br/><b>$${params.value[2]}k</b>`,
					},
					visualMap: {
						inRange: { color: ["#22c3a6", "#426de0", "#9061f9", "#ff4c1a"] },
						max: max3D,
						min: 0,
						show: false,
					},
					xAxis3D: {
						axisLabel: { color: labelColor() },
						data: cats,
						nameTextStyle: { color: labelColor() },
						type: "category",
					},
					yAxis3D: {
						axisLabel: { color: labelColor() },
						data: quarters,
						type: "category",
					},
					zAxis3D: {
						axisLabel: { color: labelColor() },
						type: "value",
					},
				},
				{ notMerge: true },
			);
		}

		function paintSales() {
			if (mode === "3d") {
				paint3D();
				return;
			}
			paint2D();
		}

		async function renderSales(nextMode: SalesMode) {
			const element = chartRef.current;
			if (!element || disposed) return;

			let lib = await loadCore();
			let resolvedMode = nextMode;
			if (nextMode === "3d") {
				const glLib = await loadFullGl();
				if (glLib) {
					lib = glLib;
				} else {
					resolvedMode = "2d";
				}
			}

			mode = resolvedMode;
			chart?.dispose();
			chart = lib.init(element, null, { renderer: "canvas" });
			paintSales();

			onModeResolved?.(resolvedMode);

			const hint = document.querySelector("[data-sales-hint]");
			if (hint) {
				hint.textContent =
					resolvedMode === "3d"
						? "Revenue by category across quarters \u2014 drag to rotate."
						: "Revenue by category, grouped by quarter.";
			}

			cleanupResize?.();
			cleanupResize = bindResponsiveChart(chart, element);
		}

		renderSales(mode);
		cleanupTheme = bindThemeRepaint(paintSales);

		return () => {
			disposed = true;
			cleanupResize?.();
			cleanupTheme?.();
			chart?.dispose();
		};
	}, [selectedMode, onModeResolved]);

	return (
		<div
			aria-label="Sales analytics chart"
			className="h-[360px] w-full min-w-0 overflow-hidden bg-brand-50/50"
			id="sales3DChart"
			role="img"
			ref={chartRef}
		/>
	);
}
