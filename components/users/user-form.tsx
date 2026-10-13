"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
	Field,
	FormCard,
	SelectField,
	TextAreaField,
} from "@/components/forms/admin-form-primitives";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";
import { createAdminCustomer } from "@/lib/api";

export function UserForm() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [role, setRole] = useState("Retail Customer");

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setLoading(true);

		const form = e.currentTarget;
		const formData = new FormData(form);

		const name = formData.get("name") as string;
		const phone = formData.get("phone") as string;
		const email = formData.get("email") as string;
		const address = formData.get("address") as string;
		const businessName = formData.get("businessName") as string;
		const wholesaleCustomerId = formData.get("wholesaleCustomerId") as string;

		if (!name || !phone) {
			setError("Full name and phone number are required.");
			setLoading(false);
			return;
		}

		try {
			const isWholesale = role === "Wholesale Partner";
			await createAdminCustomer({
				businessAddress: address,
				businessName: isWholesale ? businessName || name : undefined,
				customerType: isWholesale ? "WHOLESALE" : "REGULAR",
				email: email || undefined,
				fullName: name,
				phone,
				wholesaleCustomerId: isWholesale ? wholesaleCustomerId : undefined,
			});

			router.push(routes.customers);
		} catch (err: any) {
			setError(err.message || "Failed to create user");
		} finally {
			setLoading(false);
		}
	}

	return (
		<>
			<div className="mb-5">
				<Breadcrumb
					items={[
						{ href: routes.dashboard, label: "Home" },
						{ href: routes.customers, label: "Users" },
						{ label: "Add User" },
					]}
				/>
				<p className="mb-1 text-[13px] font-semibold uppercase text-brand-600">
					Users & Customers
				</p>
				<h1 className="text-[22px] font-semibold text-ink-900">Add New Customer</h1>
				<p className="mt-1 text-[14px] text-ink-500">
					Create a standard retail customer or an approved wholesale B2B partner.
				</p>
			</div>

			{error && (
				<div className="mb-4 rounded-base border border-danger-200 bg-danger-50 p-4 text-[14px] font-medium text-danger-700 flex items-center gap-2">
					<Icon name="circle-alert" className="h-5 w-5 shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<form
				id="user-form"
				onSubmit={handleSubmit}
				className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_280px]"
			>
				<div className="min-w-0 space-y-4">
					<FormCard title="Customer Information">
						<div className="grid gap-4 sm:grid-cols-2">
							<Field
								label="Full Name"
								name="name"
								placeholder="e.g. John Perera"
								required
							/>
							<Field
								label="Phone Number"
								name="phone"
								placeholder="e.g. 0771234567"
								required
							/>
							<Field
								label="Email (Optional)"
								name="email"
								placeholder="customer@example.com"
								type="email"
							/>
							<div className="space-y-1">
								<label className="text-[13px] font-semibold text-ink-700">
									Account Type
								</label>
								<select
									value={role}
									onChange={(e) => setRole(e.target.value)}
									className="h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] font-medium text-ink-800 focus:border-brand-600 focus:outline-none"
								>
									<option value="Retail Customer">Standard Retail Customer</option>
									<option value="Wholesale Partner">Wholesale B2B Partner</option>
								</select>
							</div>

							{role === "Wholesale Partner" && (
								<>
									<Field
										label="Business / Store Name"
										name="businessName"
										placeholder="e.g. Perera Mobile Traders Ltd"
										required
									/>
									<Field
										label="Wholesale POS ID (Optional)"
										name="wholesaleCustomerId"
										placeholder="e.g. WS-10029 (Leave blank to auto-generate)"
									/>
								</>
							)}

							<TextAreaField
								className="sm:col-span-2"
								label="Address"
								name="address"
								placeholder="Street address, city, district"
							/>
						</div>
					</FormCard>
				</div>
				<aside className="min-w-0 space-y-4">
					<FormCard title="Account Settings">
						<SelectField
							defaultValue="Active"
							label="Status"
							name="status"
							options={["Active", "Inactive"]}
						/>
					</FormCard>
					<FormCard title="Pricing Tier">
						<div className="text-xs text-ink-500 space-y-2">
							<p>
								<strong>Current Tier:</strong>{" "}
								<span className="text-brand-600 font-bold">
									{role === "Wholesale Partner"
										? "Wholesale B2B Pricing (POS Synced)"
										: "Standard Retail Base Pricing"}
								</span>
							</p>
							<p>
								{role === "Wholesale Partner"
									? "Customer will automatically view wholesale discounted prices upon login."
									: "Customer views regular retail storefront pricing."}
							</p>
						</div>
					</FormCard>
				</aside>
			</form>
			<div className="mt-6 flex items-center justify-end gap-3 border-t border-surface-line pt-5">
				<Link
					className="inline-flex h-10 items-center gap-2 rounded-base border border-surface-line px-5 text-[14px] font-semibold text-ink-700 hover:bg-surface-muted"
					href={routes.customers}
				>
					Cancel
				</Link>
				<button
					form="user-form"
					disabled={loading}
					className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-soft"
					type="submit"
				>
					<Icon className="h-4 w-4" name="save" />
					{loading ? "Saving Customer..." : "Create Customer"}
				</button>
			</div>
		</>
	);
}
