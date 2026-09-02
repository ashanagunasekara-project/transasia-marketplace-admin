"use client";

import { useMemo, useState } from "react";
import { CurrencyRatesTable } from "@/components/admin/operation-list-pages";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { currencyRates } from "@/data/admin/operations";

const languages = [
	{ label: "English", progress: "100%" },
	{ label: "Bangla", progress: "72%" },
	{ label: "Arabic", progress: "48%" },
];

const translationKeys = [
	{
		bangla: "Ponno",
		english: "Products",
		key: "nav.products",
		status: "Done",
		statusClass: "bg-success-50 text-success-600",
	},
	{
		bangla: "Missing",
		english: "Total",
		key: "checkout.total",
		status: "Review",
		statusClass: "bg-warning-50 text-warning-600",
	},
	{
		bangla: "Missing",
		english: "Apply coupon",
		key: "coupon.apply",
		status: "Draft",
		statusClass: "bg-surface-muted text-ink-600",
	},
];

export function TranslationPage() {
	const [query, setQuery] = useState("");
	const filteredKeys = useMemo(
		() =>
			translationKeys.filter((item) =>
				`${item.key} ${item.english} ${item.bangla}`
					.toLowerCase()
					.includes(query.toLowerCase()),
			),
		[query],
	);

	return (
		<>
			<PageHeader
				actions={
					<button
						className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						type="button"
					>
						<Icon className="h-4 w-4" name="plus" />
						Add Language
					</button>
				}
				description="Track storefront language coverage and translation progress."
				eyebrow="Localization"
				title="Translation"
			/>
			<section className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
				<aside className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card">
					<h2 className="mb-4 text-[17px] font-semibold text-ink-900">
						Languages
					</h2>
					<div className="space-y-2">
						{languages.map((language, index) => (
							<button
								className={
									index === 0
										? "flex w-full items-center justify-between rounded-base bg-brand-50 px-3 py-2 text-left text-[14px] font-semibold text-brand-600"
										: "flex w-full items-center justify-between rounded-base px-3 py-2 text-left text-[14px] text-ink-700 hover:bg-surface-muted"
								}
								key={language.label}
								type="button"
							>
								{language.label}
								<span className={index === 0 ? "" : "text-ink-400"}>
									{language.progress}
								</span>
							</button>
						))}
					</div>
				</aside>
				<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
					<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
						<h2 className="text-[17px] font-semibold text-ink-900">
							Translation Keys
						</h2>
						<label className="relative block min-w-[220px]">
							<span className="sr-only">Search translation keys</span>
							<Icon
								className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
								name="search"
							/>
							<input
								className="h-10 w-full rounded-base border border-surface-line bg-surface-body pl-10 pr-3 text-[14px] focus:border-brand-600"
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search keys"
								value={query}
							/>
						</label>
					</div>
					<div className="dashboard-scrollbar overflow-x-auto">
						<table className="w-full min-w-[680px] text-left text-[14px]">
							<thead className="border-b border-surface-line text-[13px] uppercase text-ink-400">
								<tr>
									<th className="pb-3 pr-4 font-semibold">Key</th>
									<th className="pb-3 pr-4 font-semibold">English</th>
									<th className="pb-3 pr-4 font-semibold">Bangla</th>
									<th className="pb-3 font-semibold">Status</th>
								</tr>
							</thead>
							<tbody>
								{filteredKeys.map((item) => (
									<tr className="border-b border-surface-line" key={item.key}>
										<td className="py-4 pr-4 font-semibold text-ink-900">
											{item.key}
										</td>
										<td className="py-4 pr-4 text-ink-700">{item.english}</td>
										<td className="py-4 pr-4 text-ink-700">{item.bangla}</td>
										<td className="py-4">
											<StatusBadge
												className={item.statusClass}
												label={item.status}
											/>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</article>
			</section>
		</>
	);
}

export function CurrencyRatesPage() {
	return (
		<>
			<PageHeader
				actions={
					<button
						className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						type="button"
					>
						<Icon className="h-4 w-4" name="refresh-ccw" />
						Sync Rates
					</button>
				}
				description="Manage exchange rates used for localized storefront pricing."
				eyebrow="Localization"
				title="Currency Rates"
			/>
			<CurrencyRatesTable rates={currencyRates} />
		</>
	);
}
