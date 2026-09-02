import Link from "next/link";
import { CategoryListTable } from "@/components/catalog/list-pages";
import { ShowcaseStrip } from "@/components/catalog/showcase-strip";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";
import { categories } from "@/data/admin/catalog";

export default function CategoriesPage() {
	return (
		<>
			<PageHeader
				actions={
					<Link
						className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						href={routes.addCategory}
					>
						<Icon className="h-4 w-4" name="plus" />
						Add Category
					</Link>
				}
				description="Organize storefront navigation and merchandising groups."
				eyebrow="Catalog"
				title="Categories"
			/>
			<ShowcaseStrip items={categories} type="category" />
			<CategoryListTable categories={categories} />
		</>
	);
}
