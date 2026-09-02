import Link from "next/link";
import { CouponListTable } from "@/components/admin/operation-list-pages";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { StatusBadge } from "@/components/ui/status-badge";
import { routes } from "@/config/routes";
import { coupons } from "@/data/admin/operations";

const stats = [
	{
		badge: "+8%",
		badgeClass: "bg-success-50 text-success-600",
		icon: "badge-percent",
		iconClass: "bg-brand-50 text-brand-600",
		label: "Active coupons",
		value: "18",
	},
	{
		badge: "June",
		badgeClass: "bg-brand-50 text-brand-600",
		icon: "dollar-sign",
		iconClass: "bg-success-50 text-success-600",
		label: "Discount redeemed",
		value: "$12.4k",
	},
	{
		badge: "Soon",
		badgeClass: "bg-warning-50 text-warning-600",
		icon: "calendar",
		iconClass: "bg-warning-50 text-warning-600",
		label: "Expiring this week",
		value: "5",
	},
	{
		badge: "Draft",
		badgeClass: "bg-surface-muted text-ink-600",
		icon: "gift",
		iconClass: "bg-danger-50 text-danger-500",
		label: "Pending campaigns",
		value: "7",
	},
];

export default function CouponsPage() {
	return (
		<>
			<PageHeader
				actions={
					<Link
						className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						href={routes.addCoupon}
					>
						<Icon className="h-4 w-4" name="plus" />
						Add Coupon
					</Link>
				}
				description="Manage discount codes, usage limits, validity windows, and campaign status."
				eyebrow="Marketing"
				title="Coupons"
			/>
			<section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => (
					<article
						className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card"
						key={stat.label}
					>
						<div className="flex items-center justify-between gap-3">
							<span
								className={`grid h-11 w-11 place-items-center rounded-base ${stat.iconClass}`}
							>
								<Icon className="h-5 w-5" name={stat.icon} />
							</span>
							<StatusBadge className={stat.badgeClass} label={stat.badge} />
						</div>
						<p className="mt-4 text-[13px] text-ink-500">{stat.label}</p>
						<h2 className="mt-1 text-[24px] font-semibold text-ink-900">
							{stat.value}
						</h2>
					</article>
				))}
			</section>
			<CouponListTable coupons={coupons} />
		</>
	);
}
