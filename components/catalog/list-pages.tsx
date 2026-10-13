"use client";

import Image from "next/image";
import Link from "next/link";
import {
	type EntityColumn,
	EntityTable,
} from "@/components/admin/entity-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { routes } from "@/config/routes";
import type {
	Attribute,
	Brand,
	Category,
	Customer,
} from "@/data/admin/catalog";
import { cn } from "@/utils/cn";

type CategoryRow = {
	count: number;
	id: string;
	image: string;
	name: string;
	parentId?: string | null;
	parentName?: string | null;
	slug: string;
	status: string;
	subCategoriesCount: number;
};
type BrandRow = Brand & { id: string };
type AttributeRow = Attribute & { id: string };
type CustomerRow = Customer & { id: string };

const statusClass: Record<string, string> = {
	active: "bg-success-50 text-success-600",
	archived: "bg-surface-muted text-ink-600",
	draft: "bg-warning-50 text-warning-600",
	published: "bg-success-50 text-success-600",
	review: "bg-warning-50 text-warning-600",
};

export function CategoryListTable({
	categories,
	onDelete,
}: {
	categories: (Category | any)[];
	onDelete?: (ids: string[]) => Promise<void> | void;
}) {
	const rows: CategoryRow[] = categories.map((category) => ({
		count: category.count ?? category.productCount ?? 0,
		id: category.id || category.slug,
		image:
			category.image ||
			category.imgSrc ||
			"/assets/images/catagory-img/cat-bg-headphones-01.webp",
		name: category.name || category.title,
		parentId: category.parentId ?? null,
		parentName: category.parentName || category.parent?.title || null,
		slug: category.slug,
		status: category.status || "published",
		subCategoriesCount:
			category.subCategoriesCount ??
			(category.subCategories?.length || 0),
	}));

	const columns: EntityColumn<CategoryRow>[] = [
		{
			key: "category",
			label: "Category",
			render: (category) => (
				<div className="flex items-center gap-3">
					<Image
						alt={category.name}
						className="h-12 w-12 rounded-base bg-surface-body object-cover shrink-0"
						height={48}
						src={category.image}
						width={48}
					/>
					<div>
						<Link
							className="font-semibold text-ink-900 hover:text-brand-600 transition-colors"
							href={`/categories/${category.id}/edit`}
						>
							{category.name}
						</Link>
						<p className="mt-0.5 text-[12px] text-ink-400">/{category.slug}</p>
						{category.parentName ? (
							<p className="mt-1 flex items-center gap-1 text-[11px] font-medium text-brand-600">
								<span>↳ Under:</span>
								<span className="font-semibold">{category.parentName}</span>
							</p>
						) : null}
					</div>
				</div>
			),
			sortValue: (category) => category.name,
		},
		{
			hideable: true,
			key: "hierarchy",
			label: "Hierarchy Level",
			render: (category) =>
				category.parentId ? (
					<span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-[12px] font-medium text-purple-700 border border-purple-200">
						Subcategory
					</span>
				) : (
					<span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-[12px] font-medium text-blue-700 border border-blue-200">
						<span>Parent Category</span>
						{category.subCategoriesCount > 0 ? (
							<span className="rounded-full bg-blue-200 px-1.5 py-0.2 text-[11px] font-semibold text-blue-800">
								{category.subCategoriesCount}
							</span>
						) : null}
					</span>
				),
			sortValue: (category) => (category.parentId ? 1 : 0),
		},
		{
			hideable: true,
			key: "slug",
			label: "Slug",
			render: (category) => (
				<span className="font-mono text-[12px] text-ink-500">{category.slug}</span>
			),
			sortValue: (category) => category.slug,
		},
		{
			hideable: true,
			key: "products",
			label: "Products",
			render: (category) => (
				<span className="text-[13px] font-medium text-ink-700">{category.count}</span>
			),
			sortValue: (category) => category.count,
		},
		{
			hideable: true,
			key: "status",
			label: "Status",
			render: (category) => (
				<StatusBadge
					className={statusClass[category.status] || "bg-success-50 text-success-600"}
					label={capitalize(category.status)}
				/>
			),
			sortValue: (category) => category.status,
		},
	];

	return (
		<EntityTable
			columns={columns}
			deleteMessage="This category will be permanently removed from your catalog. This action cannot be undone."
			editHref={(row) => `/categories/${row.id}/edit`}
			filterOptions={[
				{ label: "All Categories", match: () => true, value: "all" },
				{
					label: "Parent Categories",
					match: (row) => !row.parentId,
					value: "parents",
				},
				{
					label: "Subcategories",
					match: (row) => Boolean(row.parentId),
					value: "subcategories",
				},
				{
					label: "Published",
					match: (row) => row.status === "published",
					value: "published",
				},
				{
					label: "Draft",
					match: (row) => row.status === "draft",
					value: "draft",
				},
			]}
			items={rows}
			onDelete={onDelete}
			searchLabel="Search categories"
			searchPlaceholder="Search by name, slug, or parent..."
			searchText={(category) =>
				`${category.name} ${category.slug} ${category.parentName || ""}`
			}
			singularName="category"
		/>
	);
}

export function BrandListTable({ brands }: { brands: Brand[] }) {
	const rows: BrandRow[] = brands.map((brand) => ({
		...brand,
		id: brand.slug,
	}));
	const columns: EntityColumn<BrandRow>[] = [
		{
			key: "brand",
			label: "Brand",
			render: (brand) => (
				<div className="flex items-center gap-3">
					<span
						className={cn(
							"grid h-12 w-12 shrink-0 place-items-center rounded-base text-[14px] font-semibold",
							brand.tileClass,
						)}
					>
						{brand.initials}
					</span>
					<div>
						<Link
							className="font-semibold text-ink-900 hover:text-brand-600"
							href={routes.editBrand}
						>
							{brand.name}
						</Link>
						<p className="mt-1 text-[13px] text-ink-400">{brand.website}</p>
					</div>
				</div>
			),
			sortValue: (brand) => brand.name,
		},
		{
			hideable: true,
			key: "slug",
			label: "Slug",
			render: (brand) => brand.slug,
			sortValue: (brand) => brand.slug,
		},
		{
			hideable: true,
			key: "products",
			label: "Products",
			render: (brand) => brand.count,
			sortValue: (brand) => brand.count,
		},
		{
			hideable: true,
			key: "visibility",
			label: "Visibility",
			render: (brand) => brand.visibility,
			sortValue: (brand) => brand.visibility,
		},
		{
			hideable: true,
			key: "status",
			label: "Status",
			render: (brand) => (
				<StatusBadge
					className={statusClass[brand.status]}
					label={capitalize(brand.status)}
				/>
			),
			sortValue: (brand) => brand.status,
		},
	];

	return (
		<EntityTable
			columns={columns}
			deleteMessage="This brand will be permanently removed from your catalog. This action cannot be undone."
			editHref={routes.editBrand}
			filterOptions={[
				{ label: "All", match: () => true, value: "all" },
				{
					label: "Published",
					match: (row) => row.status === "published",
					value: "published",
				},
				{
					label: "Draft",
					match: (row) => row.status === "draft",
					value: "draft",
				},
				{
					label: "Archived",
					match: (row) => row.status === "archived",
					value: "archived",
				},
			]}
			items={rows}
			searchLabel="Search brands"
			searchPlaceholder="Search brands"
			searchText={(brand) => `${brand.name} ${brand.slug} ${brand.website}`}
			singularName="brand"
		/>
	);
}

export function AttributeListTable({
	attributes,
}: {
	attributes: Attribute[];
}) {
	const rows: AttributeRow[] = attributes.map((attribute) => ({
		...attribute,
		id: attribute.name.toLowerCase(),
	}));
	const columns: EntityColumn<AttributeRow>[] = [
		{
			key: "attribute",
			label: "Attribute",
			render: (attribute) => (
				<div>
					<Link
						className="font-semibold text-ink-900 hover:text-brand-600"
						href={routes.addAttribute}
					>
						{attribute.name}
					</Link>
					<p className="mt-1 text-[13px] text-ink-400">
						{attribute.values.join(", ")}
					</p>
				</div>
			),
			sortValue: (attribute) => attribute.name,
		},
		{
			hideable: true,
			key: "type",
			label: "Type",
			render: (attribute) => attribute.type,
			sortValue: (attribute) => attribute.type,
		},
		{
			hideable: true,
			key: "products",
			label: "Products",
			render: (attribute) => attribute.products,
			sortValue: (attribute) => attribute.products,
		},
		{
			hideable: true,
			key: "status",
			label: "Status",
			render: (attribute) => (
				<StatusBadge
					className={statusClass[attribute.status]}
					label={capitalize(attribute.status)}
				/>
			),
			sortValue: (attribute) => attribute.status,
		},
	];

	return (
		<EntityTable
			columns={columns}
			deleteMessage="This attribute will be permanently removed from your catalog. This action cannot be undone."
			editHref={routes.addAttribute}
			filterOptions={[
				{ label: "All types", match: () => true, value: "all" },
				{
					label: "Dropdown",
					match: (row) => row.type === "Dropdown",
					value: "dropdown",
				},
				{
					label: "Swatch",
					match: (row) => row.type === "Swatch",
					value: "swatch",
				},
				{ label: "Text", match: (row) => row.type === "Text", value: "text" },
			]}
			items={rows}
			searchLabel="Search attributes"
			searchPlaceholder="Search attributes"
			searchText={(attribute) =>
				`${attribute.name} ${attribute.type} ${attribute.values.join(" ")}`
			}
			singularName="attribute"
		/>
	);
}

export function CustomerListTable({ customers }: { customers: Customer[] }) {
	const rows: CustomerRow[] = customers.map((customer) => ({
		...customer,
		id: customer.email,
	}));
	const columns: EntityColumn<CustomerRow>[] = [
		{
			key: "customer",
			label: "Customer",
			render: (customer) => (
				<div className="flex items-center gap-3">
					<span
						className={cn(
							"grid h-12 w-12 shrink-0 place-items-center rounded-full text-[14px] font-semibold",
							customer.avatarClass,
						)}
					>
						{customer.name
							.split(" ")
							.map((part) => part[0])
							.join("")}
					</span>
					<div>
						<p className="font-semibold text-ink-900">{customer.name}</p>
						<p className="mt-1 text-[13px] text-ink-400">{customer.email}</p>
					</div>
				</div>
			),
			sortValue: (customer) => customer.name,
		},
		{
			hideable: true,
			key: "segment",
			label: "Segment",
			render: (customer) => customer.segment,
			sortValue: (customer) => customer.segment,
		},
		{
			hideable: true,
			key: "orders",
			label: "Orders",
			render: (customer) => customer.orders,
			sortValue: (customer) => customer.orders,
		},
		{
			hideable: true,
			key: "ltv",
			label: "LTV",
			render: (customer) => customer.ltv,
			sortValue: (customer) => Number(customer.ltv.replace(/[$,]/g, "")),
		},
		{
			hideable: true,
			key: "status",
			label: "Status",
			render: (customer) => (
				<StatusBadge
					className={statusClass[customer.status]}
					label={capitalize(customer.status)}
				/>
			),
			sortValue: (customer) => customer.status,
		},
	];

	return (
		<EntityTable
			columns={columns}
			deleteMessage="This customer profile will be removed from the directory. This action cannot be undone."
			editHref={routes.addUser}
			filterOptions={[
				{ label: "All", match: () => true, value: "all" },
				{
					label: "Active",
					match: (row) => row.status === "active",
					value: "active",
				},
				{
					label: "Review",
					match: (row) => row.status === "review",
					value: "review",
				},
			]}
			items={rows}
			searchLabel="Search customers"
			searchPlaceholder="Search customers"
			searchText={(customer) =>
				`${customer.name} ${customer.email} ${customer.segment}`
			}
			singularName="customer"
		/>
	);
}

function capitalize(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}
