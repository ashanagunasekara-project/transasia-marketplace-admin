import { baseURL } from "@/utils/cn";
import type { Category } from "@/data/admin/catalog";
import type { Product, ProductStatus } from "@/data/products/data";

export const API_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Resolves an image URL to a valid browser-loadable path.
 * Handles uploaded files (/uploads/...), local static assets (/assets/...), and remote URLs.
 */
export function resolveImageUrl(url?: string | null): string {
	if (!url) {
		return `${baseURL}assets/images/placeholder.webp`;
	}

	// Direct full URLs, blob previews, or base64 data
	if (
		url.startsWith("http://") ||
		url.startsWith("https://") ||
		url.startsWith("blob:") ||
		url.startsWith("data:")
	) {
		return url;
	}

	// Files served by backend uploads static directory
	if (url.startsWith("/uploads/")) {
		return `${API_URL}${url}`;
	}

	// Assets served from admin public folder
	const clean = url.startsWith("/") ? url.slice(1) : url;
	return `${baseURL}${clean}`;
}

// ----------------------------------------------------
// Categories API
// ----------------------------------------------------

export type ApiCategory = {
	count: number;
	createdAt?: string;
	description?: string | null;
	id: string;
	image: string;
	imgSrc?: string | null;
	isWider?: boolean;
	name: string;
	parentId?: string | null;
	productCount: number;
	slug: string;
	status: "draft" | "published";
	subCategories?: any[];
	title: string;
};

export async function fetchCategories(): Promise<ApiCategory[]> {
	try {
		const res = await fetch(`${API_URL}/api/categories`, {
			cache: "no-store",
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch categories: ${res.statusText}`);
		}
		const json = await res.json();
		if (json.success && Array.isArray(json.data)) {
			return json.data.map((item: any) => ({
				count: item.productCount ?? item.count ?? 0,
				createdAt: item.createdAt,
				description: item.description ?? "",
				id: item.id,
				image: resolveImageUrl(item.imgSrc || item.image),
				imgSrc: item.imgSrc || item.image,
				isWider: item.isWider ?? false,
				name: item.title || item.name,
				parentId: item.parentId,
				productCount: item.productCount ?? item.count ?? 0,
				slug: item.slug,
				status: (item.status === "draft" ? "draft" : "published") as
					| "draft"
					| "published",
				subCategories: item.subCategories || [],
				title: item.title || item.name,
			}));
		}
		return [];
	} catch (error) {
		console.warn("fetchCategories error, using empty list:", error);
		return [];
	}
}

export async function fetchCategory(
	identifier: string,
): Promise<ApiCategory | null> {
	try {
		const res = await fetch(`${API_URL}/api/categories/${identifier}`, {
			cache: "no-store",
		});
		if (!res.ok) {
			return null;
		}
		const json = await res.json();
		if (json.success && json.data) {
			const item = json.data;
			return {
				count: item.productCount ?? item.count ?? 0,
				createdAt: item.createdAt,
				description: item.description ?? "",
				id: item.id,
				image: resolveImageUrl(item.imgSrc || item.image),
				imgSrc: item.imgSrc || item.image,
				isWider: item.isWider ?? false,
				name: item.title || item.name,
				parentId: item.parentId,
				productCount: item.productCount ?? item.count ?? 0,
				slug: item.slug,
				status: (item.status === "draft" ? "draft" : "published") as
					| "draft"
					| "published",
				subCategories: item.subCategories || [],
				title: item.title || item.name,
			};
		}
		return null;
	} catch (error) {
		console.error("fetchCategory error:", error);
		return null;
	}
}

export async function createCategory(data: {
	description?: string;
	image?: string;
	imgSrc?: string;
	isWider?: boolean;
	name: string;
	parentId?: string;
	slug?: string;
	status?: string;
	title?: string;
}) {
	const res = await fetch(`${API_URL}/api/categories`, {
		body: JSON.stringify({
			description: data.description,
			imgSrc: data.imgSrc || data.image,
			isWider: data.isWider,
			name: data.name || data.title,
			parentId: data.parentId,
			slug: data.slug,
			title: data.title || data.name,
		}),
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
	});

	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to create category");
	}
	return json.data;
}

export async function updateCategory(
	id: string,
	data: Partial<{
		description?: string;
		image?: string;
		imgSrc?: string;
		isWider?: boolean;
		name: string;
		parentId?: string;
		slug?: string;
		status?: string;
		title?: string;
	}>,
) {
	const res = await fetch(`${API_URL}/api/categories/${id}`, {
		body: JSON.stringify({
			...data,
			imgSrc: data.imgSrc || data.image,
			title: data.title || data.name,
		}),
		headers: {
			"Content-Type": "application/json",
		},
		method: "PUT",
	});

	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to update category");
	}
	return json.data;
}

export async function deleteCategory(id: string) {
	const res = await fetch(`${API_URL}/api/categories/${id}`, {
		method: "DELETE",
	});

	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to delete category");
	}
	return json;
}

// ----------------------------------------------------
// Products API
// ----------------------------------------------------

export type ApiProduct = {
	basePrice: number;
	brand: string;
	brandId?: string | null;
	category: string;
	categoryId?: string | null;
	createdAt?: string;
	description?: string | null;
	id: string;
	image: string;
	images?: { id: string; isPrimary: boolean; url: string }[];
	name: string;
	posItemCode?: string | null;
	price: number;
	rawStatus?: string;
	sku: string;
	status: ProductStatus;
	stock: number;
	stockQuantity: number;
	title: string;
	wholesalePrice?: number | null;
};

export async function fetchAdminProducts(): Promise<ApiProduct[]> {
	try {
		const res = await fetch(`${API_URL}/api/products/admin/all`, {
			cache: "no-store",
		});
		if (!res.ok) {
			throw new Error(`Failed to fetch admin products: ${res.statusText}`);
		}
		const json = await res.json();
		if (json.success && Array.isArray(json.data)) {
			return json.data.map((item: any) => ({
				...item,
				image: resolveImageUrl(item.image),
			}));
		}
		return [];
	} catch (error) {
		console.warn("fetchAdminProducts error, using fallback:", error);
		return [];
	}
}

export async function fetchProduct(
	identifier: string,
): Promise<ApiProduct | null> {
	try {
		const res = await fetch(`${API_URL}/api/products/${identifier}`, {
			cache: "no-store",
		});
		if (!res.ok) {
			return null;
		}
		const json = await res.json();
		if (json.success && json.data) {
			const item = json.data;
			return {
				basePrice: Number(item.retailPrice || item.price || 0),
				brand: item.brand?.name || "Unassigned",
				brandId: item.brand?.id,
				category: item.category?.title || "Unassigned",
				categoryId: item.category?.id,
				description: item.description,
				id: item.id,
				image: resolveImageUrl(item.primaryImage),
				images: item.images,
				name: item.title,
				posItemCode: item.posItemCode,
				price: Number(item.price || 0),
				sku: item.sku,
				status:
					item.stockQuantity <= 10 && item.stockQuantity > 0
						? "low stock"
						: item.isAvailable
							? "published"
							: "draft",
				stock: item.stockQuantity,
				stockQuantity: item.stockQuantity,
				title: item.title,
				wholesalePrice: item.wholesalePrice
					? Number(item.wholesalePrice)
					: undefined,
			};
		}
		return null;
	} catch (error) {
		console.error("fetchProduct error:", error);
		return null;
	}
}

export async function createProduct(data: {
	brandId?: string;
	categoryId?: string;
	description?: string;
	image?: string;
	images?: string[];
	name: string;
	posItemCode?: string;
	price: number;
	sku?: string;
	status?: string;
	stock: number;
	title?: string;
	wholesalePrice?: number;
}) {
	const res = await fetch(`${API_URL}/api/products`, {
		body: JSON.stringify({
			basePrice: data.price,
			brandId: data.brandId || null,
			categoryId: data.categoryId || null,
			description: data.description,
			image: data.image,
			images: data.images,
			name: data.name || data.title,
			posItemCode: data.posItemCode,
			price: data.price,
			sku: data.sku,
			status: data.status || "ACTIVE",
			stock: data.stock,
			stockQuantity: data.stock,
			title: data.title || data.name,
			wholesalePrice: data.wholesalePrice,
		}),
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
	});

	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to create product");
	}
	return json.data;
}

export async function updateProduct(
	id: string,
	data: Partial<{
		brandId?: string;
		categoryId?: string;
		description?: string;
		image?: string;
		images?: string[];
		name: string;
		posItemCode?: string;
		price: number;
		sku?: string;
		status?: string;
		stock: number;
		title?: string;
		wholesalePrice?: number;
	}>,
) {
	const res = await fetch(`${API_URL}/api/products/${id}`, {
		body: JSON.stringify({
			...data,
			basePrice: data.price,
			title: data.title || data.name,
		}),
		headers: {
			"Content-Type": "application/json",
		},
		method: "PUT",
	});

	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to update product");
	}
	return json.data;
}

export async function deleteProduct(id: string) {
	const res = await fetch(`${API_URL}/api/products/${id}`, {
		method: "DELETE",
	});

	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to delete product");
	}
	return json;
}

// ----------------------------------------------------
// Brands API
// ----------------------------------------------------

export type ApiBrand = {
	discount?: string;
	id: string;
	imgSrc?: string | null;
	name: string;
	productCount: number;
	slug: string;
};

export async function fetchBrands(): Promise<ApiBrand[]> {
	try {
		const res = await fetch(`${API_URL}/api/brands`, {
			cache: "no-store",
		});
		if (!res.ok) {
			return [];
		}
		const json = await res.json();
		if (json.success && Array.isArray(json.data)) {
			return json.data;
		}
		return [];
	} catch (error) {
		console.warn("fetchBrands error:", error);
		return [];
	}
}

// ----------------------------------------------------
// Image Upload API
// ----------------------------------------------------

export async function uploadImageFile(file: File): Promise<string> {
	const formData = new FormData();
	formData.append("image", file);

	const res = await fetch(`${API_URL}/api/upload`, {
		body: formData,
		method: "POST",
	});

	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to upload image file");
	}

	return json.url; // e.g. "/uploads/img-1234567.jpg"
}

// ----------------------------------------------------
// Customers API
// ----------------------------------------------------

export type ApiCustomer = {
	approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
	brcDocumentUrl?: string | null;
	businessAddress?: string | null;
	businessName?: string | null;
	createdAt: string;
	customerType: "REGULAR" | "WHOLESALE";
	email: string | null;
	fullName: string;
	id: string;
	isLocked: boolean;
	lockedUntil?: string | null;
	ordersCount: number;
	otpRetryCount: number;
	ownerName?: string | null;
	phone: string;
	totalSpent: number;
	userId: string;
	userStatus: string;
	wholesaleCustomerId?: string | null;
};

export type CustomerStats = {
	locked: number;
	regular: number;
	total: number;
	wholesaleApproved: number;
	wholesalePending: number;
};

export async function fetchCustomers(params?: {
	limit?: number;
	page?: number;
	search?: string;
	status?: string;
	type?: string;
}): Promise<{ customers: ApiCustomer[]; totalCount: number }> {
	try {
		const query = new URLSearchParams();
		if (params?.type) query.set("type", params.type);
		if (params?.status) query.set("status", params.status);
		if (params?.search) query.set("search", params.search);
		if (params?.page) query.set("page", String(params.page));
		if (params?.limit) query.set("limit", String(params.limit));

		const res = await fetch(`${API_URL}/api/admin/customers?${query.toString()}`, {
			cache: "no-store",
		});
		if (!res.ok) {
			return { customers: [], totalCount: 0 };
		}
		const json = await res.json();
		return {
			customers: json.data || [],
			totalCount: json.pagination?.totalCount || json.data?.length || 0,
		};
	} catch (error) {
		console.warn("fetchCustomers error:", error);
		return { customers: [], totalCount: 0 };
	}
}

export async function fetchCustomerStats(): Promise<CustomerStats> {
	try {
		const res = await fetch(`${API_URL}/api/admin/customers/stats`, {
			cache: "no-store",
		});
		if (!res.ok) {
			return { locked: 0, regular: 0, total: 0, wholesaleApproved: 0, wholesalePending: 0 };
		}
		const json = await res.json();
		return json.stats || { locked: 0, regular: 0, total: 0, wholesaleApproved: 0, wholesalePending: 0 };
	} catch (error) {
		console.warn("fetchCustomerStats error:", error);
		return { locked: 0, regular: 0, total: 0, wholesaleApproved: 0, wholesalePending: 0 };
	}
}

export async function approveWholesaleCustomer(id: string, wholesaleCustomerId?: string) {
	const res = await fetch(`${API_URL}/api/admin/wholesale-applications/${id}/approve`, {
		body: JSON.stringify({ wholesaleCustomerId }),
		headers: { "Content-Type": "application/json" },
		method: "PATCH",
	});
	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to approve wholesale customer");
	}
	return json.data;
}

export async function rejectWholesaleCustomer(id: string) {
	const res = await fetch(`${API_URL}/api/admin/wholesale-applications/${id}/reject`, {
		headers: { "Content-Type": "application/json" },
		method: "PATCH",
	});
	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to reject wholesale customer");
	}
	return json.data;
}

export async function resetCustomerLockout(idOrUserId: string) {
	const res = await fetch(`${API_URL}/api/admin/customers/${idOrUserId}/reset-lockout`, {
		method: "POST",
	});
	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to reset lockout");
	}
	return json;
}

export async function createAdminCustomer(data: {
	businessAddress?: string;
	businessName?: string;
	customerType: "REGULAR" | "WHOLESALE";
	email?: string;
	fullName: string;
	ownerName?: string;
	phone: string;
	wholesaleCustomerId?: string;
}) {
	const res = await fetch(`${API_URL}/api/admin/customers`, {
		body: JSON.stringify(data),
		headers: { "Content-Type": "application/json" },
		method: "POST",
	});
	const json = await res.json();
	if (!res.ok || !json.success) {
		throw new Error(json.message || "Failed to create customer");
	}
	return json.data;
}
