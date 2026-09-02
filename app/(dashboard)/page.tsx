import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CategoryScroller } from "@/components/dashboard/category-scroller";
import {
	EarningChart,
	RevenueChart,
	VisitorsChart,
} from "@/components/dashboard/charts";
import {
	BestSellingProductsTable,
	RecentOrdersTable,
} from "@/components/dashboard/dashboard-tables";
import { SalesAnalyticsPanel } from "@/components/dashboard/sales-analytics-panel";
import { TodoList } from "@/components/dashboard/todo-list";
import { StatCard } from "@/components/layout/dashboard-widgets";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";
import {
	dashboardCategories,
	dashboardStats,
	recentOrders,
	topCategories,
	topProducts,
	transactions,
} from "@/data/dashboard/data";
import { baseURL } from "@/utils/cn";

export const metadata: Metadata = {
	title: "Dashboard",
};

export default function DashboardPage() {
	return (
		<>
			<DashboardHeader />
			<HeroBanner />
			<section
				aria-label="Dashboard metrics"
				className="grid gap-3 md:gap-4 lg:gap-6 md:grid-cols-2 xl:grid-cols-4"
			>
				{dashboardStats.map((stat) => (
					<StatCard key={stat.label} {...stat} />
				))}
			</section>
			<CategoryScroller categories={dashboardCategories} />
			<section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(520px,0.95fr)]">
				<RevenueReport />
				<BestSellingProductsTable products={topProducts} />
			</section>
			<section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
				<SalesAnalyticsPanel />
				<TopCategories />
			</section>
			<section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(480px,0.9fr)]">
				<RecentOrdersTable orders={recentOrders} />
				<Earning />
			</section>
			<section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
				<Transactions />
				<Visitors />
				<TodoList />
			</section>
		</>
	);
}

function DashboardHeader() {
	return (
		<div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-center lg:justify-between lg:text-left">
			<div>
				<h1 className="text-[20px] font-semibold text-ink-900 lg:text-[24px]">
					{"Welcome back, Emay \u{1f44b}"}
				</h1>
				<p className="mt-1 text-[14px] text-ink-500">
					Here&apos;s what&apos;s happening in your store today.
				</p>
			</div>
			<div className="flex items-center gap-2">
				<button
					className="inline-flex h-11 items-center gap-2 rounded-base border border-surface-line px-4 text-[14px] font-semibold text-ink-700 transition-colors hover:bg-surface-muted cursor-pointer"
					type="button"
				>
					<Icon className="h-4 w-4" name="download" />
					Export
				</button>
				<Link
					className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700"
					href={routes.addProduct}
				>
					<Icon className="h-4 w-4" name="plus" />
					Add Product
				</Link>
			</div>
		</div>
	);
}

function HeroBanner() {
	return (
		<div className="mb-6">
			<Link
				className="inline-flex w-full items-center gap-2 overflow-hidden rounded-base"
				href={routes.products}
			>
				<Image
					alt="Unimart product promotion"
					className="h-auto w-full object-cover"
					height={288}
					priority
					sizes="(min-width: 1024px) calc(100vw - 326px), calc(100vw - 32px)"
					src={`${baseURL}assets/images/banner/main-banner-01.webp`}
					width={1856}
					unoptimized
				/>
			</Link>
		</div>
	);
}

function RevenueReport() {
	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<h2 className="text-[20px] font-medium text-ink-900">Revenue Report</h2>
				<div
					className="flex rounded-base border border-surface-line bg-surface-body p-1 text-[13px] font-semibold text-ink-500"
					data-revenue-toggle
				>
					<button
						className="rounded-base bg-surface-card px-3 py-1 text-brand-600 shadow-card"
						data-range="year"
						type="button"
					>
						Year
					</button>
					<button
						className="rounded-base px-3 py-1 hover:text-ink-900"
						data-range="month"
						type="button"
					>
						Month
					</button>
				</div>
			</div>
			<RevenueChart />
		</article>
	);
}

function TopCategories() {
	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div>
					<h2 className="text-[20px] font-medium text-ink-900">
						Top Categories
					</h2>
					<p className="mt-1 text-[13px] text-ink-400">
						Share of revenue this month.
					</p>
				</div>
				<Link
					className="text-[14px] font-semibold text-brand-600 hover:text-brand-700"
					href={routes.categories}
				>
					View all
				</Link>
			</div>
			<ul className="space-y-5">
				{topCategories.map((category) => (
					<li key={category.label}>
						<div className="mb-1.5 flex items-center justify-between text-[14px]">
							<span className="flex items-center gap-2 font-medium text-ink-900">
								<span
									className={`h-2.5 w-2.5 rounded-full ${category.colorClass}`}
								/>
								{category.label}
							</span>
							<span className="text-ink-500">
								{category.value} {"\u00b7"} {category.percent}%
							</span>
						</div>
						<div className="h-2 w-full overflow-hidden rounded-full bg-surface-muted">
							<span
								className={`block h-full rounded-full ${category.colorClass}`}
								style={{ width: `${category.percent}%` }}
							/>
						</div>
					</li>
				))}
			</ul>
			<div className="mt-6 flex items-center justify-between border-t border-surface-line pt-4 text-[14px]">
				<span className="text-ink-500">Total revenue</span>
				<span className="text-[18px] font-semibold text-ink-900">$65.2k</span>
			</div>
		</article>
	);
}

function Earning() {
	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<h2 className="text-[20px] font-medium text-ink-900">Earning</h2>
			<EarningChart />
		</article>
	);
}

function Transactions() {
	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<h2 className="mb-4 text-[20px] font-medium text-ink-900">
				Transactions
			</h2>
			<ul className="space-y-4 text-[14px]">
				{transactions.map((transaction) => (
					<li className="flex items-center gap-3" key={transaction.label}>
						<span
							className={`grid h-10 w-10 place-items-center rounded-full ${transaction.iconClass}`}
						>
							<Icon className="h-5 w-5" name={transaction.icon} />
						</span>
						<span className="flex-1">
							<span className="block font-semibold text-ink-900">
								{transaction.label}
							</span>
							<span className="text-[13px] text-ink-400">
								{transaction.meta}
							</span>
						</span>
						<span className={`font-semibold ${transaction.amountClass}`}>
							{transaction.amount}
						</span>
					</li>
				))}
			</ul>
		</article>
	);
}

function Visitors() {
	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<h2 className="mb-2 text-[20px] font-medium text-ink-900">Visitors</h2>
			<VisitorsChart />
		</article>
	);
}
