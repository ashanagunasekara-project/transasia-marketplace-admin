import Link from "next/link";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { ProductsClient } from "@/components/products/products-client";
import { routes } from "@/config/routes";
import { products as fallbackProducts } from "@/data/products/data";
import { type ApiProduct, fetchAdminProducts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
	let products: ApiProduct[] = [];
	try {
		products = await fetchAdminProducts();
	} catch (e) {
		console.warn("Server fetch products error:", e);
	}

	if (!products || products.length === 0) {
		products = fallbackProducts.map((p, idx) => ({
			...p,
			basePrice: p.price,
			brand: "General",
			id: `fallback-${idx}`,
			price: p.price,
			stockQuantity: p.stock,
			title: p.name,
		}));
	}

	return (
		<>
			<PageHeader
				actions={
					<Link
						className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700 transition-colors shadow-soft"
						href={routes.addProduct}
					>
						<Icon className="h-4 w-4" name="plus" />
						Add Product
					</Link>
				}
				description="Manage catalog items, stock, pricing, and publish state."
				eyebrow="Catalog"
				title="Products"
			/>
			<ProductsClient initialProducts={products} />
		</>
	);
}
