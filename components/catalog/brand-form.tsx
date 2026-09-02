"use client";

import { useState } from "react";
import {
	AssignmentRules,
	FormActions,
	Tabs,
} from "@/components/catalog/category-form";
import {
	Field,
	FormCard,
	FormGuideDrawer,
	RichTextArea,
	SelectField,
} from "@/components/forms/admin-form-primitives";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";
import { cn } from "@/utils/cn";

type BrandFormProps = {
	mode: "add" | "edit";
};

type BrandTab = "general" | "rules" | "seo";

export function BrandForm({ mode }: BrandFormProps) {
	const [tab, setTab] = useState<BrandTab>("general");
	const [status, setStatus] = useState(mode === "edit" ? "Published" : "Draft");
	const [guideOpen, setGuideOpen] = useState(false);
	const title = mode === "edit" ? "Edit Brand" : "Add Brand";
	const description =
		mode === "edit"
			? "Update brand profile, logo, storefront visibility, SEO meta, and product rules."
			: "Create a brand profile with logo, storefront visibility, SEO meta, and product assignment rules.";

	return (
		<>
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div className="min-w-0 max-w-full">
					<Breadcrumb
						items={[
							{ href: routes.dashboard, label: "Home" },
							{ href: routes.brands, label: "Brands" },
							{ label: title },
						]}
					/>
					<h1 className="text-[22px] font-semibold text-ink-900">{title}</h1>
					<p className="mt-1 break-words text-[14px] text-ink-500">
						{description}
					</p>
				</div>
				<button
					className="inline-flex h-10 items-center gap-2 rounded-base border border-surface-line px-4 text-[13px] font-semibold text-ink-700 hover:bg-surface-muted cursor-pointer"
					onClick={() => setGuideOpen(true)}
					type="button"
				>
					<Icon className="h-4 w-4" name="panel-left" />
					Form Guide
				</button>
			</div>
			<form className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="min-w-0 space-y-4 xl:order-1">
					<FormCard title="Brand Logo">
						<label className="group mx-auto grid h-36 w-36 cursor-pointer place-items-center rounded-base bg-brand-50 text-[28px] font-semibold text-brand-600 shadow-soft transition-shadow hover:shadow-lift">
							{mode === "edit" ? (
								"AA"
							) : (
								<Icon className="h-10 w-10 text-brand-300" name="image" />
							)}
							<input
								accept="image/*"
								aria-label="Upload brand logo"
								className="sr-only"
								type="file"
							/>
						</label>
						<p className="mt-4 text-center text-[12px] text-ink-400">
							Upload a square logo for brand tiles and filters.
						</p>
					</FormCard>
					<FormCard title="Status">
						<span
							className={cn(
								"mb-3 block h-2.5 w-2.5 rounded-full",
								status === "Published" ? "bg-success-500" : "bg-warning-500",
							)}
						/>
						<SelectField
							defaultValue={status}
							help="Set the brand status."
							label="Status"
							name="status"
							onChange={setStatus}
							options={["Published", "Draft", "Archived"]}
						/>
					</FormCard>
					<FormCard title="Storefront Placement">
						<SelectField
							defaultValue={mode === "edit" ? "Featured" : "Standard"}
							help="Controls brand visibility on storefront modules."
							label="Visibility"
							name="visibility"
							options={["Featured", "Standard", "Hidden"]}
						/>
					</FormCard>
					<FormCard title="Brand Links">
						<div className="space-y-4">
							<Field
								defaultValue={
									mode === "edit" ? "https://acmeaudio.com" : undefined
								}
								label="Website"
								name="website"
								placeholder="https://example.com"
							/>
							<Field
								defaultValue={
									mode === "edit" ? "support@acmeaudio.com" : undefined
								}
								label="Support Email"
								name="support_email"
								placeholder="support@example.com"
								type="email"
							/>
						</div>
					</FormCard>
					{mode === "edit" ? (
						<FormCard title="Products">
							<p className="text-[30px] font-semibold leading-none text-ink-900">
								42
							</p>
							<p className="mt-2 text-[13px] text-ink-400">Products assigned</p>
							<button
								className="mt-4 inline-flex h-9 items-center gap-2 rounded-base bg-brand-50 px-3 text-[13px] font-semibold text-brand-600 hover:bg-brand-100"
								type="button"
							>
								View products
								<Icon className="h-3.5 w-3.5" name="arrow-up-right" />
							</button>
						</FormCard>
					) : null}
				</aside>
				<div className="min-w-0 space-y-4 xl:order-2">
					<Tabs
						active={tab}
						onChange={(value) => setTab(value)}
						tabs={["general", "seo", "rules"]}
					/>
					{tab === "general" ? (
						<div className="space-y-4">
							<FormCard title="General">
								<div className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<Field
											defaultValue={mode === "edit" ? "Acme Audio" : undefined}
											label="Brand Name"
											name="name"
											placeholder="Brand name"
											required
										/>
										<Field
											defaultValue={mode === "edit" ? "acme-audio" : undefined}
											label="Slug"
											name="slug"
											placeholder="brand-slug"
										/>
									</div>
									<RichTextArea
										defaultValue={
											mode === "edit"
												? "Premium audio accessories, headphones, earbuds, microphones, and portable speakers."
												: undefined
										}
										help="Set a description to the brand for better visibility."
										label="Description"
										name="description"
									/>
								</div>
							</FormCard>
							<FormCard title="Brand Details">
								<div className="grid gap-4 sm:grid-cols-2">
									<Field
										defaultValue={mode === "edit" ? "BR-AA-001" : undefined}
										label="Vendor Code"
										name="vendor_code"
										placeholder="BR-001"
									/>
									<Field
										defaultValue={mode === "edit" ? "United States" : undefined}
										label="Country"
										name="country"
										placeholder="Country"
									/>
									<SelectField
										defaultValue={
											mode === "edit" ? "Electronics" : undefined
										}
										label="Primary Category"
										name="primary_category"
										options={[
											"Electronics",
											"Grocery",
											"Fashion",
											"Home",
										]}
									/>
									<Field
										defaultValue={mode === "edit" ? "1" : undefined}
										label="Sort Order"
										name="sort_order"
										placeholder="0"
										type="number"
									/>
								</div>
							</FormCard>
						</div>
					) : null}
					{tab === "seo" ? (
						<FormCard title="Meta Options">
							<div className="space-y-4">
								<Field
									defaultValue={
										mode === "edit"
											? "Acme Audio - Wireless Headphones and Speakers"
											: undefined
									}
									label="Meta Tag Title"
									name="meta_title"
									placeholder="Meta tag title"
								/>
								<RichTextArea
									defaultValue={
										mode === "edit"
											? "Shop Acme Audio headphones, earbuds, microphones, and portable speakers."
											: undefined
									}
									help="Set a meta tag description to improve SEO ranking."
									label="Meta Description"
									name="meta_description"
								/>
								<Field
									defaultValue={
										mode === "edit"
											? "acme audio, headphones, earbuds, portable speakers"
											: undefined
									}
									label="Meta Keywords"
									name="meta_keywords"
									placeholder="brand, product, keyword"
								/>
							</div>
						</FormCard>
					) : null}
					{tab === "rules" ? (
						<AssignmentRules title="Product Assignment" />
					) : null}
				</div>
			</form>
			<FormActions href={routes.brands} />
			{guideOpen ? (
				<FormGuideDrawer onClose={() => setGuideOpen(false)} />
			) : null}
		</>
	);
}
