"use client";

import { useEffect, useState } from "react";
import { CategoryListTable } from "@/components/catalog/list-pages";
import { ShowcaseStrip } from "@/components/catalog/showcase-strip";
import { type ApiCategory, deleteCategory, fetchCategories } from "@/lib/api";

export function CategoriesClient({
	initialCategories,
}: {
	initialCategories: ApiCategory[];
}) {
	const [categories, setCategories] =
		useState<ApiCategory[]>(initialCategories);

	useEffect(() => {
		async function refresh() {
			try {
				const fresh = await fetchCategories();
				if (fresh && fresh.length > 0) {
					setCategories(fresh);
				}
			} catch (e) {}
		}
		refresh();
	}, []);

	async function handleDelete(ids: string[]) {
		try {
			for (const id of ids) {
				if (!id.startsWith("fallback-")) {
					await deleteCategory(id);
				}
			}
			setCategories((prev) => prev.filter((c) => !ids.includes(c.id)));
		} catch (e) {
			console.error("Failed to delete categories:", e);
		}
	}

	return (
		<>
			<ShowcaseStrip items={categories} type="category" />
			<CategoryListTable categories={categories} onDelete={handleDelete} />
		</>
	);
}
