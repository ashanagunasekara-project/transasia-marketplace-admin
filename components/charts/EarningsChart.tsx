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

export function EarningsChart() {
	const chartRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let disposed = false;
		let chart: ChartLike | null = null;
		let cleanupResize: (() => void) | undefined;
		let cleanupTheme: (() => void) | undefined;

		async function init() {
			const [
				echarts,
				{ LineChart },
				{ GridComponent, TooltipComponent, LegendComponent },
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
				CanvasRenderer,
			]);

			const element = chartRef.current;
			if (!element || disposed) return;

			const grad = (start: string, end: string) =>
				new echarts.graphic.LinearGradient(0, 0, 0, 1, [
					{ color: start, offset: 0 },
					{ color: end, offset: 1 },
				]);

			chart = echarts.init(element, null, { renderer: "canvas" }) as ChartLike;

			const paint = () => {
				chart?.setOption(
					{
						color: ["#426de0", "#0da487"],
						grid: {
							bottom: 26,
							containLabel: false,
							left: 40,
							right: 0,
							top: 36,
						},
						legend: {
							data: ["This Year", "Last Year"],
							icon: "roundRect",
							itemGap: 18,
							itemHeight: 4,
							itemWidth: 14,
							right: 0,
							show: true,
							textStyle: {
								color: labelColor(),
								fontFamily: "Cabin",
								fontSize: 12,
							},
							top: 0,
						},
						series: [
							{
								areaStyle: {
									color: grad("rgba(66,109,224,0.18)", "rgba(66,109,224,0)"),
								},
								data: [85, 58, 73, 99, 52, 47, 62, 49, 51, 81, 45, 47],
								emphasis: { focus: "series", scale: 1.6 },
								itemStyle: { borderColor: cardBg(), borderWidth: 2 },
								lineStyle: {
									shadowBlur: 10,
									shadowColor: "rgba(66,109,224,0.30)",
									shadowOffsetY: 6,
									width: 3,
								},
								name: "This Year",
								showSymbol: false,
								smooth: true,
								symbol: "circle",
								symbolSize: 8,
								type: "line",
							},
							{
								areaStyle: {
									color: grad("rgba(13,164,135,0.18)", "rgba(13,164,135,0)"),
								},
								data: [62, 71, 48, 64, 79, 38, 44, 67, 33, 58, 70, 36],
								emphasis: { focus: "series", scale: 1.6 },
								itemStyle: { borderColor: cardBg(), borderWidth: 2 },
								lineStyle: {
									shadowBlur: 10,
									shadowColor: "rgba(13,164,135,0.30)",
									shadowOffsetY: 6,
									width: 3,
								},
								name: "Last Year",
								showSymbol: false,
								smooth: true,
								symbol: "circle",
								symbolSize: 8,
								type: "line",
							},
						],
						tooltip: {
							...tooltipBase("axis"),
							axisPointer: {
								lineStyle: {
									color: document.documentElement.classList.contains("dark")
										? "#64748b"
										: "#cbd5e1",
									type: "dashed",
									width: 1,
								},
								type: "line",
							},
							valueFormatter: (value: number) => `$${value}k`,
						},
						xAxis: axis(MONTHS),
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
		}

		init();

		return () => {
			disposed = true;
			cleanupResize?.();
			cleanupTheme?.();
			chart?.dispose();
		};
	}, []);

	return (
		<div
			aria-label="Earning chart"
			className="mt-4 min-h-[300px] w-full min-w-0 overflow-hidden"
			id="earningChart"
			role="img"
			ref={chartRef}
		/>
	);
}
