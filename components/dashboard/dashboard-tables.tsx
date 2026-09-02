"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppSelect } from "@/components/ui/app-select";
import { routes } from "@/config/routes";
import type { recentOrders, topProducts } from "@/data/dashboard/data";

type Product = (typeof topProducts)[number];
type RecentOrder = (typeof recentOrders)[number];
type DashboardRange = "today" | "week" | "month";

type BestSellingProductsProps = {
	products: Product[];
};

type RecentOrdersProps = {
	orders: RecentOrder[];
};

const rangeLabels: Record<DashboardRange, string> = {
	month: "This Month",
	today: "Today",
	week: "This Week",
};

const rangeOptions = [
	{ label: rangeLabels.today, value: "today" },
	{ label: rangeLabels.week, value: "week" },
	{ label: rangeLabels.month, value: "month" },
] as const;

function moneyValue(value: string) {
	return Number(value.replace(/[$,]/g, ""));
}

function numberValue(value: string) {
	return Number(value.replace(/,/g, ""));
}

function orderIdValue(value: string) {
	return Number(value.replace("#", ""));
}

export function BestSellingProductsTable({
	products,
}: BestSellingProductsProps) {
	const [range, setRange] = useState<DashboardRange>("today");

	const sortedProducts = useMemo(() => {
		const next = [...products];

		if (range === "week") {
			return next.sort((a, b) => moneyValue(b.amount) - moneyValue(a.amount));
		}

		if (range === "month") {
			return next.sort((a, b) => moneyValue(b.price) - moneyValue(a.price));
		}

		return next.sort((a, b) => numberValue(b.orders) - numberValue(a.orders));
	}, [products, range]);

	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-line pb-4">
				<h2 className="text-[20px] font-medium text-ink-900">
					Best Selling Product
				</h2>
				<label className="flex items-center gap-2 text-[14px] text-ink-700">
					<span className="font-semibold text-ink-900">Sort By:</span>
					<AppSelect
						ariaLabel="Sort best selling products"
						className="w-[140px]"
						onValueChange={(value) => setRange(value as DashboardRange)}
						options={rangeOptions}
						size="sm"
						value={range}
					/>
				</label>
			</div>
			<div className="dashboard-scrollbar overflow-x-auto">
				<table className="w-full min-w-[650px] text-left">
					<thead className="sr-only">
						<tr>
							<th scope="col">Product</th>
							<th scope="col">Price</th>
							<th scope="col">Orders</th>
							<th scope="col">Stock</th>
							<th scope="col">Amount</th>
						</tr>
					</thead>
					<tbody>
						{sortedProducts.map((product) => (
							<ProductRow key={product.name} product={product} />
						))}
					</tbody>
				</table>
			</div>
		</article>
	);
}

function ProductRow({ product }: { product: Product }) {
	return (
		<tr className="border-b border-surface-line last:border-0 hover:bg-surface-body/70">
			<td className="py-4 pr-4">
				<div className="flex min-w-[210px] items-center gap-3">
					<Image
						alt={product.name}
						className="h-[68px] w-[68px] rounded-base bg-surface-body object-cover"
						height={68}
						src={product.image}
						width={68}
					/>
					<div>
						<Link
							className="font-semibold text-ink-900 hover:text-brand-600"
							href={routes.products}
						>
							{product.name}
						</Link>
						<p className="mt-1 text-[13px] text-ink-500">{product.date}</p>
					</div>
				</div>
			</td>
			<td className="py-4 pr-4">
				<span className="block text-[13px] font-semibold text-ink-900">
					Price
				</span>
				<span className="text-ink-700">{product.price}</span>
			</td>
			<td className="py-4 pr-4">
				<span className="block text-[13px] font-semibold text-ink-900">
					Orders
				</span>
				<span className="text-ink-700">{product.orders}</span>
			</td>
			<td className="py-4 pr-4">
				<span className="block text-[13px] font-semibold text-ink-900">
					Stock
				</span>
				<span className="text-ink-700">{product.stock}</span>
			</td>
			<td className="py-4">
				<span className="block text-[13px] font-semibold text-ink-900">
					Amount
				</span>
				<span className="text-ink-700">{product.amount}</span>
			</td>
		</tr>
	);
}

export function RecentOrdersTable({ orders }: RecentOrdersProps) {
	const [range, setRange] = useState<DashboardRange>("today");

	const sortedOrders = useMemo(() => {
		const next = [...orders];

		if (range === "week") {
			return next.sort((a, b) => a.payment.localeCompare(b.payment));
		}

		if (range === "month") {
			return next.sort((a, b) => a.status.localeCompare(b.status));
		}

		return next.sort((a, b) => orderIdValue(b.id) - orderIdValue(a.id));
	}, [orders, range]);

	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-line pb-4">
				<h2 className="text-[20px] font-medium text-ink-900">Recent Orders</h2>
				<label className="flex items-center gap-2 text-[14px] text-ink-700">
					<span className="font-semibold text-ink-900">Sort By:</span>
					<AppSelect
						ariaLabel="Sort recent orders"
						className="w-[140px]"
						onValueChange={(value) => setRange(value as DashboardRange)}
						options={rangeOptions}
						size="sm"
						value={range}
					/>
				</label>
			</div>
			<div className="dashboard-scrollbar overflow-x-auto">
				<table className="w-full min-w-[640px] text-left text-[14px]">
					<thead>
						<tr className="text-[13px] uppercase text-ink-400">
							<th className="py-3 pr-4 font-semibold" scope="col">
								Product
							</th>
							<th className="py-3 pr-4 font-semibold" scope="col">
								Date
							</th>
							<th className="py-3 pr-4 font-semibold" scope="col">
								Price
							</th>
							<th className="py-3 pr-4 font-semibold" scope="col">
								Status
							</th>
							<th className="py-3 font-semibold" scope="col">
								Payment
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedOrders.map((order) => (
							<OrderRow key={order.id} order={order} />
						))}
					</tbody>
				</table>
			</div>
		</article>
	);
}

function OrderRow({ order }: { order: RecentOrder }) {
	return (
		<tr className="border-t border-surface-line">
			<td className="py-3 pr-4">
				<p className="font-semibold text-ink-900">{order.name}</p>
				<p className="text-[13px] text-ink-400">{order.id}</p>
			</td>
			<td className="py-3 pr-4 text-ink-700">{order.date}</td>
			<td className="py-3 pr-4 text-ink-700">{order.price}</td>
			<td className={`py-3 pr-4 ${order.statusClass}`}>{order.status}</td>
			<td className={`py-3 font-semibold ${order.paymentClass}`}>
				{order.payment}
			</td>
		</tr>
	);
}
