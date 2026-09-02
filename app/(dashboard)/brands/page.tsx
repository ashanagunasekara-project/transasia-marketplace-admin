import Link from "next/link";
import { BrandListTable } from "@/components/catalog/list-pages";
import { ShowcaseStrip } from "@/components/catalog/showcase-strip";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";
import { brands } from "@/data/admin/catalog";

export default function BrandsPage() {
	return (
		<>
			<PageHeader
				actions={
					<Link
						className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						href={routes.addBrand}
					>
						<Icon className="h-4 w-4" name="plus" />
						Add Brand
					</Link>
				}
				description="Manage product brands, storefront visibility, and brand merchandising details."
				eyebrow="Catalog"
				title="Brands"
			/>
			<ShowcaseStrip items={brands} type="brand" />
			<BrandListTable brands={brands} />
		</>
	);
}
