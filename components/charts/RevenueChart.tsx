"use client";

import { useEffect, useRef } from "react";
import {
	axis,
	bindResponsiveChart,
	bindThemeRepaint,
	type ChartLike,
	cardBg,
	labelColor,
	MONTHS,
	tooltipBase,
	valueAxis,
} from "@/components/charts/chart-utils";

type RangeKey = "year" | "month";

const ranges: Record<
	RangeKey,
	{ categories: readonly string[]; data: number[] }
> = {
	month: {
		categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
		data: [42, 55, 48, 67],
	},
	year: {
		categories: MONTHS,
		data: [58, 60, 66, 68, 59, 52, 51, 49, 41, 72, 108, 106],
	},
};

export function RevenueChart() {
	const chartRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let disposed = false;
		let chart: ChartLike | null = null;
		let current = ranges.year;
		let cleanupResize: (() => void) | undefined;
		let cleanupTheme: (() => void) | undefined;
		const buttonCleanups: Array<() => void> = [];

		async function init() {
			const [
				echarts,
				{ LineChart },
				{
					GridComponent,
					TooltipComponent,
					LegendComponent,
					MarkLineComponent,
					MarkPointComponent,
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
				LineChart,
				GridComponent,
				TooltipComponent,
				LegendComponent,
				MarkLineComponent,
				MarkPointComponent,
				VisualMapComponent,
				CanvasRenderer,
			]);

			const element = chartRef.current;
			if (!element || disposed) return;

			const grad = (start: string, end: string) =>
				new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{ color: start, offset: 0 },
					{ color: end, offset: 1 },
				]);
			const grad2 = (start: string, end: string) =>
				new echarts.graphic.LinearGradient(0, 0, 1, 0, [
					{ color: start, offset: 0 },
					{ color: end, offset: 1 },
				]);

			chart = echarts.init(element, null, { renderer: "canvas" }) as ChartLike;

			const paint = () => {
				chart?.setOption(
					{
						grid: {
							bottom: 26,
							containLabel: false,
							left: 44,
							right: 0,
							top: 24,
						},
						series: [
							{
								areaStyle: {
									color: grad("rgba(33,90,218,0.3)", "rgba(33,90,218,0.01)"),
								},
								data: current.data,
								emphasis: { focus: "series", scale: 1.6 },
								itemStyle: {
									borderColor: cardBg(),
									borderWidth: 2,
									color: "#215ada",
								},
								lineStyle: {
									color: grad2("#215ada", "#215ada"),
									shadowBlur: 14,
									shadowColor: "rgba(33,90,218,0.35)",
									shadowOffsetY: 8,
									width: 3.5,
								},
								markLine: {
									data: [{ type: "average" }],
									label: {
										color: labelColor(),
										fontFamily: "Cabin",
										fontSize: 11,
										formatter: (params: { value: number }) =>
											`Avg $${params.value}`,
										position: "insideEndTop",
									},
									lineStyle: {
										color: document.documentElement.classList.contains("dark")
											? "#64748b"
											: "#cbd5e1",
										type: "dashed",
										width: 1,
									},
									silent: true,
									symbol: "none",
								},
								markPoint: {
									data: [{ type: "max" }],
									itemStyle: {
										borderColor: cardBg(),
										borderWidth: 2,
										color: "#215ada",
									},
									label: {
										color: "#215ada",
										fontFamily: "Cabin",
										fontSize: 11,
										fontWeight: 600,
										formatter: (params: { value: [number, number] }) =>
											`${params.value[1]}k`,
										position: "top",
									},
									symbol: "circle",
									symbolSize: 9,
								},
								name: "Revenue",
								showSymbol: false,
								smooth: true,
								symbol: "circle",
								symbolSize: 9,
								type: "line",
							},
						],
						tooltip: {
							...tooltipBase("axis"),
							axisPointer: {
								label: { show: false },
								lineStyle: {
									color: "#215ada",
									type: "dashed",
									width: 1,
								},
								type: "line",
							},
							valueFormatter: (value: number) => `$${value}k`,
						},
						xAxis: { ...axis(current.categories), axisPointer: { snap: true } },
						yAxis: valueAxis({
							axisLabel: {
								formatter: (value: number | string) => `$${value}`,
							},
						}),
					},
					{ notMerge: true },
				);
			};

			paint();
			cleanupResize = bindResponsiveChart(chart, element);
			cleanupTheme = bindThemeRepaint(paint);

			const revenueToggle = document.querySelector("[data-revenue-toggle]");
			const buttons = Array.from(
				revenueToggle?.querySelectorAll<HTMLButtonElement>("[data-range]") ??
					[],
			);

			buttons.forEach((button) => {
				const onClick = () => {
					const range = button.dataset.range as RangeKey | undefined;
					if (!range || !ranges[range]) return;

					current = ranges[range];
					buttons.forEach((item) => {
						const active = item === button;
						item.classList.toggle("bg-surface-card", active);
						item.classList.toggle("text-brand-600", active);
						item.classList.toggle("shadow-card", active);
					});
					paint();
				};

				button.addEventListener("click", onClick);
				buttonCleanups.push(() => button.removeEventListener("click", onClick));
			});
		}

		init();

		return () => {
			disposed = true;
			buttonCleanups.forEach((cleanup) => {
				cleanup();
			});
			cleanupResize?.();
			cleanupTheme?.();
			chart?.dispose();
		};
	}, []);

	return (
		<div
			aria-label="Revenue report chart"
			className="mt-7 min-h-[312px] w-full min-w-0 overflow-hidden"
			id="revenueChart"
			role="img"
			ref={chartRef}
		/>
	);
}
