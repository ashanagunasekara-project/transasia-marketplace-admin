"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SelectField } from "@/components/forms/admin-form-primitives";
import { Icon } from "@/components/layout/icon";
import { AppSelect } from "@/components/ui/app-select";
import { routes } from "@/config/routes";
import {
	type ApiBrand,
	type ApiCategory,
	type ApiProduct,
	createProduct,
	fetchBrands,
	fetchCategories,
	updateProduct,
	uploadImageFile,
} from "@/lib/api";
import { baseURL, cn } from "@/utils/cn";

type ProductFormMode = "add" | "edit";
type ProductTab = "advanced" | "general" | "reviews" | "seo";
type DiscountType = "fixed" | "none" | "percentage";
type ProductStatus = "archived" | "draft" | "published";
type Variation = {
	attribute: string;
	id: string;
	value: string;
};

type ProductFormProps = {
	description: string;
	formId: string;
	initialData?: ApiProduct | null;
	mode: ProductFormMode;
	subtitle: string;
	title: string;
};

const tabLabels: Record<ProductTab, string> = {
	advanced: "Advanced",
	general: "General",
	reviews: "Reviews",
	seo: "SEO",
};

export function ProductForm({
	description,
	formId,
	initialData,
	mode,
	subtitle,
	title,
}: ProductFormProps) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<ProductTab>("general");
	const [guideOpen, setGuideOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Dynamic Taxonomies
	const [categoriesList, setCategoriesList] = useState<ApiCategory[]>([]);
	const [brandsList, setBrandsList] = useState<ApiBrand[]>([]);

	// Form State
	const [name, setName] = useState(
		initialData?.name || initialData?.title || (mode === "edit" ? "Sample product" : ""),
	);
	const [sku, setSku] = useState(
		initialData?.sku || (mode === "edit" ? "SKU-SAMPLE" : `TA-${Math.floor(1000 + Math.random() * 9000)}`),
	);
	const [posItemCode, setPosItemCode] = useState(initialData?.posItemCode || "");
	const [productDescription, setProductDescription] = useState(initialData?.description || "");
	const [price, setPrice] = useState<string | number>(
		initialData?.price ?? initialData?.basePrice ?? (mode === "edit" ? "199.99" : ""),
	);
	const [wholesalePrice, setWholesalePrice] = useState<string | number>(
		initialData?.wholesalePrice ?? "",
	);
	const [stock, setStock] = useState<string | number>(
		initialData?.stock ?? initialData?.stockQuantity ?? (mode === "edit" ? "25" : "10"),
	);
	const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
		initialData?.categoryId || "",
	);
	const [selectedBrandId, setSelectedBrandId] = useState<string>(
		initialData?.brandId || "",
	);
	const [status, setStatus] = useState<ProductStatus>(
		initialData?.status === "draft" ? "draft" : "published",
	);

	// Images
	const [thumbPreview, setThumbPreview] = useState(
		initialData?.image ||
			(mode === "edit" ? `${baseURL}assets/images/catagory-img/cat-img-shoe-a-01.webp` : ""),
	);
	const [selectedThumbFile, setSelectedThumbFile] = useState<File | null>(null);
	const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
	const [selectedMediaFiles, setSelectedMediaFiles] = useState<File[]>([]);

	// Pricing Discounts
	const [discountType, setDiscountType] = useState<DiscountType>(
		mode === "edit" ? "percentage" : "none",
	);
	const [discountPercent, setDiscountPercent] = useState(10);
	const [variations, setVariations] = useState<Variation[]>([
		{ attribute: "", id: "variation-1", value: "" },
	]);

	const tabs: ProductTab[] =
		mode === "edit"
			? ["general", "advanced", "reviews"]
			: ["general", "advanced", "seo"];

	useEffect(() => {
		async function loadOptions() {
			try {
				const [cats, brs] = await Promise.all([fetchCategories(), fetchBrands()]);
				setCategoriesList(cats);
				setBrandsList(brs);

				if (!selectedCategoryId && cats.length > 0 && mode === "add") {
					setSelectedCategoryId(cats[0].id);
				}
				if (!selectedBrandId && brs.length > 0 && mode === "add") {
					setSelectedBrandId(brs[0].id);
				}
			} catch (e) {
				console.error("Failed to load categories/brands options:", e);
			}
		}
		loadOptions();
	}, []);

	function updateFiles(files: FileList | null, target: "media" | "thumb") {
		if (!files?.length) {
			return;
		}

		if (target === "thumb") {
			setSelectedThumbFile(files[0]);
			setThumbPreview(URL.createObjectURL(files[0]));
			return;
		}

		const newFiles = Array.from(files);
		setSelectedMediaFiles((prev) => [...prev, ...newFiles]);
		setMediaPreviews((current) => [
			...current,
			...newFiles.map((file) => URL.createObjectURL(file)),
		]);
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) {
			setErrorMessage("Product name is required.");
			return;
		}

		const numPrice = parseFloat(String(price));
		if (isNaN(numPrice) || numPrice < 0) {
			setErrorMessage("A valid product base price is required.");
			return;
		}

		const numStock = parseInt(String(stock), 10);
		if (isNaN(numStock) || numStock < 0) {
			setErrorMessage("A valid product stock quantity is required.");
			return;
		}

		try {
			setIsSubmitting(true);
			setErrorMessage(null);

			let uploadedThumb = thumbPreview;
			if (selectedThumbFile) {
				uploadedThumb = await uploadImageFile(selectedThumbFile);
			}

			const uploadedMediaUrls: string[] = [];
			for (const file of selectedMediaFiles) {
				const url = await uploadImageFile(file);
				uploadedMediaUrls.push(url);
			}

			const payload = {
				brandId: selectedBrandId || undefined,
				categoryId: selectedCategoryId || undefined,
				description: productDescription,
				image: uploadedThumb || undefined,
				images: uploadedMediaUrls.length > 0 ? uploadedMediaUrls : undefined,
				name,
				posItemCode: posItemCode.trim() || undefined,
				price: numPrice,
				sku: sku.trim() || undefined,
				status: status === "published" ? "ACTIVE" : status === "draft" ? "DRAFT" : "OUT_OF_STOCK",
				stock: numStock,
				wholesalePrice: wholesalePrice ? parseFloat(String(wholesalePrice)) : undefined,
			};

			if (mode === "edit" && initialData?.id) {
				await updateProduct(initialData.id, payload);
			} else {
				await createProduct(payload);
			}

			router.push(routes.products);
			router.refresh();
		} catch (err: any) {
			console.error("Failed to save product:", err);
			setErrorMessage(err.message || "Failed to save product. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<>
			<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
				<div className="min-w-0 max-w-full">
					<nav className="mb-1 flex items-center gap-1.5 text-[13px] text-ink-400">
						<Link className="hover:text-brand-600" href={routes.dashboard}>
							Home
						</Link>
						<Icon className="h-3.5 w-3.5" name="chevron-right" />
						<Link className="hover:text-brand-600" href={routes.products}>
							Products
						</Link>
						<Icon className="h-3.5 w-3.5" name="chevron-right" />
						<span className="text-ink-700">{subtitle}</span>
					</nav>
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

			{errorMessage ? (
				<div className="mb-4 flex items-center gap-2 rounded-base border border-danger-200 bg-danger-50 p-4 text-[14px] text-danger-700">
					<Icon className="h-5 w-5 shrink-0 text-danger-500" name="alert-circle" />
					<span>{errorMessage}</span>
				</div>
			) : null}

			<form
				className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[280px_minmax(0,1fr)]"
				id={formId}
				onSubmit={handleSubmit}
			>
				<div className="min-w-0 space-y-4 xl:order-2">
					<div
						aria-label="Product form tabs"
						className="flex border-b border-surface-line"
						role="tablist"
					>
						{tabs.map((tab) => {
							const active = activeTab === tab;
							return (
								<button
									aria-selected={active}
									className={cn(
										"relative -mb-px border-b-2 px-4 pb-3 pt-1 text-[14px] font-semibold transition-colors cursor-pointer",
										active
											? "border-brand-600 text-brand-600"
											: "border-transparent text-ink-500 hover:text-ink-700",
									)}
									key={tab}
									onClick={() => setActiveTab(tab)}
									role="tab"
									type="button"
								>
									{tabLabels[tab]}
								</button>
							);
						})}
					</div>

					{activeTab === "general" ? (
						<div className="space-y-4">
							<Card title="General Information">
								<div className="space-y-4">
									<label className="block">
										<span className="text-[13px] font-semibold text-ink-700">
											Product Name <span className="text-danger-500">*</span>
										</span>
										<input
											className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] placeholder:text-ink-400 focus:border-brand-600"
											onChange={(e) => setName(e.target.value)}
											placeholder="e.g. Sony WH-1000XM5, iPhone 15 Pro"
											required
											type="text"
											value={name}
										/>
										<p className="mt-1 text-[12px] text-ink-400">
											A product name is required and recommended to be unique.
										</p>
									</label>

									<div className="grid gap-4 sm:grid-cols-2">
										<label className="block">
											<div className="flex items-center justify-between">
												<span className="text-[13px] font-semibold text-ink-700">
													SKU (Stock Keeping Unit) <span className="text-danger-500">*</span>
												</span>
												<button
													className="text-[12px] text-brand-600 hover:underline cursor-pointer"
													onClick={() => setSku(`TA-${Math.floor(1000 + Math.random() * 9000)}`)}
													type="button"
												>
													Generate SKU
												</button>
											</div>
											<input
												className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] font-mono focus:border-brand-600"
												onChange={(e) => setSku(e.target.value)}
												placeholder="TA-1001"
												required
												type="text"
												value={sku}
											/>
										</label>

										<label className="block">
											<span className="text-[13px] font-semibold text-ink-700">
												POS Item Code (Optional)
											</span>
											<input
												className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] font-mono focus:border-brand-600"
												onChange={(e) => setPosItemCode(e.target.value)}
												placeholder="POS-1001"
												type="text"
												value={posItemCode}
											/>
										</label>
									</div>

									<label className="block">
										<span className="text-[13px] font-semibold text-ink-700">
											Description
										</span>
										<textarea
											className="mt-1.5 min-h-[100px] w-full resize-y rounded-base border border-surface-line bg-surface-body p-3 text-[14px] text-ink-700 placeholder:text-ink-400 focus:border-brand-600"
											onChange={(e) => setProductDescription(e.target.value)}
											placeholder="Detailed description of features, specs, and package contents..."
											rows={3}
											value={productDescription}
										/>
										<p className="mt-1 text-[12px] text-ink-400">
											Set a description to the product for better visibility.
										</p>
									</label>
								</div>
							</Card>

							<Card title="Pricing & Stock Management">
								<div className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-3">
										<label className="block">
											<span className="text-[13px] font-semibold text-ink-700">
												Retail Base Price ($ / LKR) <span className="text-danger-500">*</span>
											</span>
											<input
												className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600"
												min="0"
												onChange={(e) => setPrice(e.target.value)}
												placeholder="0.00"
												required
												step="0.01"
												type="number"
												value={price}
											/>
											<p className="mt-1 text-[12px] text-ink-400">
												Customer retail price.
											</p>
										</label>

										<label className="block">
											<span className="text-[13px] font-semibold text-ink-700">
												Wholesale Price (Optional)
											</span>
											<input
												className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600"
												min="0"
												onChange={(e) => setWholesalePrice(e.target.value)}
												placeholder="0.00"
												step="0.01"
												type="number"
												value={wholesalePrice}
											/>
											<p className="mt-1 text-[12px] text-ink-400">
												Active for approved wholesalers.
											</p>
										</label>

										<label className="block">
											<span className="text-[13px] font-semibold text-ink-700">
												Stock Quantity <span className="text-danger-500">*</span>
											</span>
											<input
												className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600"
												min="0"
												onChange={(e) => setStock(e.target.value)}
												placeholder="0"
												required
												type="number"
												value={stock}
											/>
											<p className="mt-1 text-[12px] text-ink-400">
												Current inventory units.
											</p>
										</label>
									</div>

									<div>
										<span className="text-[13px] font-semibold text-ink-700">
											Discount Type
										</span>
										<div className="mt-2 grid gap-3 sm:grid-cols-3">
											{[
												["none", "No Discount"],
												["percentage", "Percentage %"],
												["fixed", "Fixed Price"],
											].map(([val, label]) => {
												const active = discountType === val;
												return (
													<label
														className={cn(
															"flex cursor-pointer items-center gap-3 rounded-base border px-4 py-3",
															active
																? "border-brand-600 bg-brand-50/60"
																: "border-surface-line hover:bg-surface-muted",
														)}
														key={val}
													>
														<input
															checked={active}
															className="h-4 w-4 border-surface-line text-brand-600 focus:ring-brand-600"
															name="discount_type"
															onChange={() =>
																setDiscountType(val as DiscountType)
															}
															type="radio"
															value={val}
														/>
														<span className="text-[14px] font-semibold text-ink-900">
															{label}
														</span>
													</label>
												);
											})}
										</div>
									</div>

									{discountType !== "none" ? (
										<div>
											<span className="text-[13px] font-semibold text-ink-700">
												{discountType === "percentage"
													? "Discount Percentage (%)"
													: "Fixed Discount Price"}
											</span>
											<input
												aria-label="Discount value"
												className="mt-1.5 h-10 w-full max-w-xs rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600"
												min="0"
												name="discount_value"
												placeholder="0"
												step="0.01"
												type="number"
											/>
										</div>
									) : null}
								</div>
							</Card>

							<Card title="Product Media">
								<label className="flex cursor-pointer flex-col gap-3 rounded-base border-2 border-dashed border-brand-300 bg-brand-50/40 px-5 py-5 transition-colors hover:bg-brand-50 sm:flex-row sm:items-center sm:text-left">
									<span className="grid h-10 w-10 shrink-0 place-items-center rounded-base bg-brand-100 text-brand-600">
										<Icon className="h-5 w-5" name="upload" />
									</span>
									<span>
										<span className="block text-[14px] font-semibold text-ink-900">
											Drop files here or click to upload.
										</span>
										<span className="mt-0.5 block text-[13px] text-ink-400">
											Upload product gallery photos
										</span>
									</span>
									<input
										accept="image/*"
										aria-label="Upload product media"
										className="sr-only"
										multiple
										onChange={(event) =>
											updateFiles(event.target.files, "media")
										}
										type="file"
									/>
								</label>
								{mediaPreviews.length ? (
									<div className="mt-4 flex flex-wrap gap-3">
										{mediaPreviews.map((preview, i) => (
											<div
												className="relative h-20 w-20 overflow-hidden rounded-base border border-surface-line bg-surface-body"
												key={i}
											>
												<img
													alt={`Product preview ${i + 1}`}
													className="h-full w-full object-cover"
													src={preview}
												/>
												<button
													aria-label="Remove media"
													className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-full bg-ink-900/60 text-white hover:bg-danger-500"
													onClick={() => {
														setMediaPreviews((cur) => cur.filter((_, idx) => idx !== i));
														setSelectedMediaFiles((cur) => cur.filter((_, idx) => idx !== i));
													}}
													type="button"
												>
													<Icon className="h-3 w-3" name="x" />
												</button>
											</div>
										))}
									</div>
								) : null}
							</Card>
						</div>
					) : null}

					{activeTab === "advanced" ? (
						<div className="space-y-4">
							<Card title="Inventory & Logistics">
								<div className="space-y-4">
									<div className="grid gap-4 sm:grid-cols-2">
										<label className="block">
											<span className="text-[13px] font-semibold text-ink-700">SKU</span>
											<input
												className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] font-mono focus:border-brand-600"
												onChange={(e) => setSku(e.target.value)}
												value={sku}
											/>
										</label>
										<label className="block">
											<span className="text-[13px] font-semibold text-ink-700">Stock Count</span>
											<input
												className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600"
												min="0"
												onChange={(e) => setStock(e.target.value)}
												type="number"
												value={stock}
											/>
										</label>
									</div>
								</div>
							</Card>

							<Card title="Variations">
								<p className="mb-4 text-[13px] font-semibold text-ink-700">
									Add Product Variations
								</p>
								<div className="space-y-3">
									{variations.map((variation, index) => (
										<div className="flex items-center gap-2" key={variation.id}>
											<AppSelect
												className="flex-1"
												onValueChange={(attribute) =>
													setVariations((current) =>
														current.map((item, itemIndex) =>
															itemIndex === index
																? { ...item, attribute }
																: item,
														),
													)
												}
												options={["Color", "Size", "Material", "Weight"]}
												placeholder="Select a variation"
												value={variation.attribute || undefined}
											/>
											<input
												className="h-10 flex-1 rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600"
												onChange={(event) =>
													setVariations((current) =>
														current.map((item, itemIndex) =>
															itemIndex === index
																? { ...item, value: event.target.value }
																: item,
														),
													)
												}
												placeholder="Variation"
												type="text"
												value={variation.value}
											/>
											<button
												className="grid h-9 w-9 shrink-0 place-items-center rounded-base border border-danger-100 bg-danger-50 text-danger-500 hover:bg-danger-100"
												onClick={() =>
													setVariations((current) =>
														current.length > 1
															? current.filter(
																(_, itemIndex) => itemIndex !== index,
															)
															: current,
													)
												}
												type="button"
											>
												<Icon className="h-4 w-4" name="x" />
											</button>
										</div>
									))}
								</div>
								<button
									className="mt-4 inline-flex h-10 items-center gap-2 rounded-base border border-surface-line px-4 text-[13px] font-semibold text-ink-700 hover:bg-surface-muted cursor-pointer"
									onClick={() =>
										setVariations((current) => [
											...current,
											{
												attribute: "",
												id: `variation-${Date.now()}`,
												value: "",
											},
										])
									}
									type="button"
								>
									<Icon className="h-4 w-4" name="plus" />
									Add variation
								</button>
							</Card>
						</div>
					) : null}

					{activeTab === "seo" ? (
						<div className="space-y-4">
							<Card title="Meta Options">
								<div className="space-y-4">
									<label className="block">
										<span className="text-[13px] font-semibold text-ink-700">Meta Tag Title</span>
										<input
											className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600"
											defaultValue={name ? `${name} - TransAsia` : ""}
											placeholder="Meta tag name"
										/>
									</label>
								</div>
							</Card>
						</div>
					) : null}

					{activeTab === "reviews" ? <ReviewsPanel /> : null}
				</div>

				{/* Sidebar */}
				<div className="min-w-0 space-y-4 xl:order-1">
					<Card title="Thumbnail" titleTag="h3">
						<div className="flex flex-col items-center text-center">
							<label className="group relative grid h-36 w-36 cursor-pointer place-items-center overflow-hidden rounded-base bg-surface-card shadow-soft transition-shadow hover:shadow-lift">
								<span className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-surface-card text-ink-400 shadow-card transition-colors group-hover:text-brand-600">
									<Icon className="h-3.5 w-3.5" name="pencil" />
								</span>
								{thumbPreview ? (
									<Image
										alt="Thumbnail preview"
										className="absolute inset-0 h-full w-full object-cover p-2"
										height={144}
										src={thumbPreview}
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
									aria-label="Upload thumbnail image"
									className="sr-only"
									onChange={(event) => updateFiles(event.target.files, "thumb")}
									type="file"
								/>
							</label>
							<p className="mt-4 text-[12px] text-ink-400">
								Set the main product thumbnail image.
							</p>
						</div>
					</Card>

					<Card
						title="Status"
						titleEnd={
							<span
								aria-label={`Current status: ${status}`}
								className={cn(
									"h-2.5 w-2.5 rounded-full",
									status === "published"
										? "bg-success-500"
										: status === "draft"
											? "bg-warning-500"
											: "bg-ink-300",
								)}
								role="status"
							/>
						}
						titleTag="h3"
					>
						<AppSelect
							name="status"
							onValueChange={(value) => setStatus(value as ProductStatus)}
							options={[
								{ label: "Published", value: "published" },
								{ label: "Draft", value: "draft" },
								{ label: "Archived", value: "archived" },
							]}
							value={status}
						/>
						<p className="mt-2 text-[12px] text-ink-400">
							Set whether this product is visible on the storefront.
						</p>
					</Card>

					<Card title="Product Taxonomy" titleTag="h3">
						<div className="space-y-4">
							<div>
								<span className="text-[13px] font-semibold text-ink-700">Category</span>
								<select
									className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] text-ink-700 focus:border-brand-600"
									onChange={(e) => setSelectedCategoryId(e.target.value)}
									value={selectedCategoryId}
								>
									<option value="">Select a Category...</option>
									{categoriesList.map((c) => (
										<option key={c.id} value={c.id}>
											{c.title || c.name}
										</option>
									))}
								</select>
							</div>

							<Link
								className="inline-flex h-9 items-center gap-1.5 rounded-base bg-brand-50 px-3 text-[13px] font-semibold text-brand-600 hover:bg-brand-100 hover:text-brand-700"
								href={routes.addCategory}
							>
								<Icon className="h-3.5 w-3.5" name="plus" />
								Add new category
							</Link>

							<div>
								<span className="text-[13px] font-semibold text-ink-700">Brand</span>
								<select
									className="mt-1.5 h-10 w-full rounded-base border border-surface-line bg-surface-body px-3 text-[14px] text-ink-700 focus:border-brand-600"
									onChange={(e) => setSelectedBrandId(e.target.value)}
									value={selectedBrandId}
								>
									<option value="">Select a Brand (Optional)...</option>
									{brandsList.map((b) => (
										<option key={b.id} value={b.id}>
											{b.name}
										</option>
									))}
								</select>
							</div>
						</div>
					</Card>
				</div>
			</form>

			<div className="mt-6 flex items-center justify-end gap-3 border-t border-surface-line pt-5">
				<Link
					className="inline-flex h-10 items-center gap-2 rounded-base border border-surface-line px-5 text-[14px] font-semibold text-ink-700 hover:bg-surface-muted"
					href={routes.products}
				>
					Cancel
				</Link>
				<button
					className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700 disabled:opacity-50 cursor-pointer"
					disabled={isSubmitting}
					form={formId}
					type="submit"
				>
					<Icon className="h-4 w-4" name="save" />
					{isSubmitting ? "Saving Product..." : "Save Changes"}
				</button>
			</div>

			{guideOpen ? (
				<FormGuideDrawer onClose={() => setGuideOpen(false)} />
			) : null}
		</>
	);
}

type CardProps = {
	children: React.ReactNode;
	title: string;
	titleEnd?: React.ReactNode;
	titleTag?: "h2" | "h3";
};

function Card({ children, title, titleEnd, titleTag = "h2" }: CardProps) {
	const Title = titleTag;

	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-5 shadow-card">
			{titleEnd ? (
				<div className="mb-4 flex items-center justify-between gap-2">
					<Title className="text-[16px] font-semibold text-ink-900">
						{title}
					</Title>
					{titleEnd}
				</div>
			) : (
				<Title className="mb-4 text-[16px] font-semibold text-ink-900">
					{title}
				</Title>
			)}
			{children}
		</article>
	);
}

function ReviewsPanel() {
	return (
		<div className="space-y-4">
			<Card title="Review Overview">
				<div className="grid gap-4 sm:grid-cols-3">
					{[
						["Total Reviews", "0", "text-ink-900"],
						["Approved", "0", "text-success-600"],
						["Pending", "0", "text-warning-600"],
					].map(([label, val, valueClass]) => (
						<div
							className="rounded-base border border-surface-line bg-surface-body p-4"
							key={label}
						>
							<p className="text-[13px] text-ink-400">{label}</p>
							<p className={cn("mt-2 text-[22px] font-semibold", valueClass)}>
								{val}
							</p>
						</div>
					))}
				</div>
			</Card>
		</div>
	);
}

type FormGuideDrawerProps = {
	onClose: () => void;
};

function FormGuideDrawer({ onClose }: FormGuideDrawerProps) {
	return (
		<div
			aria-modal="true"
			className="fixed inset-0 z-50 flex justify-end"
			role="dialog"
		>
			<button
				aria-label="Close form guide"
				className="absolute inset-0 bg-ink-900/45"
				onClick={onClose}
				type="button"
			/>
			<aside className="relative ml-auto flex h-full w-full max-w-md flex-col bg-surface-card shadow-lift">
				<div className="flex items-start justify-between gap-4 border-b border-surface-line px-5 py-4">
					<div>
						<p className="text-[12px] font-semibold uppercase tracking-wide text-brand-600">
							Form Guide
						</p>
						<h2 className="mt-1 text-[18px] font-semibold text-ink-900">
							Product creation tips
						</h2>
						<p className="mt-1 text-[13px] text-ink-500">
							Ensure product name, price, stock, and category are filled before publishing.
						</p>
					</div>
					<button
						aria-label="Close form guide"
						className="grid h-9 w-9 shrink-0 place-items-center rounded-base border border-surface-line text-ink-500 hover:bg-surface-muted hover:text-ink-900"
						onClick={onClose}
						type="button"
					>
						<Icon className="h-4 w-4" name="x" />
					</button>
				</div>
				<div className="flex-1 overflow-y-auto px-5 py-5">
					<div className="space-y-4">
						<section className="rounded-base border border-surface-line p-4">
							<h3 className="text-[14px] font-semibold text-ink-900">
								Essential fields
							</h3>
							<ul className="mt-3 space-y-2 text-[13px] text-ink-500">
								<li className="flex gap-2">
									<Icon className="mt-0.5 h-4 w-4 text-success-500" name="check" />
									Product name and unique SKU.
								</li>
								<li className="flex gap-2">
									<Icon className="mt-0.5 h-4 w-4 text-success-500" name="check" />
									Retail price & stock quantity.
								</li>
								<li className="flex gap-2">
									<Icon className="mt-0.5 h-4 w-4 text-success-500" name="check" />
									Category selection for catalog grouping.
								</li>
							</ul>
						</section>
					</div>
				</div>
			</aside>
		</div>
	);
}
