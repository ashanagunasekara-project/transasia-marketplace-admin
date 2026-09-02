import Link from "next/link";
import {
	Field,
	FormCard,
	SelectField,
} from "@/components/forms/admin-form-primitives";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { routes } from "@/config/routes";

type SettingsHeaderProps = {
	description: string;
	eyebrow?: string;
	title: string;
};

function SettingsHeader({
	description,
	eyebrow = "Settings",
	title,
}: SettingsHeaderProps) {
	return (
		<PageHeader
			actions={
				<button
					className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
					type="button"
				>
					<Icon className="h-4 w-4" name="save" />
					Save Changes
				</button>
			}
			description={description}
			eyebrow={eyebrow}
			title={title}
		/>
	);
}

export function TaxPage() {
	const rows = [
		[
			"Bangladesh",
			"Standard",
			"15%",
			"Active",
			"bg-success-50 text-success-600",
		],
		[
			"United States",
			"State tax",
			"8.25%",
			"Active",
			"bg-success-50 text-success-600",
		],
		[
			"Digital Goods",
			"Reduced",
			"5%",
			"Draft",
			"bg-surface-muted text-ink-600",
		],
	];

	return (
		<>
			<PageHeader
				actions={
					<button
						className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						type="button"
					>
						<Icon className="h-4 w-4" name="plus" />
						Add Tax Rate
					</button>
				}
				description="Configure tax classes, rates, and taxable regions."
				eyebrow="Finance"
				title="Tax"
			/>
			<section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<FormCard title="Tax Rates">
					<div className="dashboard-scrollbar overflow-x-auto">
						<table className="w-full min-w-[700px] text-left text-[14px]">
							<thead className="border-b border-surface-line text-[13px] uppercase text-ink-400">
								<tr>
									<th className="pb-3 pr-4 font-semibold">Region</th>
									<th className="pb-3 pr-4 font-semibold">Class</th>
									<th className="pb-3 pr-4 font-semibold">Rate</th>
									<th className="pb-3 font-semibold">Status</th>
								</tr>
							</thead>
							<tbody>
								{rows.map(([region, taxClass, rate, status, className]) => (
									<tr className="border-b border-surface-line" key={region}>
										<td className="py-4 pr-4 font-semibold text-ink-900">
											{region}
										</td>
										<td className="py-4 pr-4 text-ink-700">{taxClass}</td>
										<td className="py-4 pr-4 text-ink-700">{rate}</td>
										<td className="py-4">
											<StatusBadge className={className} label={status} />
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</FormCard>
				<aside className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card">
					<h2 className="mb-4 text-[17px] font-semibold text-ink-900">
						Tax Settings
					</h2>
					<SelectField
						label="Price Display"
						name="price_display"
						options={["Prices include tax", "Prices exclude tax"]}
					/>
					<label className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-ink-700">
						<input
							className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
							defaultChecked
							type="checkbox"
						/>
						Calculate tax on shipping
					</label>
				</aside>
			</section>
		</>
	);
}

export function StoreProfilePage() {
	return (
		<>
			<SettingsHeader
				description="Configure store identity, fulfillment, and operational defaults."
				eyebrow="Configuration"
				title="Settings"
			/>
			<form className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
				<div className="border-b border-surface-line pb-5">
					<h2 className="text-[20px] font-medium text-ink-900">
						Store Profile
					</h2>
					<p className="mt-1 text-[14px] text-ink-500">
						These details appear in invoices, notifications, and storefront
						metadata.
					</p>
				</div>
				<div className="mt-6 grid gap-5 md:grid-cols-2">
					<Field
						defaultValue="Unimart Grocery"
						label="Store name"
						name="store_name"
					/>
					<Field
						defaultValue="support@unimart.local"
						label="Support email"
						name="support_email"
						type="email"
					/>
					<SelectField
						label="Default currency"
						name="currency"
						options={["USD - US Dollar", "BDT - Bangladeshi Taka"]}
					/>
					<SelectField
						label="Timezone"
						name="timezone"
						options={["Asia/Dhaka", "UTC"]}
					/>
				</div>
				<SettingCheckbox
					checked
					description="Send operational alerts when orders fail payment, stock, or fulfillment checks."
					label="Enable order alert emails"
				/>
				<FormFooter cancelHref={routes.settings} />
			</form>
		</>
	);
}

export function ShippingSettingsPage() {
	return (
		<>
			<SettingsHeader
				description="Configure delivery methods, free shipping, and fulfillment defaults."
				title="Shipping"
			/>
			<form className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<section className="space-y-6">
					<FormCard title="Delivery Methods">
						<div className="grid gap-5 md:grid-cols-2">
							<SelectField
								label="Default method"
								name="default_method"
								options={[
									"Standard delivery",
									"Express delivery",
									"Pickup from store",
								]}
							/>
							<SelectField
								label="Processing time"
								name="processing_time"
								options={[
									"1 business day",
									"2 business days",
									"3 business days",
								]}
							/>
							<Field
								defaultValue="5"
								label="Standard rate"
								name="standard_rate"
								type="number"
							/>
							<Field
								defaultValue="12"
								label="Express rate"
								name="express_rate"
								type="number"
							/>
						</div>
					</FormCard>
					<FormCard title="Shipping Rules">
						<SettingCheckbox
							checked
							description="Offer free delivery when customers meet the minimum cart amount."
							label="Enable free shipping threshold"
						/>
						<Field
							defaultValue="49"
							label="Minimum cart amount"
							name="minimum_cart"
							type="number"
						/>
					</FormCard>
				</section>
				<aside className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card">
					<span className="grid h-11 w-11 place-items-center rounded-base bg-brand-50 text-brand-600">
						<Icon className="h-5 w-5" name="truck" />
					</span>
					<h2 className="mt-4 text-[17px] font-semibold text-ink-900">
						Fulfillment Summary
					</h2>
					<p className="mt-1 text-[13px] text-ink-500">
						Standard and express delivery are enabled for all active regions.
					</p>
					<div className="mt-5 space-y-3 text-[14px]">
						<div className="flex items-center justify-between">
							<span className="text-ink-500">Active zones</span>
							<span className="font-semibold text-ink-900">4</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-ink-500">Pickup locations</span>
							<span className="font-semibold text-ink-900">2</span>
						</div>
					</div>
				</aside>
			</form>
		</>
	);
}

export function PaymentSettingsPage() {
	return (
		<>
			<SettingsHeader
				description="Configure checkout payment methods and settlement defaults."
				title="Payments"
			/>
			<section className="space-y-6">
				<FormCard title="Payment Methods">
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						<PaymentOption
							checked
							description="Accept Visa, Mastercard, and Amex."
							highlighted
							label="Credit Card"
						/>
						<PaymentOption
							checked
							description="Allow customers to pay at delivery."
							label="Cash on Delivery"
						/>
						<PaymentOption
							description="Collect manual bank payments."
							label="Bank Transfer"
						/>
					</div>
				</FormCard>
				<FormCard title="Settlement">
					<div className="grid gap-5 md:grid-cols-2">
						<SelectField
							label="Default currency"
							name="default_currency"
							options={["USD - US Dollar", "BDT - Bangladeshi Taka"]}
						/>
						<SelectField
							label="Payout schedule"
							name="payout_schedule"
							options={["Weekly", "Bi-weekly", "Monthly"]}
						/>
					</div>
				</FormCard>
			</section>
		</>
	);
}

export function PermissionSettingsPage() {
	return (
		<>
			<SettingsHeader
				description="Set default admin access, approval rules, and security controls."
				title="Permissions"
			/>
			<section className="space-y-6">
				<FormCard title="Default Access">
					<div className="grid gap-5 md:grid-cols-2">
						<SelectField
							label="New staff role"
							name="new_staff_role"
							options={["Support Agent", "Store Manager", "Administrator"]}
						/>
						<SelectField
							label="Session timeout"
							name="session_timeout"
							options={["30 minutes", "1 hour", "8 hours"]}
						/>
					</div>
				</FormCard>
				<FormCard title="Approval Rules">
					<SettingCheckbox
						checked
						description="Staff refunds above the configured threshold require manager approval."
						label="Require approval for refunds"
					/>
					<SettingCheckbox
						description="Draft products must be reviewed before going live."
						label="Require approval for product publishing"
					/>
				</FormCard>
			</section>
		</>
	);
}

export function NotificationsPage() {
	const preferences = [
		[
			"Order Alerts",
			"Receive alerts when orders fail payment, stock, or fulfillment checks.",
			true,
		],
		[
			"Login Activity",
			"Receive alerts when a new device or location accesses an admin account.",
			true,
		],
		[
			"Promotional Offers",
			"Get updates about discounts, coupons, and limited-time campaign opportunities.",
			false,
		],
		[
			"Security Updates",
			"Notify admins about policy changes, password events, and new security features.",
			false,
		],
		[
			"Review Reminders",
			"Remind admins to moderate new product reviews and customer feedback.",
			true,
		],
	] as const;

	return (
		<>
			<SettingsHeader
				description="Control admin alerts for orders, security, promotions, and product feedback."
				title="Notifications"
			/>
			<form className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
				<div className="border-b border-surface-line pb-5">
					<h2 className="text-[20px] font-medium text-ink-900">
						Notification Preferences
					</h2>
					<p className="mt-1 text-[14px] text-ink-500">
						Choose which operational and account notifications should be
						delivered to admins.
					</p>
				</div>
				<div className="divide-y divide-surface-line">
					{preferences.map(([label, description, checked]) => (
						<PreferenceCheckbox
							checked={checked}
							description={description}
							key={label}
							label={label}
						/>
					))}
				</div>
				<div className="mt-6 grid gap-5 border-t border-surface-line pt-6 md:grid-cols-2">
					<Field
						defaultValue="support@unimart.local"
						label="Primary email"
						name="primary_email"
						type="email"
					/>
					<SelectField
						label="Digest frequency"
						name="digest_frequency"
						options={["Instant alerts", "Daily digest", "Weekly digest"]}
					/>
				</div>
				<FormFooter cancelHref={routes.settings} />
			</form>
		</>
	);
}

function PaymentOption({
	checked,
	description,
	highlighted,
	label,
}: {
	checked?: boolean;
	description: string;
	highlighted?: boolean;
	label: string;
}) {
	return (
		<label
			className={`flex items-start gap-3 rounded-card border p-4 ${highlighted ? "border-brand-600 bg-brand-50/60" : "border-surface-line"}`}
		>
			<input
				className="mt-1 h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
				defaultChecked={checked}
				type="checkbox"
			/>
			<span>
				<span className="block text-[14px] font-semibold text-ink-900">
					{label}
				</span>
				<span className="text-[13px] text-ink-500">{description}</span>
			</span>
		</label>
	);
}

function SettingCheckbox({
	checked,
	description,
	label,
}: {
	checked?: boolean;
	description: string;
	label: string;
}) {
	return (
		<label className="mt-4 flex items-start gap-3 rounded-card border border-surface-line bg-surface-body p-4">
			<input
				className="mt-1 h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
				defaultChecked={checked}
				type="checkbox"
			/>
			<span>
				<span className="block text-[14px] font-semibold text-ink-900">
					{label}
				</span>
				<span className="mt-1 block text-[13px] text-ink-500">
					{description}
				</span>
			</span>
		</label>
	);
}

function PreferenceCheckbox({
	checked,
	description,
	label,
}: {
	checked: boolean;
	description: string;
	label: string;
}) {
	return (
		<label className="flex cursor-pointer items-start gap-3 py-5">
			<input
				className="mt-1 h-4 w-4 shrink-0 rounded border-surface-line text-brand-600 focus:ring-brand-600"
				defaultChecked={checked}
				type="checkbox"
			/>
			<span>
				<span className="block text-[14px] font-semibold text-ink-900">
					{label}
				</span>
				<span className="mt-1 block text-[13px] text-ink-500">
					{description}
				</span>
			</span>
		</label>
	);
}

function FormFooter({ cancelHref }: { cancelHref: string }) {
	return (
		<div className="mt-6 flex flex-wrap justify-end gap-2">
			<Link
				className="inline-flex h-11 items-center rounded-base border border-surface-line px-4 text-[14px] font-semibold text-ink-700 hover:bg-surface-muted"
				href={cancelHref}
			>
				Cancel
			</Link>
			<button
				className="h-11 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
				type="submit"
			>
				Save Changes
			</button>
		</div>
	);
}
