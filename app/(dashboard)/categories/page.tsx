import Link from "next/link";
import { CategoriesClient } from "@/components/catalog/categories-client";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";
import { categories as fallbackCategories } from "@/data/admin/catalog";
import { type ApiCategory, fetchCategories } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
	let categories: ApiCategory[] = [];
	try {
		categories = await fetchCategories();
	} catch (e) {
		console.warn("Server fetch categories error:", e);
	}

	if (!categories || categories.length === 0) {
		categories = fallbackCategories.map((c, idx) => ({
			...c,
			id: `fallback-${idx}`,
			productCount: c.count,
			title: c.name,
		}));
	}

	return (
		<>
			<PageHeader
				actions={
					<Link
						className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700 transition-colors shadow-soft"
						href={routes.addCategory}
					>
						<Icon className="h-4 w-4" name="plus" />
						Add Category
					</Link>
				}
				description="Organize storefront navigation, merchandising groups, and catalog taxonomies."
				eyebrow="Catalog"
				title="Categories"
			/>
			<CategoriesClient initialCategories={categories} />
		</>
	);
}
