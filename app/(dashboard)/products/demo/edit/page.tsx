import type { Metadata } from "next";
import { ProductForm } from "@/components/products/product-form";
import { productFormDefaults } from "@/data/products/data";

export const metadata: Metadata = {
	title: "Edit Product",
};

export default function EditProductPage() {
	return <ProductForm mode="edit" {...productFormDefaults.edit} />;
}
