import { ProductReviewListTable } from "@/components/admin/operation-list-pages";
import { PageHeader } from "@/components/layout/page-header";
import { productReviews } from "@/data/admin/operations";

const stats = [
	["Average rating", "4.7/5", "text-warning-600"],
	["Pending reviews", "26", "text-ink-900"],
	["Approved this month", "184", "text-success-600"],
] as const;

export default function ProductReviewsPage() {
	return (
		<>
			<PageHeader
				description="Review, approve, and respond to customer product feedback."
				eyebrow="Moderation"
				title="Product Reviews"
			/>
			<section className="mb-6 grid gap-4 md:grid-cols-3">
				{stats.map(([label, value, className]) => (
					<article
						className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card"
						key={label}
					>
						<p className="text-[13px] text-ink-500">{label}</p>
						<h2 className={`mt-1 text-[24px] font-semibold ${className}`}>
							{value}
						</h2>
					</article>
				))}
			</section>
			<ProductReviewListTable reviews={productReviews} />
		</>
	);
}
