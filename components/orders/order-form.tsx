"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
	Field,
	FormCard,
	SelectField,
} from "@/components/forms/admin-form-primitives";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";
import { orderProducts } from "@/data/admin/operations";
import { cn } from "@/utils/cn";

type OrderFormProps = {
	mode: "add" | "edit";
};

export function OrderForm({ mode }: OrderFormProps) {
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState<Set<string>>(
		mode === "edit" ? new Set(["Product 3", "Product 5"]) : new Set(),
	);
	const [sameAddress, setSameAddress] = useState(mode === "add");
	const visibleProducts = orderProducts.filter((product) =>
		product.name.toLowerCase().includes(query.toLowerCase()),
	);
	const total = useMemo(
		() =>
			orderProducts
				.filter((product) => selected.has(product.name))
				.reduce((sum, product) => sum + product.price, 0),
		[selected],
	);
	const title = mode === "edit" ? "Edit Order" : "Add Order";

	return (
		<>
			<div className="mb-6">
				<Breadcrumb
					items={[
						{ href: routes.dashboard, label: "Home" },
						{ href: routes.orders, label: "Orders" },
						{ label: title },
					]}
				/>
				<h1 className="text-[24px] font-semibold text-ink-900">{title}</h1>
			</div>
			<form
				className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]"
				id={`${mode}-order-form`}
			>
				<aside className="min-w-0">
					<FormCard title="Order Details">
						<div className="mb-5">
							<p className="text-[13px] font-semibold text-ink-700">Order ID</p>
							<p className="mt-1 text-[15px] font-semibold text-ink-900">
								{mode === "edit" ? "#12632" : "#12516"}
							</p>
						</div>
						<div className="space-y-5">
							<SelectField
								defaultValue={
									mode === "edit" ? "Credit Card (Visa)" : undefined
								}
								help="Set the payment method for the order."
								label="Payment Method"
								name="payment_method"
								options={[
									"Credit Card (Visa)",
									"PayPal",
									"Cash on Delivery",
									"Bank Transfer",
								]}
								required
							/>
							<SelectField
								defaultValue={mode === "edit" ? "Standard Rate" : undefined}
								help="Set the shipping method for the order."
								label="Shipping Method"
								name="shipping_method"
								options={[
									"Standard Rate",
									"Flat Shipping Rate",
									"Express Rate",
								]}
								required
							/>
							<Field
								defaultValue={mode === "edit" ? "2021-12-22" : undefined}
								help="Set the date of the order to process."
								label="Order Date"
								name="order_date"
								required
								type="date"
							/>
						</div>
					</FormCard>
				</aside>
				<div className="min-w-0 space-y-6">
					<FormCard title="Select Products">
						<p className="mt-1 text-[14px] text-ink-700">
							Add products to this order
						</p>
						{mode === "edit" ? (
							<div className="mt-4 grid gap-4 sm:grid-cols-2">
								{orderProducts
									.filter((product) => selected.has(product.name))
									.slice(0, 2)
									.map((product) => (
										<ProductPreview key={product.sku} product={product} />
									))}
							</div>
						) : (
							<p className="mt-1 text-[13px] text-ink-400">
								Select one or more products from the list below by ticking the
								checkbox.
							</p>
						)}
						<p className="mt-4 text-[15px] font-semibold text-ink-900">
							Total Cost: $ <span>{total.toFixed(2)}</span>
						</p>
						<label className="relative mt-5 block">
							<span className="sr-only">Search products</span>
							<Icon
								className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
								name="search"
							/>
							<input
								className="h-11 w-full rounded-base border border-surface-line bg-surface-body pl-11 pr-4 text-[14px] focus:border-brand-600"
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search Products"
								type="search"
								value={query}
							/>
						</label>
						<div className="dashboard-scrollbar mt-4 max-h-[360px] overflow-y-auto pr-1">
							<div className="sticky top-0 flex items-center justify-between border-b border-surface-line bg-surface-card pb-2 text-[13px] uppercase text-ink-400">
								<span className="font-semibold">Product</span>
								<span className="font-semibold">Qty Remaining</span>
							</div>
							{visibleProducts.map((product) => {
								const checked = selected.has(product.name);
								return (
									<label
										className={cn(
											"mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-base border border-surface-line bg-surface-body p-3",
											checked ? "border-brand-600 bg-brand-50/40" : "",
										)}
										key={product.sku}
									>
										<span className="flex items-center gap-3">
											<input
												checked={checked}
												className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
												onChange={(event) => {
													setSelected((current) => {
														const next = new Set(current);
														if (event.target.checked) {
															next.add(product.name);
														} else {
															next.delete(product.name);
														}
														return next;
													});
												}}
												type="checkbox"
											/>
											<Image
												alt={product.name}
												className="h-11 w-11 rounded-base bg-surface-card object-cover"
												height={44}
												src={product.image}
												width={44}
											/>
											<span>
												<span className="block font-semibold text-ink-900">
													{product.name}
												</span>
												<span className="text-[13px] text-ink-400">
													SKU: {product.sku} · ${product.price.toFixed(2)}
												</span>
											</span>
										</span>
										<span className="text-[13px] font-semibold text-ink-700">
											{product.qty}
										</span>
									</label>
								);
							})}
						</div>
						{visibleProducts.length === 0 ? (
							<p className="py-8 text-center text-[14px] text-ink-400">
								No products match your search.
							</p>
						) : null}
					</FormCard>
					<FormCard title="Delivery Details">
						<AddressFields
							prefix="billing"
							title="Billing Address"
							mode={mode}
						/>
						<label className="mt-5 flex items-center gap-2.5">
							<input
								checked={sameAddress}
								className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
								onChange={(event) => setSameAddress(event.target.checked)}
								type="checkbox"
							/>
							<span className="text-[14px] text-ink-700">
								Shipping address is the same as billing address
							</span>
						</label>
						{sameAddress ? null : (
							<AddressFields
								prefix="shipping"
								title="Shipping Address"
								mode={mode}
							/>
						)}
					</FormCard>
				</div>
			</form>
			<div className="mt-8 flex items-center justify-end gap-3 border-t border-surface-line pt-5">
				<Link
					className="inline-flex h-11 items-center gap-2 rounded-base border border-surface-line px-5 text-[14px] font-semibold text-ink-700 hover:bg-surface-muted"
					href={routes.orders}
				>
					Cancel
				</Link>
				<button
					className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700"
					form={`${mode}-order-form`}
					type="submit"
				>
					<Icon className="h-4 w-4" name="save" />
					Save Changes
				</button>
			</div>
		</>
	);
}

function ProductPreview({
	product,
}: {
	product: (typeof orderProducts)[number];
}) {
	return (
		<div className="flex items-center gap-3 rounded-base border border-surface-line bg-surface-body p-3">
			<Image
				alt={product.name}
				className="h-11 w-11 rounded-base object-cover"
				height={44}
				src={product.image}
				width={44}
			/>
			<div className="min-w-0">
				<p className="font-semibold text-ink-900">{product.name}</p>
				<p className="text-[13px] text-ink-400">
					Price: ${product.price.toFixed(2)}
				</p>
				<p className="text-[13px] text-ink-400">SKU: {product.sku}</p>
			</div>
		</div>
	);
}

function AddressFields({
	mode,
	prefix,
	title,
}: {
	mode: "add" | "edit";
	prefix: "billing" | "shipping";
	title: string;
}) {
	const isEdit = mode === "edit";
	return (
		<div className={prefix === "shipping" ? "mt-6" : ""}>
			<h3 className="mb-4 mt-5 text-[15px] font-semibold text-ink-900">
				{title}
			</h3>
			<div className="grid gap-5 sm:grid-cols-2">
				<Field
					defaultValue={
						isEdit
							? prefix === "billing"
								? "1/23 Hastings Road"
								: "20 Randy Road"
							: undefined
					}
					label="Address Line 1"
					name={`${prefix}_address1`}
					required={prefix === "billing"}
				/>
				<Field
					label="Address Line 2"
					name={`${prefix}_address2`}
					placeholder="Address Line 2"
				/>
			</div>
			<div className="mt-5 grid gap-5 sm:grid-cols-3">
				<Field
					defaultValue={isEdit ? "Melbourne" : undefined}
					label="City"
					name={`${prefix}_city`}
				/>
				<Field
					defaultValue={isEdit ? "3000" : undefined}
					label="Postcode"
					name={`${prefix}_postcode`}
					required={prefix === "billing"}
				/>
				<Field
					defaultValue={isEdit ? "Victoria" : undefined}
					label="State"
					name={`${prefix}_state`}
					required={prefix === "billing"}
				/>
			</div>
			<div className="mt-5">
				<SelectField
					defaultValue={isEdit ? "Australia" : undefined}
					label="Country"
					name={`${prefix}_country`}
					options={[
						"Australia",
						"United States",
						"United Kingdom",
						"Bangladesh",
						"India",
					]}
					required={prefix === "billing"}
				/>
			</div>
		</div>
	);
}
