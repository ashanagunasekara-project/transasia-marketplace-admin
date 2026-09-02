import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";

const historyItems = [
	{
		color: "bg-success-500",
		description: "Organic Grocery Pack was updated by Emay Walter.",
		title: "Product updated",
	},
	{
		color: "bg-brand-600",
		description: "SUMMER25 coupon campaign was created.",
		title: "Coupon created",
	},
	{
		color: "bg-warning-500",
		description: "Store Manager permissions were updated.",
		title: "Role permissions changed",
	},
];

const integrations = [
	{
		description: "Connect payment gateways and checkout providers.",
		icon: "credit-card",
		iconClass: "bg-brand-50 text-brand-600",
		status: "Connected",
		statusClass: "bg-success-50 text-success-600",
		title: "Payments",
	},
	{
		description: "Sync carrier rates and fulfillment updates.",
		icon: "truck",
		iconClass: "bg-warning-50 text-warning-600",
		status: "Not connected",
		statusClass: "bg-surface-muted text-ink-600",
		title: "Shipping",
	},
	{
		description: "Send conversion events and customer insights.",
		icon: "bar-chart-3",
		iconClass: "bg-success-50 text-success-600",
		status: "Setup ready",
		statusClass: "bg-brand-50 text-brand-600",
		title: "Analytics",
	},
];

const upgradeFeatures = [
	{
		description: "Deeper sales and customer insights.",
		title: "Advanced reports",
	},
	{
		description: "Granular staff roles and approval flows.",
		title: "Team controls",
	},
	{
		description: "Faster help for operational issues.",
		title: "Priority support",
	},
];

export function HistoryPage() {
	return (
		<>
			<PageHeader
				description="Review recent admin activity across catalog, orders, and settings."
				eyebrow="Workspace"
				title="History"
			/>
			<section className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
				<div className="space-y-5">
					{historyItems.map((item) => (
						<div className="flex gap-3" key={item.title}>
							<span className={`mt-1 h-2.5 w-2.5 rounded-full ${item.color}`} />
							<div>
								<p className="text-[14px] font-semibold text-ink-900">
									{item.title}
								</p>
								<p className="text-[13px] text-ink-500">{item.description}</p>
							</div>
						</div>
					))}
				</div>
			</section>
		</>
	);
}

export function IntegrationsPage() {
	return (
		<>
			<PageHeader
				description="Connect store tools for payments, shipping, analytics, and messaging."
				eyebrow="Workspace"
				title="Integrations"
			/>
			<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{integrations.map((integration) => (
					<article
						className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card"
						key={integration.title}
					>
						<span
							className={`grid h-11 w-11 place-items-center rounded-base ${integration.iconClass}`}
						>
							<Icon className="h-5 w-5" name={integration.icon} />
						</span>
						<h2 className="mt-4 text-[16px] font-semibold text-ink-900">
							{integration.title}
						</h2>
						<p className="mt-1 text-[13px] text-ink-500">
							{integration.description}
						</p>
						<span
							className={`mt-4 inline-flex badge ${integration.statusClass}`}
						>
							{integration.status}
						</span>
					</article>
				))}
			</section>
		</>
	);
}

export function UpdateAppPage() {
	return (
		<>
			<PageHeader
				description="Review template version information and update readiness."
				eyebrow="System"
				title="Update App"
			/>
			<section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
				<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
					<h2 className="text-[17px] font-semibold text-ink-900">
						Version Notes
					</h2>
					<div className="mt-5 space-y-4 text-[14px] text-ink-600">
						<p>
							<span className="font-semibold text-ink-900">v1.5.69</span>{" "}
							includes dashboard layout polish, catalog pages, and expanded
							admin navigation.
						</p>
						<p>
							Run the production build before publishing template updates to
							confirm generated routes are available.
						</p>
					</div>
				</article>
				<aside className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card">
					<span className="badge bg-success-50 text-success-600">Ready</span>
					<h2 className="mt-4 text-[18px] font-semibold text-ink-900">
						No action required
					</h2>
					<p className="mt-1 text-[13px] text-ink-500">
						This page is a static template placeholder for app update workflows.
					</p>
				</aside>
			</section>
		</>
	);
}

export function UpgradePage() {
	return (
		<section className="rounded-card border border-surface-line bg-surface-card p-8 shadow-card">
			<p className="mb-1 text-[13px] font-semibold uppercase text-brand-600">
				Plan
			</p>
			<h1 className="text-[28px] font-semibold text-ink-900">Upgrade to Pro</h1>
			<p className="mt-2 max-w-2xl text-[14px] text-ink-500">
				Unlock advanced analytics, team permissions, automation rules, and
				priority support for growing stores.
			</p>
			<div className="mt-6 grid gap-4 md:grid-cols-3">
				{upgradeFeatures.map((feature) => (
					<div
						className="rounded-card border border-surface-line p-5"
						key={feature.title}
					>
						<h2 className="text-[16px] font-semibold text-ink-900">
							{feature.title}
						</h2>
						<p className="mt-1 text-[13px] text-ink-500">
							{feature.description}
						</p>
					</div>
				))}
			</div>
			<button
				className="mt-6 inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700"
				type="button"
			>
				<Icon className="h-4 w-4" name="star" />
				Choose Pro
			</button>
		</section>
	);
}
