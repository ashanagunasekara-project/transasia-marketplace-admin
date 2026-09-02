import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";
import { baseURL } from "@/utils/cn";

const detailCards = [
	{
		items: [
			["calendar", "Date Added", "17/06/2026"],
			["credit-card", "Payment Method", "Online · VISA"],
			["truck", "Shipping Method", "Flat Shipping Rate"],
		],
		title: "Order Details (#14534)",
	},
	{
		items: [
			["user", "Customer", "Dan Wilson"],
			["mail", "Email", "dam@consulting.com"],
			["phone", "Phone", "+6141 234 567"],
		],
		title: "Customer Details",
	},
	{
		items: [
			["file-text", "Invoice", "#INV-000414"],
			["package", "Shipping", "#SHP-0025410"],
			["gift", "Reward Points", "600"],
		],
		title: "Documents",
	},
];

const items = [
	{
		image: `${baseURL}assets/images/products/organic-food-a-01.webp`,
		name: "Product 1",
		qty: 2,
		sku: "02355002",
		total: "$240.00",
		unit: "$120.00",
	},
	{
		image: `${baseURL}assets/images/products/bakery-product-img-02.webp`,
		name: "Footwear",
		qty: 1,
		sku: "03884004",
		total: "$24.00",
		unit: "$24.00",
	},
];

export function OrderDetail() {
	return (
		<>
			<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
				<div>
					<Breadcrumb
						items={[
							{ href: routes.dashboard, label: "Home" },
							{ href: routes.orders, label: "Orders" },
							{ label: "Order Details" },
						]}
					/>
					<div className="flex items-center gap-6">
						<button
							className="border-b-2 border-brand-600 pb-1 text-[15px] font-semibold text-brand-600"
							type="button"
						>
							Order Summary
						</button>
						<button
							className="pb-1 text-[15px] font-medium text-ink-500 hover:text-ink-900"
							type="button"
						>
							Order History
						</button>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<Link
						aria-label="Back to orders"
						className="grid h-11 w-11 place-items-center rounded-base border border-surface-line text-ink-700 hover:bg-surface-muted"
						href={routes.orders}
					>
						<Icon className="h-4 w-4" name="arrow-left" />
					</Link>
					<Link
						className="inline-flex h-11 items-center gap-2 rounded-base bg-success-600 px-4 text-[14px] font-semibold text-white hover:bg-success-700"
						href={routes.editOrder}
					>
						<Icon className="h-4 w-4" name="pencil" />
						Edit Order
					</Link>
					<Link
						className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						href={routes.addOrder}
					>
						<Icon className="h-4 w-4" name="plus" />
						Add New Order
					</Link>
				</div>
			</div>
			<section className="grid gap-6 lg:grid-cols-3">
				{detailCards.map((card) => (
					<article
						className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card"
						key={card.title}
					>
						<h2 className="mb-4 text-[18px] font-semibold text-ink-900">
							{card.title}
						</h2>
						<dl className="space-y-3 text-[14px]">
							{card.items.map(([icon, label, value]) => (
								<div
									className="flex items-center justify-between gap-3"
									key={label}
								>
									<dt className="flex items-center gap-2 text-ink-500">
										<Icon className="h-4 w-4 text-ink-400" name={icon} />
										{label}
									</dt>
									<dd className="font-medium text-ink-900">{value}</dd>
								</div>
							))}
						</dl>
					</article>
				))}
			</section>
			<section className="mt-6 grid gap-6 lg:grid-cols-2">
				{["Billing Address", "Shipping Address"].map((title) => (
					<article
						className="relative overflow-hidden rounded-card border border-surface-line bg-surface-card p-6 shadow-card"
						key={title}
					>
						<Icon
							className="pointer-events-none absolute bottom-2 right-2 h-28 w-28 text-surface-line/70"
							name={title === "Billing Address" ? "credit-card" : "truck"}
						/>
						<h2 className="mb-3 text-[18px] font-semibold text-ink-900">
							{title}
						</h2>
						<address className="text-[14px] not-italic leading-relaxed text-ink-600">
							Unit 1/23 Hastings Road,
							<br />
							Melbourne 3000,
							<br />
							Victoria,
							<br />
							Australia.
						</address>
					</article>
				))}
			</section>
			<section className="mt-6 rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
				<h2 className="mb-5 text-[18px] font-semibold text-ink-900">
					Order #14534
				</h2>
				<div className="dashboard-scrollbar overflow-x-auto">
					<table className="w-full min-w-[680px] text-left">
						<thead>
							<tr className="border-b border-surface-line text-[13px] uppercase text-ink-400">
								<th className="pb-3 pr-4 font-semibold">Product</th>
								<th className="pb-3 pr-4 font-semibold">SKU</th>
								<th className="pb-3 pr-4 text-right font-semibold">Qty</th>
								<th className="pb-3 pr-4 text-right font-semibold">
									Unit Price
								</th>
								<th className="pb-3 text-right font-semibold">Total</th>
							</tr>
						</thead>
						<tbody className="text-[14px]">
							{items.map((item) => (
								<tr className="border-b border-surface-line" key={item.sku}>
									<td className="py-4 pr-4">
										<div className="flex items-center gap-3">
											<Image
												alt={item.name}
												className="h-11 w-11 rounded-base object-cover"
												height={44}
												src={item.image}
												width={44}
											/>
											<div>
												<p className="font-semibold text-ink-900">
													{item.name}
												</p>
												<p className="mt-0.5 text-[13px] text-ink-400">
													Delivery Date: 17/06/2026
												</p>
											</div>
										</div>
									</td>
									<td className="py-4 pr-4 text-ink-700">{item.sku}</td>
									<td className="py-4 pr-4 text-right text-ink-700">
										{item.qty}
									</td>
									<td className="py-4 pr-4 text-right text-ink-700">
										{item.unit}
									</td>
									<td className="py-4 text-right font-semibold text-ink-900">
										{item.total}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className="mt-5 flex justify-end">
					<dl className="w-full max-w-xs space-y-3 text-[14px]">
						{[
							["Subtotal", "$264.00"],
							["VAT (0%)", "$0.00"],
							["Shipping Rate", "$5.00"],
						].map(([label, value]) => (
							<div className="flex items-center justify-between" key={label}>
								<dt className="text-ink-500">{label}</dt>
								<dd className="font-medium text-ink-900">{value}</dd>
							</div>
						))}
						<div className="flex items-center justify-between border-t border-surface-line pt-3">
							<dt className="text-[15px] font-semibold text-ink-900">
								Grand Total
							</dt>
							<dd className="text-[18px] font-semibold text-ink-900">
								$269.00
							</dd>
						</div>
					</dl>
				</div>
			</section>
		</>
	);
}
