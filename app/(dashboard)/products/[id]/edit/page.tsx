"use client";

import { use, useEffect, useState } from "react";
import { ProductForm } from "@/components/products/product-form";
import { productFormDefaults } from "@/data/products/data";
import { type ApiProduct, fetchProduct } from "@/lib/api";

export default function EditProductPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const [product, setProduct] = useState<ApiProduct | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const data = await fetchProduct(id);
				setProduct(data);
			} catch (e) {
				console.error("Failed to fetch product:", e);
			} finally {
				setIsLoading(false);
			}
		}
		load();
	}, [id]);

	if (isLoading) {
		return (
			<div className="flex h-64 items-center justify-center rounded-card border border-surface-line bg-surface-card p-6">
				<div className="flex items-center gap-3 text-ink-500 text-[14px]">
					<div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
					<span>Loading product details...</span>
				</div>
			</div>
		);
	}

	return (
		<ProductForm
			initialData={product}
			mode="edit"
			{...productFormDefaults.edit}
		/>
	);
}
