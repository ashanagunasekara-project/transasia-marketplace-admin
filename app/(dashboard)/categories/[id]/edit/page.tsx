"use client";

import { use, useEffect, useState } from "react";
import { CategoryForm } from "@/components/catalog/category-form";
import { type ApiCategory, fetchCategory } from "@/lib/api";

export default function EditCategoryPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const [category, setCategory] = useState<ApiCategory | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function load() {
			try {
				const data = await fetchCategory(id);
				setCategory(data);
			} catch (e) {
				console.error("Failed to load category:", e);
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
					<span>Loading category details...</span>
				</div>
			</div>
		);
	}

	return <CategoryForm initialData={category} mode="edit" />;
}
