"use client";

import { useEffect, useRef } from "react";
import {
	bindResponsiveChart,
	bindThemeRepaint,
	type ChartLike,
	cardBg,
	labelColor,
	tooltipBase,
} from "@/components/charts/chart-utils";

export function VisitorsChart() {
	const chartRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let disposed = false;
		let chart: ChartLike | null = null;
		let cleanupResize: (() => void) | undefined;
		let cleanupTheme: (() => void) | undefined;

		async function init() {
			const [
				echarts,
				{ PieChart },
				{ TooltipComponent, LegendComponent },
				{ CanvasRenderer },
			] = await Promise.all([
				import("echarts/core"),
				import("echarts/charts"),
				import("echarts/components"),
				import("echarts/renderers"),
			]);

			echarts.use([
				PieChart,
				TooltipComponent,
				LegendComponent,
				CanvasRenderer,
			]);

			const element = chartRef.current;
			if (!element || disposed) return;

			chart = echarts.init(element, null, { renderer: "canvas" }) as ChartLike;

			const paint = () => {
				chart?.setOption({
					legend: {
						bottom: 0,
						icon: "circle",
						itemGap: 16,
						itemHeight: 9,
						itemWidth: 9,
						textStyle: {
							color: labelColor(),
							fontFamily: "Cabin",
							fontSize: 12,
						},
					},
					series: [
						{
							avoidLabelOverlap: true,
							center: ["50%", "44%"],
							data: [
								{
									itemStyle: { color: "#24bd25" },
									name: "The Passersby",
									value: 42,
								},
								{
									itemStyle: { color: "#f5b24f" },
									name: "The Occasionals",
									value: 28,
								},
								{
									itemStyle: { color: "#9061f9" },
									name: "The Regulars",
									value: 18,
								},
								{
									itemStyle: { color: "#426de0" },
									name: "The Superfans",
									value: 12,
								},
							],
							itemStyle: {
								borderColor: cardBg(),
								borderRadius: 8,
								borderWidth: 3,
							},
							label: { show: false },
							labelLine: { show: false },
							radius: ["60%", "82%"],
							type: "pie",
						},
					],
					tooltip: { ...tooltipBase("item"), formatter: "{b}: {c} ({d}%)" },
				});
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
			aria-label="Visitors chart"
			className="min-h-[260px] w-full min-w-0 overflow-hidden"
			id="visitorsChart"
			role="img"
			ref={chartRef}
		/>
	);
}
