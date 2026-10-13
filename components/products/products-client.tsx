"use client";

import { useEffect, useState } from "react";
import { ProductListTable } from "@/components/products/product-list-table";
import { type ApiProduct, deleteProduct, fetchAdminProducts } from "@/lib/api";

export function ProductsClient({
	initialProducts,
}: {
	initialProducts: ApiProduct[];
}) {
	const [products, setProducts] = useState<ApiProduct[]>(initialProducts);

	// Also poll/refresh on client to ensure newly added products in other tabs are captured
	useEffect(() => {
		async function refresh() {
			try {
				const fresh = await fetchAdminProducts();
				if (fresh && fresh.length > 0) {
					setProducts(fresh);
				}
			} catch (e) {}
		}
		refresh();
	}, []);

	async function handleDelete(skusOrIds: string[]) {
		try {
			for (const id of skusOrIds) {
				if (!id.startsWith("fallback-")) {
					await deleteProduct(id);
				}
			}
			setProducts((prev) =>
				prev.filter(
					(p) => !skusOrIds.includes(p.sku) && !skusOrIds.includes(p.id),
				),
			);
		} catch (e) {
			console.error("Failed to delete products:", e);
		}
	}

	return <ProductListTable onDelete={handleDelete} products={products} />;
}
