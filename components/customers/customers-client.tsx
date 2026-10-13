"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/dashboard-widgets";
import { routes } from "@/config/routes";
import {
	type ApiCustomer,
	type CustomerStats,
	approveWholesaleCustomer,
	fetchCustomerStats,
	fetchCustomers,
	rejectWholesaleCustomer,
	resetCustomerLockout,
} from "@/lib/api";
import { cn } from "@/utils/cn";

type TabKey = "all" | "wholesale" | "pending" | "retail";

export function CustomersClient({
	initialCustomers = [],
	initialStats,
}: {
	initialCustomers?: ApiCustomer[];
	initialStats?: CustomerStats;
}) {
	const [customers, setCustomers] = useState<ApiCustomer[]>(initialCustomers);
	const [stats, setStats] = useState<CustomerStats>(
		initialStats || {
			locked: 0,
			regular: 0,
			total: 0,
			wholesaleApproved: 0,
			wholesalePending: 0,
		},
	);
	const [activeTab, setActiveTab] = useState<TabKey>("all");
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(false);
	const [actionMessage, setActionMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);

	// Modal State for Approving Wholesale
	const [selectedCustomer, setSelectedCustomer] = useState<ApiCustomer | null>(null);
	const [customWsId, setCustomWsId] = useState("");
	const [isSubmittingApproval, setIsSubmittingApproval] = useState(false);

	// Modal State for Customer Details
	const [detailCustomer, setDetailCustomer] = useState<ApiCustomer | null>(null);

	async function loadData() {
		setLoading(true);
		try {
			const [custRes, statsRes] = await Promise.all([
				fetchCustomers({ search }),
				fetchCustomerStats(),
			]);
			setCustomers(custRes.customers);
			setStats(statsRes);
		} catch (err) {
			console.error("Failed to load customers:", err);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		loadData();
	}, []);

	// Filter customers based on active tab and search
	const filteredCustomers = useMemo(() => {
		return customers.filter((c) => {
			// Tab filtering
			if (activeTab === "wholesale") {
				if (c.customerType !== "WHOLESALE" || c.approvalStatus !== "APPROVED")
					return false;
			} else if (activeTab === "pending") {
				if (c.customerType !== "WHOLESALE" || c.approvalStatus !== "PENDING")
					return false;
			} else if (activeTab === "retail") {
				if (c.customerType !== "REGULAR") return false;
			}

			// Search filtering
			if (!search.trim()) return true;
			const q = search.toLowerCase();
			return (
				c.fullName.toLowerCase().includes(q) ||
				c.phone.toLowerCase().includes(q) ||
				(c.email && c.email.toLowerCase().includes(q)) ||
				(c.businessName && c.businessName.toLowerCase().includes(q)) ||
				(c.wholesaleCustomerId &&
					c.wholesaleCustomerId.toLowerCase().includes(q))
			);
		});
	}, [customers, activeTab, search]);

	// Actions
	function openApproveModal(customer: ApiCustomer) {
		setSelectedCustomer(customer);
		// Auto-suggest next WS code if not assigned
		setCustomWsId(
			customer.wholesaleCustomerId ||
				`WS-${Math.floor(10000 + Math.random() * 90000)}`,
		);
	}

	async function handleApproveWholesale() {
		if (!selectedCustomer) return;
		setIsSubmittingApproval(true);
		try {
			await approveWholesaleCustomer(selectedCustomer.id, customWsId.trim());
			setActionMessage({
				text: `Wholesale customer ${selectedCustomer.fullName} successfully approved with ID: ${customWsId}!`,
				type: "success",
			});
			setSelectedCustomer(null);
			await loadData();
		} catch (err: any) {
			setActionMessage({
				text: err.message || "Failed to approve wholesale customer",
				type: "error",
			});
		} finally {
			setIsSubmittingApproval(false);
			setTimeout(() => setActionMessage(null), 5000);
		}
	}

	async function handleRejectWholesale(customer: ApiCustomer) {
		if (!confirm(`Are you sure you want to reject the wholesale application for ${customer.businessName || customer.fullName}?`)) {
			return;
		}
		try {
			await rejectWholesaleCustomer(customer.id);
			setActionMessage({
				text: `Wholesale application for ${customer.fullName} has been rejected.`,
				type: "success",
			});
			await loadData();
		} catch (err: any) {
			setActionMessage({
				text: err.message || "Failed to reject application",
				type: "error",
			});
		} finally {
			setTimeout(() => setActionMessage(null), 5000);
		}
	}

	async function handleResetLockout(customer: ApiCustomer) {
		try {
			await resetCustomerLockout(customer.userId || customer.id);
			setActionMessage({
				text: `OTP lockout successfully cleared for ${customer.phone}. Customer can log in immediately.`,
				type: "success",
			});
			await loadData();
		} catch (err: any) {
			setActionMessage({
				text: err.message || "Failed to clear lockout",
				type: "error",
			});
		} finally {
			setTimeout(() => setActionMessage(null), 5000);
		}
	}

	return (
		<div className="space-y-6">
			{/* Page Header */}
			<PageHeader
				actions={
					<div className="flex items-center gap-3">
						<button
							onClick={loadData}
							className="inline-flex h-10 items-center gap-2 rounded-base border border-surface-line bg-surface-card px-3 text-[14px] font-medium text-ink-700 hover:bg-surface-body transition-colors"
							type="button"
						>
							<Icon
								className={cn("h-4 w-4", loading && "animate-spin")}
								name="refresh-ccw"
							/>
							Refresh
						</button>
						<Link
							className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700 transition-colors shadow-soft"
							href={routes.addUser}
						>
							<Icon className="h-4 w-4" name="user-plus" />
							Add New Customer
						</Link>
					</div>
				}
				description="Manage retail accounts, review wholesale B2B applications, assign POS IDs, and resolve security lockouts."
				eyebrow="User Management"
				title="Customers & Wholesale Partners"
			/>

			{/* Alert Notification */}
			{actionMessage && (
				<div
					className={cn(
						"flex items-center justify-between rounded-base p-4 text-[14px] font-medium border transition-all",
						actionMessage.type === "success"
							? "border-success-200 bg-success-50 text-success-700"
							: "border-danger-200 bg-danger-50 text-danger-700",
					)}
				>
					<div className="flex items-center gap-2">
						<Icon
							name={actionMessage.type === "success" ? "check" : "circle-alert"}
							className="h-5 w-5 shrink-0"
						/>
						<span>{actionMessage.text}</span>
					</div>
					<button
						onClick={() => setActionMessage(null)}
						className="text-ink-400 hover:text-ink-700 text-sm font-semibold"
					>
						✕
					</button>
				</div>
			)}

			{/* Top Metric Cards */}
			<div className="grid gap-4 md:grid-cols-4">
				<StatCard
					accentBorder="border-brand-500"
					badge="Total"
					badgeClass="bg-brand-50 text-brand-600 font-semibold"
					icon="users"
					iconClass="bg-brand-50 text-brand-600"
					label="All Customers"
					value={String(stats.total)}
				/>
				<StatCard
					accentBorder="border-success-500"
					badge="B2B"
					badgeClass="bg-success-50 text-success-600 font-semibold"
					icon="shield-check"
					iconClass="bg-success-50 text-success-600"
					label="Wholesale Partners"
					value={String(stats.wholesaleApproved)}
				/>
				<StatCard
					accentBorder={
						stats.wholesalePending > 0 ? "border-amber-500" : "border-surface-line"
					}
					badge={stats.wholesalePending > 0 ? "Action Required" : "Up to Date"}
					badgeClass={
						stats.wholesalePending > 0
							? "bg-amber-100 text-amber-700 font-bold animate-pulse"
							: "bg-surface-body text-ink-500"
					}
					icon="circle-alert"
					iconClass={
						stats.wholesalePending > 0
							? "bg-amber-50 text-amber-600"
							: "bg-surface-body text-ink-400"
					}
					label="Pending Applications"
					value={String(stats.wholesalePending)}
				/>
				<StatCard
					accentBorder={stats.locked > 0 ? "border-rose-500" : "border-surface-line"}
					badge={stats.locked > 0 ? "Locked" : "Healthy"}
					badgeClass={
						stats.locked > 0
							? "bg-rose-100 text-rose-700 font-bold"
							: "bg-success-50 text-success-600"
					}
					icon="shield"
					iconClass={
						stats.locked > 0
							? "bg-rose-50 text-rose-600"
							: "bg-surface-body text-ink-400"
					}
					label="OTP Lockouts"
					value={String(stats.locked)}
				/>
			</div>

			{/* Main Card with Tabs, Search, and Table */}
			<div className="rounded-card border border-surface-line bg-surface-card shadow-card">
				{/* Tab Navigation & Search Bar */}
				<div className="border-b border-surface-line p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
					{/* Tabs */}
					<div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
						<button
							onClick={() => setActiveTab("all")}
							className={cn(
								"px-4 py-2 text-[14px] font-semibold rounded-base transition-colors whitespace-nowrap",
								activeTab === "all"
									? "bg-brand-600 text-white shadow-sm"
									: "text-ink-600 hover:bg-surface-body",
							)}
						>
							All Customers ({customers.length})
						</button>
						<button
							onClick={() => setActiveTab("wholesale")}
							className={cn(
								"px-4 py-2 text-[14px] font-semibold rounded-base transition-colors whitespace-nowrap flex items-center gap-2",
								activeTab === "wholesale"
									? "bg-brand-600 text-white shadow-sm"
									: "text-ink-600 hover:bg-surface-body",
							)}
						>
							Wholesale Partners
							<span
								className={cn(
									"px-2 py-0.5 text-xs rounded-full font-bold",
									activeTab === "wholesale"
										? "bg-white/20 text-white"
										: "bg-success-100 text-success-700",
								)}
							>
								{stats.wholesaleApproved}
							</span>
						</button>
						<button
							onClick={() => setActiveTab("pending")}
							className={cn(
								"px-4 py-2 text-[14px] font-semibold rounded-base transition-colors whitespace-nowrap flex items-center gap-2",
								activeTab === "pending"
									? "bg-amber-600 text-white shadow-sm"
									: "text-ink-600 hover:bg-surface-body",
							)}
						>
							Pending Reviews
							{stats.wholesalePending > 0 && (
								<span
									className={cn(
										"px-2 py-0.5 text-xs rounded-full font-bold",
										activeTab === "pending"
											? "bg-white/20 text-white"
											: "bg-amber-100 text-amber-800 animate-pulse",
									)}
								>
									{stats.wholesalePending}
								</span>
							)}
						</button>
						<button
							onClick={() => setActiveTab("retail")}
							className={cn(
								"px-4 py-2 text-[14px] font-semibold rounded-base transition-colors whitespace-nowrap",
								activeTab === "retail"
									? "bg-brand-600 text-white shadow-sm"
									: "text-ink-600 hover:bg-surface-body",
							)}
						>
							Retail Only ({stats.regular})
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
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search by name, phone, BRC, WS-ID..."
							className="w-full h-10 pl-9 pr-4 rounded-base border border-surface-line bg-surface-body text-[14px] text-ink-900 placeholder:text-ink-400 focus:outline-none focus:border-brand-600"
						/>
						{search && (
							<button
								onClick={() => setSearch("")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400 hover:text-ink-700"
							>
								✕
							</button>
						)}
					</div>
				</div>

				{/* Customers Table */}
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead>
							<tr className="border-b border-surface-line bg-surface-body/50 text-[12px] font-semibold text-ink-500 uppercase tracking-wider">
								<th className="py-3 px-4 sm:px-6">Customer</th>
								<th className="py-3 px-4">Account Type</th>
								<th className="py-3 px-4">Wholesale ID</th>
								<th className="py-3 px-4">Business & BRC</th>
								<th className="py-3 px-4">Approval Status</th>
								<th className="py-3 px-4">Security / Health</th>
								<th className="py-3 px-4 text-right">Actions</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-surface-line text-[14px]">
							{filteredCustomers.length === 0 ? (
								<tr>
									<td colSpan={7} className="py-12 text-center text-ink-400">
										<div className="flex flex-col items-center justify-center gap-2">
											<Icon className="h-8 w-8 text-ink-300" name="users" />
											<p className="font-medium">No customers found matching your filter</p>
											<button
												onClick={() => {
													setActiveTab("all");
													setSearch("");
												}}
												className="text-xs text-brand-600 hover:underline font-semibold"
											>
												Reset filters
											</button>
										</div>
									</td>
								</tr>
							) : (
								filteredCustomers.map((customer) => {
									const isWholesale = customer.customerType === "WHOLESALE";
									const isPending =
										isWholesale && customer.approvalStatus === "PENDING";
									const isApproved =
										isWholesale && customer.approvalStatus === "APPROVED";
									const initials = (customer.fullName || "User")
										.split(" ")
										.map((n) => n[0])
										.slice(0, 2)
										.join("")
										.toUpperCase();

									return (
										<tr
											key={customer.id}
											className="hover:bg-surface-body/40 transition-colors"
										>
											{/* Customer Identity */}
											<td className="py-4 px-4 sm:px-6">
												<div className="flex items-center gap-3">
													<div
														className={cn(
															"grid h-10 w-10 shrink-0 place-items-center rounded-full text-[13px] font-bold",
															isWholesale
																? "bg-purple-100 text-purple-700"
																: "bg-brand-100 text-brand-700",
														)}
													>
														{initials}
													</div>
													<div>
														<div className="font-semibold text-ink-900 flex items-center gap-2">
															<span>{customer.fullName}</span>
															{customer.businessName && (
																<span className="text-xs text-ink-400 font-normal">
																	({customer.businessName})
																</span>
															)}
														</div>
														<div className="text-[13px] text-ink-500 flex items-center gap-2 mt-0.5">
															<span className="font-mono text-xs">{customer.phone}</span>
															{customer.email && (
																<>
																	<span>•</span>
																	<span className="truncate max-w-[160px]">{customer.email}</span>
																</>
															)}
														</div>
													</div>
												</div>
											</td>

											{/* Account Type */}
											<td className="py-4 px-4">
												{isWholesale ? (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
														<Icon className="h-3 w-3" name="shield-check" />
														Wholesale B2B
													</span>
												) : (
													<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
														<Icon className="h-3 w-3" name="user" />
														Standard Retail
													</span>
												)}
											</td>

											{/* Wholesale ID */}
											<td className="py-4 px-4">
												{customer.wholesaleCustomerId ? (
													<span className="inline-block font-mono text-[13px] font-bold px-2 py-0.5 rounded bg-surface-body border border-surface-line text-ink-900">
														{customer.wholesaleCustomerId}
													</span>
												) : isWholesale ? (
													<span className="text-xs text-amber-600 font-medium italic">
														Pending Assignment
													</span>
												) : (
													<span className="text-xs text-ink-400">—</span>
												)}
											</td>

											{/* Business details */}
											<td className="py-4 px-4">
												{customer.businessName ? (
													<div>
														<p className="font-medium text-ink-800 text-xs truncate max-w-[180px]">
															{customer.businessName}
														</p>
														<p className="text-[11px] text-ink-400 truncate max-w-[180px]">
															{customer.businessAddress || "Address on file"}
														</p>
													</div>
												) : (
													<span className="text-xs text-ink-400">Individual</span>
												)}
											</td>

											{/* Approval Status */}
											<td className="py-4 px-4">
												{isPending ? (
													<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
														<Icon className="h-3 w-3" name="circle-alert" />
														Pending Review
													</span>
												) : customer.approvalStatus === "APPROVED" ? (
													<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-700 border border-success-200">
														<Icon className="h-3 w-3" name="check" />
														Approved
													</span>
												) : (
													<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-danger-50 text-danger-700 border border-danger-200">
														Rejected
													</span>
												)}
											</td>

											{/* Security / Health */}
											<td className="py-4 px-4">
												{customer.isLocked ? (
													<div className="flex items-center gap-2">
														<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-rose-100 text-rose-800">
															Locked
														</span>
														<button
															onClick={() => handleResetLockout(customer)}
															title="Click to unlock customer account"
															className="text-xs text-brand-600 hover:underline font-semibold"
														>
															Unlock
														</button>
													</div>
												) : (
													<span className="text-xs text-success-600 font-medium">
														Active (Normal)
													</span>
												)}
											</td>

											{/* Action Buttons */}
											<td className="py-4 px-4 text-right">
												<div className="flex items-center justify-end gap-2">
													{isPending && (
														<>
															<button
																onClick={() => openApproveModal(customer)}
																className="inline-flex items-center gap-1 px-3 py-1.5 rounded-base text-xs font-bold bg-success-600 text-white hover:bg-success-700 shadow-sm transition-colors"
															>
																<Icon className="h-3.5 w-3.5" name="check" />
																Approve
															</button>
															<button
																onClick={() => handleRejectWholesale(customer)}
																className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-base text-xs font-medium border border-surface-line text-danger-600 hover:bg-danger-50 transition-colors"
															>
																Reject
															</button>
														</>
													)}

													<button
														onClick={() => setDetailCustomer(customer)}
														className="p-1.5 rounded-base text-ink-500 hover:bg-surface-body hover:text-ink-800 transition-colors"
														title="View Customer Profile"
													>
														<Icon className="h-4 w-4" name="eye" />
													</button>
												</div>
											</td>
										</tr>
									);
								})
							)}
						</tbody>
					</table>
				</div>
			</div>

			{/* Modal: Approve Wholesale Partner */}
			{selectedCustomer && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
					<div className="w-full max-w-lg rounded-card bg-surface-card p-6 shadow-card border border-surface-line space-y-5">
						<div className="flex items-center justify-between border-b border-surface-line pb-4">
							<div>
								<h3 className="text-lg font-bold text-ink-900">
									Approve Wholesale B2B Account
								</h3>
								<p className="text-xs text-ink-500 mt-0.5">
									Verify business credentials and assign a POS Wholesale Customer ID.
								</p>
							</div>
							<button
								onClick={() => setSelectedCustomer(null)}
								className="text-ink-400 hover:text-ink-700 font-bold"
							>
								✕
							</button>
						</div>

						{/* Applicant Details */}
						<div className="rounded-base bg-surface-body p-4 text-xs space-y-2 border border-surface-line">
							<div className="flex justify-between">
								<span className="text-ink-500">Applicant:</span>
								<span className="font-semibold text-ink-800">{selectedCustomer.fullName}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-ink-500">Phone Number:</span>
								<span className="font-semibold font-mono text-ink-800">{selectedCustomer.phone}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-ink-500">Business Name:</span>
								<span className="font-semibold text-ink-800">{selectedCustomer.businessName || "N/A"}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-ink-500">Address:</span>
								<span className="text-ink-800">{selectedCustomer.businessAddress || "N/A"}</span>
							</div>
						</div>

						{/* Wholesale ID Input */}
						<div className="space-y-2">
							<label className="block text-xs font-bold text-ink-700 uppercase">
								Assign Wholesale Customer ID (POS Code)
							</label>
							<input
								type="text"
								value={customWsId}
								onChange={(e) => setCustomWsId(e.target.value)}
								placeholder="e.g. WS-10026"
								className="w-full h-11 px-4 font-mono font-bold rounded-base border border-surface-line bg-surface-body text-ink-900 focus:outline-none focus:border-brand-600"
							/>
							<p className="text-[11px] text-ink-400">
								This ID must match your offline POS system so transactions link seamlessly.
							</p>
						</div>

						{/* Modal Actions */}
						<div className="flex items-center justify-end gap-3 pt-2">
							<button
								type="button"
								onClick={() => setSelectedCustomer(null)}
								className="px-4 py-2 text-xs font-semibold rounded-base border border-surface-line text-ink-600 hover:bg-surface-body"
							>
								Cancel
							</button>
							<button
								type="button"
								disabled={isSubmittingApproval || !customWsId.trim()}
								onClick={handleApproveWholesale}
								className="px-5 py-2 text-xs font-bold rounded-base bg-success-600 text-white hover:bg-success-700 disabled:opacity-50 transition-colors shadow-soft"
							>
								{isSubmittingApproval ? "Approving..." : "Confirm & Activate Wholesale Pricing"}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Modal: Customer Details */}
			{detailCustomer && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
					<div className="w-full max-w-xl rounded-card bg-surface-card p-6 shadow-card border border-surface-line space-y-5">
						<div className="flex items-center justify-between border-b border-surface-line pb-4">
							<div className="flex items-center gap-3">
								<div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 text-brand-700 font-bold">
									{detailCustomer.fullName?.[0]?.toUpperCase() || "C"}
								</div>
								<div>
									<h3 className="text-base font-bold text-ink-900">
										{detailCustomer.fullName}
									</h3>
									<p className="text-xs text-ink-500 font-mono">
										{detailCustomer.phone} • {detailCustomer.email || "No email"}
									</p>
								</div>
							</div>
							<button
								onClick={() => setDetailCustomer(null)}
								className="text-ink-400 hover:text-ink-700 font-bold"
							>
								✕
							</button>
						</div>

						<div className="grid grid-cols-2 gap-4 text-xs">
							<div className="rounded-base bg-surface-body p-3 border border-surface-line space-y-1">
								<span className="text-ink-400 block">Account Type</span>
								<span className="font-bold text-ink-800 text-sm">
									{detailCustomer.customerType === "WHOLESALE"
										? "Wholesale Partner"
										: "Retail Customer"}
								</span>
							</div>
							<div className="rounded-base bg-surface-body p-3 border border-surface-line space-y-1">
								<span className="text-ink-400 block">Wholesale Customer ID</span>
								<span className="font-mono font-bold text-ink-800 text-sm">
									{detailCustomer.wholesaleCustomerId || "None"}
								</span>
							</div>
							<div className="rounded-base bg-surface-body p-3 border border-surface-line space-y-1">
								<span className="text-ink-400 block">Total Orders</span>
								<span className="font-bold text-ink-800 text-sm">
									{detailCustomer.ordersCount} Orders
								</span>
							</div>
							<div className="rounded-base bg-surface-body p-3 border border-surface-line space-y-1">
								<span className="text-ink-400 block">Total Spend</span>
								<span className="font-bold text-ink-800 text-sm">
									Rs. {Number(detailCustomer.totalSpent || 0).toLocaleString()}
								</span>
							</div>
						</div>

						{detailCustomer.businessName && (
							<div className="rounded-base bg-surface-body p-4 border border-surface-line text-xs space-y-2">
								<h4 className="font-bold text-ink-800 uppercase tracking-wider text-[11px]">
									Business Registration Details
								</h4>
								<div className="grid grid-cols-2 gap-2 pt-1">
									<div>
										<span className="text-ink-400 block">Company Name:</span>
										<span className="font-medium text-ink-800">{detailCustomer.businessName}</span>
									</div>
									<div>
										<span className="text-ink-400 block">Contact Person:</span>
										<span className="font-medium text-ink-800">{detailCustomer.ownerName || detailCustomer.fullName}</span>
									</div>
									<div className="col-span-2">
										<span className="text-ink-400 block">Registered Address:</span>
										<span className="text-ink-800">{detailCustomer.businessAddress || "Not provided"}</span>
									</div>
								</div>
							</div>
						)}

						<div className="flex items-center justify-between pt-2 border-t border-surface-line">
							{detailCustomer.isLocked ? (
								<button
									onClick={() => {
										handleResetLockout(detailCustomer);
										setDetailCustomer(null);
									}}
									className="px-3 py-1.5 rounded-base text-xs font-bold bg-rose-600 text-white hover:bg-rose-700"
								>
									Clear OTP Lockout & Unlock
								</button>
							) : (
								<span className="text-xs text-success-600 font-semibold">
									✓ Account in good standing
								</span>
							)}

							<button
								onClick={() => setDetailCustomer(null)}
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
