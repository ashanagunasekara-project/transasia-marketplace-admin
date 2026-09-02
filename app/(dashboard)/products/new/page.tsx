import type { Metadata } from "next";
import { ProductForm } from "@/components/products/product-form";
import { productFormDefaults } from "@/data/products/data";

export const metadata: Metadata = {
	title: "Add Product",
};

export default function AddProductPage() {
	return <ProductForm mode="add" {...productFormDefaults.add} />;
}
