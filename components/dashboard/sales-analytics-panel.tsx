"use client";

import { useState } from "react";
import { SalesAnalyticsChart } from "@/components/dashboard/charts";
import { AppSelect } from "@/components/ui/app-select";
import type { SalesMode } from "@/components/charts/SalesAnalyticsChart";

export function SalesAnalyticsPanel() {
	const [salesMode, setSalesMode] = useState<SalesMode>("3d");

	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-[20px] font-medium text-ink-900">Sales Analytics</h2>
					<p className="mt-1 text-[13px] text-ink-400" data-sales-hint>
						{salesMode === "3d"
							? "Revenue by category across quarters - drag to rotate."
							: "Revenue by category, grouped by quarter."}
					</p>
				</div>
				<label className="flex items-center gap-2 text-[14px] text-ink-700">
					<span className="sr-only">Sales chart view</span>
					<AppSelect
						className="w-[120px]"
						id="salesViewSelect"
						onValueChange={(value) => setSalesMode(value as SalesMode)}
						options={[
							{ label: "3D View", value: "3d" },
							{ label: "2D View", value: "2d" },
						]}
						size="sm"
						value={salesMode}
					/>
				</label>
			</div>
			<SalesAnalyticsChart onModeResolved={setSalesMode} selectedMode={salesMode} />
		</article>
	);
}
