"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { SalesAnalyticsChartProps } from "@/components/charts/SalesAnalyticsChart";

function ChartFallback({
	className,
	label,
}: {
	className: string;
	label: string;
}) {
	return (
		<div
			aria-label={label}
			className={`${className} animate-pulse rounded-base bg-surface-body`}
			role="img"
		/>
	);
}

export const RevenueChart = dynamic(
	() =>
		import("@/components/charts/RevenueChart").then((mod) => mod.RevenueChart),
	{
		loading: () => (
			<ChartFallback
				className="mt-7 min-h-[312px]"
				label="Revenue report chart"
			/>
		),
		ssr: false,
	},
);

export const SalesAnalyticsChart = dynamic(
	() =>
		import("@/components/charts/SalesAnalyticsChart").then(
			(mod) => mod.SalesAnalyticsChart,
		),
	{
		loading: () => (
			<ChartFallback
				className="h-[360px] w-full"
				label="Sales analytics chart"
			/>
		),
		ssr: false,
	},
) as ComponentType<SalesAnalyticsChartProps>;

export const EarningChart = dynamic(
	() =>
		import("@/components/charts/EarningsChart").then(
			(mod) => mod.EarningsChart,
		),
	{
		loading: () => (
			<ChartFallback className="mt-4 min-h-[300px]" label="Earning chart" />
		),
		ssr: false,
	},
);

export const VisitorsChart = dynamic(
	() =>
		import("@/components/charts/VisitorsChart").then(
			(mod) => mod.VisitorsChart,
		),
	{
		loading: () => (
			<ChartFallback className="min-h-[260px]" label="Visitors chart" />
		),
		ssr: false,
	},
);
