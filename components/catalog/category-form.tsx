"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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
import { baseURL, cn } from "@/utils/cn";

type CategoryFormProps = {
	mode: "add" | "edit";
};

type Tab = "general" | "rules" | "seo";

export function CategoryForm({ mode }: CategoryFormProps) {
	const [tab, setTab] = useState<Tab>("general");
	const [status, setStatus] = useState(mode === "edit" ? "Published" : "Draft");
	const [guideOpen, setGuideOpen] = useState(false);
	const [thumb, setThumb] = useState(
		mode === "edit"
			? `${baseURL}assets/images/catagory-img/cat-bg-headphones-01.webp`
			: "",
	);

	const title = mode === "edit" ? "Edit Category" : "Add Category";
	const description =
		mode === "edit"
			? "Update merchandising, SEO meta, thumbnail, and product assignment rules."
			: "Create a merchandising group with thumbnail, SEO meta, and product assignment rules.";

	return (
		<>
			<FormHeader
				current={title}
				description={description}
				onGuideOpen={() => setGuideOpen(true)}
				title={title}
			/>
			<form className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
				<aside className="min-w-0 space-y-4 xl:order-1">
					<FormCard title="Thumbnail">
						<div className="flex flex-col items-center text-center">
							<label className="group relative grid h-36 w-36 cursor-pointer place-items-center overflow-hidden rounded-base bg-surface-card shadow-soft transition-shadow hover:shadow-lift">
								<span className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-surface-card text-ink-400 shadow-card transition-colors group-hover:text-brand-600">
									<Icon className="h-3.5 w-3.5" name="pencil" />
								</span>
								{thumb ? (
									<Image
										alt="Category thumbnail preview"
										className="absolute inset-0 h-full w-full object-cover p-2"
										height={144}
										src={thumb}
										width={144}
									/>
								) : (
									<span className="grid h-20 w-20 -rotate-6 place-items-center rounded-base bg-brand-50 text-brand-200">
										<Icon
											className="h-10 w-10 transition-colors group-hover:text-brand-400"
											name="image"
										/>
									</span>
								)}
								<input
									accept=".png,.jpg,.jpeg,.webp"
									aria-label="Upload category thumbnail"
									className="sr-only"
									onChange={(event) => {
										const file = event.target.files?.[0];
										if (file) {
											setThumb(URL.createObjectURL(file));
										}
									}}
									type="file"
								/>
							</label>
							<p className="mt-4 text-[12px] text-ink-400">
								Set the category thumbnail image. Only image files are accepted.
							</p>
						</div>
					</FormCard>
					<FormCard
						title="Status"
						titleEnd={
							<span
								aria-label={`Current status: ${status}`}
								className={cn(
									"h-2.5 w-2.5 rounded-full",
									status === "Published" ? "bg-success-500" : "bg-warning-500",
								)}
								role="status"
							/>
						}
					>
						<SelectField
							defaultValue={status}
							help="Set the category status."
							hideLabel
							label="Status"
							name="status"
							onChange={setStatus}
							options={["Published", "Draft"]}
						/>
					</FormCard>
					{mode === "edit" ? (
						<FormCard title="Category Products">
							<div className="flex items-center justify-between gap-3">
								<span className="text-[14px] text-ink-500">
									Assigned products
								</span>
								<span className="text-[18px] font-semibold text-ink-900">
									42
								</span>
							</div>
							<button
								className="mt-4 flex h-9 w-full items-center justify-center gap-2 rounded-base bg-brand-50 text-[13px] font-semibold text-brand-600 hover:bg-brand-100"
								type="button"
							>
								View products
								<Icon className="h-3.5 w-3.5" name="arrow-up-right" />
							</button>
						</FormCard>
					) : null}
					<FormCard title="Store Template">
						<SelectField
							defaultValue={
								mode === "edit" ? "Featured template" : "Default template"
							}
							help="Assign a template from your current theme to define how the category products are displayed."
							label="Select a store template"
							name="template"
							options={[
								"Default template",
								"Featured template",
								"Compact template",
							]}
						/>
					</FormCard>
				</aside>
				<div className="min-w-0 space-y-4 xl:order-2">
					<Tabs
						active={tab}
						onChange={setTab}
						tabs={["general", "seo", "rules"]}
					/>
					{tab === "general" ? (
						<FormCard title="General">
							<div className="space-y-4">
								<Field
									defaultValue={mode === "edit" ? "Headphones" : undefined}
									help="A category name is required and recommended to be unique."
									label="Category Name"
									name="name"
									placeholder="Category name"
									required
								/>
								<RichTextArea
									defaultValue={
										mode === "edit"
											? "Premium over-ear and in-ear headphones, including wireless and noise-cancelling models."
											: undefined
									}
									help="Set a description to the category for better visibility."
									label="Description"
									name="description"
								/>
							</div>
						</FormCard>
					) : null}
					{tab === "seo" ? (
						<FormCard title="SEO">
							<div className="space-y-4">
								<Field
									defaultValue={
										mode === "edit" ? "Headphones - Unimart" : undefined
									}
									help="Recommended to be simple and precise keywords."
									label="Meta Tag Title"
									name="meta_title"
									placeholder="Meta tag name"
								/>
								<RichTextArea
									defaultValue={
										mode === "edit"
											? "Shop wireless and noise-cancelling headphones from top brands."
											: undefined
									}
									help="Set a meta tag description to improve SEO ranking."
									label="Meta Description"
									name="meta_description"
								/>
								<Field
									defaultValue={
										mode === "edit"
											? "headphones, wireless, audio, earbuds"
											: undefined
									}
									help="Separate keywords with a comma."
									label="Meta Keywords"
									name="meta_keywords"
									placeholder="e.g. headphones, audio"
								/>
							</div>
						</FormCard>
					) : null}
					{tab === "rules" ? (
						<AssignmentRules title="Rules / Automation" />
					) : null}
				</div>
			</form>
			<FormActions href={routes.categories} />
			{guideOpen ? (
				<FormGuideDrawer onClose={() => setGuideOpen(false)} />
			) : null}
		</>
	);
}

export function FormHeader({
	current,
	description,
	onGuideOpen,
	title,
}: {
	current: string;
	description: string;
	onGuideOpen: () => void;
	title: string;
}) {
	return (
		<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
			<div className="min-w-0 max-w-full">
				<Breadcrumb
					items={[
						{ href: routes.dashboard, label: "Home" },
						{ href: routes.categories, label: "Catalog" },
						{ label: current },
					]}
				/>
				<h1 className="text-[22px] font-semibold text-ink-900">{title}</h1>
				<p className="mt-1 break-words text-[14px] text-ink-500">
					{description}
				</p>
			</div>
			<button
				className="inline-flex h-10 items-center gap-2 rounded-base border border-surface-line px-4 text-[13px] font-semibold text-ink-700 hover:bg-surface-muted cursor-pointer"
				onClick={onGuideOpen}
				type="button"
			>
				<Icon className="h-4 w-4" name="panel-left" />
				Form Guide
			</button>
		</div>
	);
}

export function Tabs({
	active,
	onChange,
	tabs,
}: {
	active: string;
	onChange: (tab: Tab) => void;
	tabs: Tab[];
}) {
	const labels: Record<Tab, string> = {
		general: "General",
		rules: "Rules",
		seo: "SEO",
	};

	return (
		<div
			aria-label="Form tabs"
			className="flex gap-2"
			role="tablist"
		>
			{tabs.map((tab) => (
				<button
					aria-selected={active === tab}
					className={cn(
						"relative border px-4 pb-2 pt-1.5 text-sm! rounded-md font-semibold! transition-colors",
						active === tab
							? "bg-brand-600 border-brand-600 text-white"
							: "bg-white border-surface-line text-ink-500 hover:text-ink-700",
					)}
					key={tab}
					onClick={() => onChange(tab)}
					role="tab"
					type="button"
				>
					{labels[tab]}
				</button>
			))}
		</div>
	);
}

export function AssignmentRules({ title }: { title: string }) {
	const [method, setMethod] = useState("Manual");
	return (
		<FormCard title={title}>
			<div className="space-y-4">
				<div>
					<span className="text-[13px] font-semibold text-ink-700">
						Assignment Method
					</span>
					<div className="mt-2 grid gap-3 sm:grid-cols-2">
						{["Manual", "Automatic"].map((value) => (
							<label
								className={cn(
									"flex cursor-pointer items-center gap-3 rounded-base border px-4 py-3",
									method === value
										? "border-brand-600 bg-brand-50/60"
										: "border-surface-line hover:bg-surface-muted",
								)}
								key={value}
							>
								<input
									checked={method === value}
									className="h-4 w-4 border-surface-line text-brand-600 focus:ring-brand-600"
									name="assignment_method"
									onChange={() => setMethod(value)}
									type="radio"
									value={value}
								/>
								<span className="text-[14px] font-semibold text-ink-900">
									{value}
								</span>
							</label>
						))}
					</div>
				</div>
				{method === "Automatic" ? (
					<div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
						<SelectField
							label="Condition"
							name="condition"
							options={["Product tag", "Brand", "Price"]}
						/>
						<Field
							label="Value"
							name="condition_value"
							placeholder="e.g. audio"
						/>
						<button
							className="h-10 self-end rounded-base border border-surface-line px-4 text-[13px] font-semibold text-ink-700 hover:bg-surface-muted"
							type="button"
						>
							Add
						</button>
					</div>
				) : (
					<p className="rounded-base bg-surface-muted p-4 text-[13px] text-ink-500">
						Products can be assigned manually from product edit pages.
					</p>
				)}
			</div>
		</FormCard>
	);
}

export function FormActions({ href }: { href: string }) {
	return (
		<div className="mt-6 flex items-center justify-end gap-3 border-t border-surface-line pt-5">
			<Link
				className="inline-flex h-10 items-center gap-2 rounded-base border border-surface-line px-5 text-[14px] font-semibold text-ink-700 hover:bg-surface-muted"
				href={href}
			>
				Cancel
			</Link>
			<button
				className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700"
				type="submit"
			>
				<Icon className="h-4 w-4" name="save" />
				Save Changes
			</button>
		</div>
	);
}
