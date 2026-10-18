"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/dashboard-widgets";
import {
	type AdminCart,
	type AdminCartItem,
	type AdminCartStats,
	fetchAbandonedCarts,
} from "@/lib/api";
import { cn } from "@/utils/cn";

type FilterTab = "all" | "regular" | "wholesale" | "guest";

interface CartsClientProps {
	initialCarts?: AdminCart[];
	initialStats?: AdminCartStats;
}

export function CartsClient({
	initialCarts = [],
	initialStats,
}: CartsClientProps) {
	const [carts, setCarts] = useState<AdminCart[]>(initialCarts);
	const [stats, setStats] = useState<AdminCartStats>(
		initialStats || {
			customerCarts: 0,
			guestCarts: 0,
			totalCarts: 0,
		},
	);
	const [activeTab, setActiveTab] = useState<FilterTab>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [selectedCart, setSelectedCart] = useState<AdminCart | null>(null);

	async function loadCarts() {
		setLoading(true);
		try {
			const res = await fetchAbandonedCarts({ limit: 50 });
			setCarts(res.carts);
			setStats(res.stats);
		} catch (error) {
			console.error("Failed to load carts:", error);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		if (initialCarts.length === 0) {
			loadCarts();
		}
	}, []);

	// Calculate total potential value in pipeline
	const totalPipelineValue = useMemo(() => {
		return carts.reduce((acc, c) => acc + (c.subtotal || 0), 0);
	}, [carts]);

	// Filtered list
	const filteredCarts = useMemo(() => {
		return carts.filter((c) => {
			// Tab filtering
			if (activeTab === "regular" && c.customerType !== "REGULAR") return false;
			if (activeTab === "wholesale" && c.customerType !== "WHOLESALE") return false;
			if (activeTab === "guest" && c.customerType !== "GUEST") return false;

			// Search filtering
			if (!searchQuery.trim()) return true;
			const q = searchQuery.toLowerCase();
			return (
				c.customerName.toLowerCase().includes(q) ||
				(c.phone && c.phone.toLowerCase().includes(q)) ||
				(c.email && c.email.toLowerCase().includes(q)) ||
				(c.businessName && c.businessName.toLowerCase().includes(q)) ||
				(c.wholesaleCustomerId && c.wholesaleCustomerId.toLowerCase().includes(q)) ||
				(c.sessionId && c.sessionId.toLowerCase().includes(q)) ||
				c.id.toLowerCase().includes(q)
			);
		});
	}, [carts, activeTab, searchQuery]);

	// Format currency helper
	function formatLKR(amount: number) {
		return `Rs. ${Number(amount || 0).toLocaleString("en-LK", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;
	}

	// Format relative or date time
	function formatTimeAgo(isoString: string) {
		try {
			const date = new Date(isoString);
			const now = new Date();
			const diffMs = now.getTime() - date.getTime();
			const diffMins = Math.floor(diffMs / 60000);
			const diffHours = Math.floor(diffMins / 60);
			const diffDays = Math.floor(diffHours / 24);

			if (diffMins < 1) return "Just now";
			if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
			if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
			if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

			return date.toLocaleDateString("en-US", {
				day: "numeric",
				month: "short",
				year: "numeric",
			});
		} catch {
			return isoString;
		}
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<PageHeader
				actions={
					<div className="flex items-center gap-3">
						<button
							onClick={loadCarts}
							disabled={loading}
							className="inline-flex h-11 items-center gap-2 rounded-base border border-surface-line bg-surface-card px-4 text-[14px] font-semibold text-ink-700 hover:bg-surface-body hover:text-ink-900 transition-colors shadow-sm disabled:opacity-50"
						>
							<Icon
								className={cn("h-4 w-4", loading && "animate-spin")}
								name="refresh-ccw"
							/>
							{loading ? "Refreshing..." : "Refresh Carts"}
						</button>
					</div>
				}
				description="Monitor high-intent customer shopping carts in real time, identify drop-offs, and recover sales opportunities."
				eyebrow="Sales Pipeline"
				title="Active & Abandoned Carts"
			/>

			{/* Metric Widgets */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					accentBorder="border-brand-500"
					badge="All Channels"
					badgeClass="bg-brand-50 text-brand-700"
					icon="shopping-cart"
					iconClass="bg-brand-50 text-brand-600"
					label="Total Active Carts"
					value={String(stats.totalCarts)}
				/>
				<StatCard
					accentBorder="border-blue-500"
					badge="Registered"
					badgeClass="bg-blue-50 text-blue-700"
					icon="users"
					iconClass="bg-blue-50 text-blue-600"
					label="Customer Carts"
					value={String(stats.customerCarts)}
				/>
				<StatCard
					accentBorder="border-amber-500"
					badge="Unregistered"
					badgeClass="bg-amber-50 text-amber-700"
					icon="user"
					iconClass="bg-amber-50 text-amber-600"
					label="Guest Shoppers"
					value={String(stats.guestCarts)}
				/>
				<StatCard
					accentBorder="border-emerald-500"
					badge="Potential Sales"
					badgeClass="bg-emerald-50 text-emerald-700"
					icon="dollar-sign"
					iconClass="bg-emerald-50 text-emerald-600"
					label="Pipeline Cart Value"
					value={formatLKR(totalPipelineValue)}
				/>
			</div>

			{/* Control Bar: Tabs & Search */}
			<div className="flex flex-col gap-4 rounded-card border border-surface-line bg-surface-card p-4 shadow-card md:flex-row md:items-center md:justify-between">
				{/* Filter Tabs */}
				<div className="flex flex-wrap items-center gap-1.5">
					<button
						onClick={() => setActiveTab("all")}
						className={cn(
							"px-3.5 py-1.5 rounded-base text-xs font-semibold transition-colors",
							activeTab === "all"
								? "bg-brand-600 text-white shadow-soft"
								: "text-ink-500 hover:bg-surface-body hover:text-ink-800",
						)}
					>
						All Carts ({carts.length})
					</button>
					<button
						onClick={() => setActiveTab("regular")}
						className={cn(
							"px-3.5 py-1.5 rounded-base text-xs font-semibold transition-colors",
							activeTab === "regular"
								? "bg-brand-600 text-white shadow-soft"
								: "text-ink-500 hover:bg-surface-body hover:text-ink-800",
						)}
					>
						Retail Customers ({carts.filter((c) => c.customerType === "REGULAR").length})
					</button>
					<button
						onClick={() => setActiveTab("wholesale")}
						className={cn(
							"px-3.5 py-1.5 rounded-base text-xs font-semibold transition-colors",
							activeTab === "wholesale"
								? "bg-brand-600 text-white shadow-soft"
								: "text-ink-500 hover:bg-surface-body hover:text-ink-800",
						)}
					>
						Wholesale B2B ({carts.filter((c) => c.customerType === "WHOLESALE").length})
					</button>
					<button
						onClick={() => setActiveTab("guest")}
						className={cn(
							"px-3.5 py-1.5 rounded-base text-xs font-semibold transition-colors",
							activeTab === "guest"
								? "bg-brand-600 text-white shadow-soft"
								: "text-ink-500 hover:bg-surface-body hover:text-ink-800",
						)}
					>
						Guests ({carts.filter((c) => c.customerType === "GUEST").length})
					</button>
				</div>

				{/* Search Input */}
				<div className="relative w-full md:w-80">
					<Icon
						className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400"
						name="search"
					/>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search customer, phone, or cart ID..."
						className="h-10 w-full pl-9 pr-4 rounded-base border border-surface-line bg-surface-body text-xs text-ink-800 placeholder:text-ink-400 focus:outline-none focus:border-brand-600 transition-colors"
					/>
				</div>
			</div>

			{/* Carts Table */}
			<div className="rounded-card border border-surface-line bg-surface-card shadow-card overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="border-b border-surface-line bg-surface-body/60 text-ink-400 font-semibold uppercase tracking-wider text-[11px]">
								<th className="py-3.5 px-4">Customer / Shopper</th>
								<th className="py-3.5 px-4">Account Type</th>
								<th className="py-3.5 px-4">Items Count</th>
								<th className="py-3.5 px-4">Cart Total (LKR)</th>
								<th className="py-3.5 px-4">Last Activity</th>
								<th className="py-3.5 px-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-surface-line">
							{filteredCarts.length === 0 ? (
								<tr>
									<td colSpan={6} className="py-12 text-center text-ink-400">
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface-body text-ink-300 mb-3">
											<Icon className="h-6 w-6" name="shopping-cart" />
										</div>
										<p className="font-semibold text-ink-600 text-sm">No shopping carts found</p>
										<p className="text-xs text-ink-400 mt-0.5">
											{searchQuery
												? "No carts matched your search criteria."
												: "There are currently no active shopping carts recorded."}
										</p>
									</td>
								</tr>
							) : (
								filteredCarts.map((cart) => {
									const isWholesale = cart.customerType === "WHOLESALE";
									const isGuest = cart.customerType === "GUEST";

									return (
										<tr
											key={cart.id}
											className="hover:bg-surface-body/50 transition-colors group"
										>
											{/* Customer Shopper Info */}
											<td className="py-4 px-4">
												<div className="flex items-center gap-3">
													<div
														className={cn(
															"grid h-9 w-9 shrink-0 place-items-center rounded-full font-bold text-xs uppercase",
															isWholesale
																? "bg-purple-100 text-purple-700"
																: isGuest
																	? "bg-amber-100 text-amber-700"
																	: "bg-blue-100 text-blue-700",
														)}
													>
														{cart.customerName[0] || "?"}
													</div>
													<div className="min-w-0">
														<p className="font-bold text-ink-800 text-xs truncate max-w-[200px]">
															{cart.customerName}
														</p>
														<div className="flex items-center gap-2 text-[11px] text-ink-400 font-mono mt-0.5">
															{cart.phone ? (
																<span>{cart.phone}</span>
															) : (
																<span className="text-ink-400 italic">
																	Session: {cart.sessionId?.slice(0, 12)}...
																</span>
															)}
															{cart.email && (
																<>
																	<span>•</span>
																	<span className="truncate max-w-[140px] font-sans">
																		{cart.email}
																	</span>
																</>
															)}
														</div>
													</div>
												</div>
											</td>

											{/* Account Type */}
											<td className="py-4 px-4">
												{isWholesale ? (
													<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
														<Icon className="h-3 w-3" name="shield-check" />
														Wholesale B2B
														{cart.wholesaleCustomerId && (
															<span className="font-mono text-[10px] ml-0.5 opacity-80">
																({cart.wholesaleCustomerId})
															</span>
														)}
													</span>
												) : isGuest ? (
													<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
														<Icon className="h-3 w-3" name="user" />
														Guest Shopper
													</span>
												) : (
													<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
														<Icon className="h-3 w-3" name="user" />
														Retail Customer
													</span>
												)}
											</td>

											{/* Items Count */}
											<td className="py-4 px-4">
												<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-base font-semibold bg-surface-body border border-surface-line text-ink-700">
													<Icon className="h-3.5 w-3.5 text-brand-600" name="package" />
													{cart.itemsCount} {cart.itemsCount === 1 ? "unit" : "units"}
													<span className="text-ink-400 font-normal">
														({cart.items.length} {cart.items.length === 1 ? "sku" : "skus"})
													</span>
												</span>
											</td>

											{/* Cart Total */}
											<td className="py-4 px-4">
												<span className="font-bold text-ink-900 text-sm">
													{formatLKR(cart.subtotal)}
												</span>
											</td>

											{/* Last Activity */}
											<td className="py-4 px-4 text-ink-500">
												<div className="flex items-center gap-1.5">
													<Icon className="h-3.5 w-3.5 text-ink-400" name="calendar" />
													<span>{formatTimeAgo(cart.updatedAt)}</span>
												</div>
											</td>

											{/* Actions */}
											<td className="py-4 px-4 text-right">
												<button
													onClick={() => setSelectedCart(cart)}
													className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-base text-xs font-semibold bg-brand-50 text-brand-700 hover:bg-brand-100 hover:text-brand-800 border border-brand-200 transition-colors"
													title="Inspect Cart Items"
												>
													<Icon className="h-3.5 w-3.5" name="eye" />
													View Cart
												</button>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal: Cart Details Breakdown */}
			{selectedCart && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
					<div className="w-full max-w-2xl rounded-card bg-surface-card p-6 shadow-card border border-surface-line space-y-5 max-h-[90vh] flex flex-col">
						{/* Modal Header */}
						<div className="flex items-center justify-between border-b border-surface-line pb-4 shrink-0">
							<div className="flex items-center gap-3">
								<div
									className={cn(
										"grid h-11 w-11 shrink-0 place-items-center rounded-full font-bold text-sm",
										selectedCart.customerType === "WHOLESALE"
											? "bg-purple-100 text-purple-700"
											: selectedCart.customerType === "GUEST"
												? "bg-amber-100 text-amber-700"
												: "bg-blue-100 text-blue-700",
									)}
								>
									{selectedCart.customerName[0] || "?"}
								</div>
								<div>
									<h3 className="text-base font-bold text-ink-900 flex items-center gap-2">
										<span>{selectedCart.customerName}</span>
										{selectedCart.businessName && (
											<span className="text-xs font-normal text-ink-500">
												({selectedCart.businessName})
											</span>
										)}
									</h3>
									<p className="text-xs text-ink-500 font-mono mt-0.5">
										{selectedCart.phone ? selectedCart.phone : "No phone provided"}
										{selectedCart.email && ` • ${selectedCart.email}`}
										{selectedCart.wholesaleCustomerId &&
											` • POS: ${selectedCart.wholesaleCustomerId}`}
									</p>
								</div>
							</div>
							<button
								onClick={() => setSelectedCart(null)}
								className="text-ink-400 hover:text-ink-700 font-bold p-1 rounded-base"
							>
								✕
							</button>
						</div>

						{/* Quick Stat Summary */}
						<div className="grid grid-cols-3 gap-3 text-xs shrink-0">
							<div className="rounded-base bg-surface-body p-3 border border-surface-line">
								<span className="text-ink-400 block text-[11px]">Items in Cart</span>
								<span className="font-bold text-ink-800 text-sm mt-0.5 block">
									{selectedCart.itemsCount} units ({selectedCart.items.length} unique)
								</span>
							</div>
							<div className="rounded-base bg-surface-body p-3 border border-surface-line">
								<span className="text-ink-400 block text-[11px]">Cart Subtotal</span>
								<span className="font-bold text-brand-700 text-sm mt-0.5 block">
									{formatLKR(selectedCart.subtotal)}
								</span>
							</div>
							<div className="rounded-base bg-surface-body p-3 border border-surface-line">
								<span className="text-ink-400 block text-[11px]">Last Updated</span>
								<span className="font-semibold text-ink-700 text-xs mt-1 block">
									{formatTimeAgo(selectedCart.updatedAt)}
								</span>
							</div>
						</div>

						{/* Items List (Scrollable) */}
						<div className="flex-1 overflow-y-auto space-y-3 min-h-[160px] pr-1">
							<h4 className="text-xs font-bold uppercase tracking-wider text-ink-600">
								Shopping Cart Items
							</h4>
							<div className="space-y-2">
								{selectedCart.items.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between p-3 rounded-base border border-surface-line bg-surface-body/50 hover:bg-surface-body transition-colors"
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="relative h-12 w-12 shrink-0 rounded-base bg-white border border-surface-line overflow-hidden grid place-items-center">
												{item.image ? (
													<Image
														src={item.image}
														alt={item.title}
														fill
														className="object-cover"
													/>
												) : (
													<Icon className="h-5 w-5 text-ink-300" name="package" />
												)}
											</div>
											<div className="min-w-0">
												<p className="font-semibold text-ink-800 text-xs truncate max-w-sm">
													{item.title}
												</p>
												<div className="flex items-center gap-2 text-[11px] text-ink-400 font-mono mt-0.5">
													{item.sku && <span>SKU: {item.sku}</span>}
													<span>•</span>
													<span>Unit: {formatLKR(item.unitPrice)}</span>
												</div>
												{item.quantity > item.stockQuantity && (
													<span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 mt-0.5">
														<Icon className="h-3 w-3" name="circle-alert" />
														Only {item.stockQuantity} in stock (Cart has {item.quantity})
													</span>
												)}
											</div>
										</div>

										<div className="text-right shrink-0 pl-3">
											<p className="font-bold text-ink-900 text-xs">
												{formatLKR(item.totalPrice)}
											</p>
											<p className="text-[11px] text-ink-500 font-medium mt-0.5">
												Qty: <span className="font-bold text-ink-700">{item.quantity}</span>
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Modal Actions */}
						<div className="flex items-center justify-between border-t border-surface-line pt-4 shrink-0">
							<div className="flex items-center gap-2">
								{selectedCart.phone && (
									<a
										href={`tel:${selectedCart.phone}`}
										className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-base text-xs font-semibold bg-surface-body border border-surface-line text-ink-700 hover:bg-surface-line transition-colors"
									>
										<Icon className="h-3.5 w-3.5 text-ink-500" name="phone" />
										Call Customer
									</a>
								)}
								{selectedCart.phone && (
									<a
										href={`https://wa.me/${selectedCart.phone.replace(/[^0-9]/g, "")}`}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-base text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
									>
										<Icon className="h-3.5 w-3.5 text-emerald-600" name="message-circle" />
										WhatsApp
									</a>
								)}
								{selectedCart.email && (
									<a
										href={`mailto:${selectedCart.email}?subject=Your Shopping Cart at Trans Asia`}
										className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-base text-xs font-semibold bg-surface-body border border-surface-line text-ink-700 hover:bg-surface-line transition-colors"
									>
										<Icon className="h-3.5 w-3.5 text-ink-500" name="mail" />
										Send Email
									</a>
								)}
							</div>

							<button
								onClick={() => setSelectedCart(null)}
								className="px-4 py-2 text-xs font-semibold rounded-base bg-surface-body border border-surface-line text-ink-700 hover:bg-surface-line"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
