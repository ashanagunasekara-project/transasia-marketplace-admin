"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import {
	fetchPopularCategories,
	updatePopularCategories,
	uploadImageFile,
	resolveImageUrl,
	type PopularCategoriesResponse,
	type PopularCategoryItem,
	type PopularCategoriesDealBanner,
} from "@/lib/api";

export default function PopularCategoriesPage() {
	const [data, setData] = useState<PopularCategoriesResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [statusMessage, setStatusMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);

	const [uploadingTarget, setUploadingTarget] = useState<
		"deal" | { categoryIndex: number } | null
	>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		async function loadData() {
			try {
				setLoading(true);
				const res = await fetchPopularCategories();
				setData(res);
			} catch (err: any) {
				setStatusMessage({
					text: err.message || "Failed to load popular categories",
					type: "error",
				});
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	const handleSave = async () => {
		if (!data) return;
		try {
			setSaving(true);
			setStatusMessage(null);
			const res = await updatePopularCategories(data);
			setData(res);
			setStatusMessage({
				text: "Popular categories & deal banner updated successfully! Live on storefront.",
				type: "success",
			});
		} catch (err: any) {
			setStatusMessage({
				text: err.message || "Failed to save popular categories",
				type: "error",
			});
		} finally {
			setSaving(false);
		}
	};

	const triggerUpload = (target: "deal" | { categoryIndex: number }) => {
		setUploadingTarget(target);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
			fileInputRef.current.click();
		}
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !uploadingTarget || !data) return;

		try {
			const url = await uploadImageFile(file);
			if (uploadingTarget === "deal") {
				setData({
					...data,
					dealBanner: {
						...data.dealBanner,
						imgSrc: url,
					},
				});
			} else {
				const updatedCategories = [...data.categories];
				updatedCategories[uploadingTarget.categoryIndex] = {
					...updatedCategories[uploadingTarget.categoryIndex],
					imgSrc: url,
				};
				setData({
					...data,
					categories: updatedCategories,
				});
			}
			setStatusMessage({
				text: "Image uploaded successfully! Click 'Save Changes' to apply.",
				type: "success",
			});
		} catch (err: any) {
			setStatusMessage({
				text: err.message || "Failed to upload image",
				type: "error",
			});
		} finally {
			setUploadingTarget(null);
		}
	};

	const updateCategoryField = (
		index: number,
		field: keyof PopularCategoryItem,
		value: any,
	) => {
		if (!data) return;
		const updatedCategories = [...data.categories];
		updatedCategories[index] = {
			...updatedCategories[index],
			[field]: value,
		};
		setData({ ...data, categories: updatedCategories });
	};

	const updateSubCategory = (
		catIndex: number,
		subIndex: number,
		field: "title" | "href",
		value: string,
	) => {
		if (!data) return;
		const updatedCategories = [...data.categories];
		const updatedSubs = [...updatedCategories[catIndex].subCategories];
		updatedSubs[subIndex] = {
			...updatedSubs[subIndex],
			[field]: value,
		};
		updatedCategories[catIndex] = {
			...updatedCategories[catIndex],
			subCategories: updatedSubs,
		};
		setData({ ...data, categories: updatedCategories });
	};

	const addSubCategory = (catIndex: number) => {
		if (!data) return;
		const updatedCategories = [...data.categories];
		const updatedSubs = [
			...updatedCategories[catIndex].subCategories,
			{ href: "/shop-by-category", title: "New Link" },
		];
		updatedCategories[catIndex] = {
			...updatedCategories[catIndex],
			subCategories: updatedSubs,
		};
		setData({ ...data, categories: updatedCategories });
	};

	const removeSubCategory = (catIndex: number, subIndex: number) => {
		if (!data) return;
		const updatedCategories = [...data.categories];
		const updatedSubs = updatedCategories[catIndex].subCategories.filter(
			(_, i) => i !== subIndex,
		);
		updatedCategories[catIndex] = {
			...updatedCategories[catIndex],
			subCategories: updatedSubs,
		};
		setData({ ...data, categories: updatedCategories });
	};

	const updateDealBanner = (
		field: keyof PopularCategoriesDealBanner,
		value: string,
	) => {
		if (!data) return;
		setData({
			...data,
			dealBanner: {
				...data.dealBanner,
				[field]: value,
			},
		});
	};

	return (
		<>
			{/* Hidden file input */}
			<input
				accept="image/*"
				className="hidden"
				onChange={handleFileUpload}
				ref={fileInputRef}
				type="file"
			/>

			<PageHeader
				actions={
					<button
						className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
						disabled={saving || loading || !data}
						onClick={handleSave}
						type="button"
					>
						<Icon className="h-4 w-4" name="save" />
						{saving ? "Saving..." : "Save Changes"}
					</button>
				}
				description="Manage the 6 showcase categories, images (rbt-image-portion), titles, target links, and the side deal promotion card."
				eyebrow="Home Banners"
				title="Popular By Categories"
			/>

			{statusMessage && (
				<div
					className={`mb-6 flex items-center justify-between rounded-base p-4 text-[14px] ${
						statusMessage.type === "success"
							? "border border-success-200 bg-success-50 text-success-800"
							: "border border-rose-200 bg-rose-50 text-rose-800"
					}`}
				>
					<div className="flex items-center gap-2">
						<Icon
							className="h-5 w-5"
							name={statusMessage.type === "success" ? "check" : "circle-alert"}
						/>
						<span>{statusMessage.text}</span>
					</div>
					<button
						className="text-ink-500 hover:text-ink-800"
						onClick={() => setStatusMessage(null)}
						type="button"
					>
						<Icon className="h-4 w-4" name="x" />
					</button>
				</div>
			)}

			{loading || !data ? (
				<div className="flex h-64 items-center justify-center rounded-base border border-surface-line bg-surface-card">
					<div className="flex items-center gap-3 text-ink-500">
						<Icon className="h-5 w-5 animate-spin" name="refresh-ccw" />
						<span>Loading popular categories...</span>
					</div>
				</div>
			) : (
				<div className="space-y-6">
					{/* Section Header Controls */}
					<div className="rounded-base border border-surface-line bg-surface-card p-5 shadow-xs">
						<h3 className="mb-4 text-[16px] font-bold text-ink-900">
							Section Header Settings
						</h3>
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label className="mb-1 block text-[13px] font-semibold text-ink-800">
									Section Title
								</label>
								<input
									className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
									onChange={(e) =>
										setData({ ...data, sectionTitle: e.target.value })
									}
									value={data.sectionTitle}
								/>
							</div>
							<div>
								<label className="mb-1 block text-[13px] font-semibold text-ink-800">
									View All Categories Link
								</label>
								<input
									className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
									onChange={(e) =>
										setData({ ...data, viewAllLink: e.target.value })
									}
									value={data.viewAllLink}
								/>
							</div>
						</div>
					</div>

					{/* 6 Category Items Grid */}
					<div className="rounded-base border border-surface-line bg-surface-card p-5 shadow-xs">
						<div className="mb-4 flex items-center justify-between border-b border-surface-line pb-3">
							<div>
								<h3 className="text-[16px] font-bold text-ink-900">
									6 Showcase Categories
								</h3>
								<p className="text-[13px] text-ink-500">
									Manage category titles, responsive product images (rbt-image-portion), and subcategory links.
								</p>
							</div>
							<span className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-bold text-brand-700">
								{data.categories.length} Categories
							</span>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{data.categories.map((category, idx) => (
								<div
									className="flex flex-col justify-between rounded-base border border-surface-line bg-surface-muted/30 p-4 transition-all hover:border-brand-300"
									key={category.id || idx}
								>
									<div>
										<div className="mb-3 flex items-center justify-between">
											<span className="rounded bg-brand-100 px-2 py-0.5 text-[11px] font-bold text-brand-800">
												Slot #{idx + 1}
											</span>
											<span className="text-[12px] text-ink-400">
												ID: {category.id}
											</span>
										</div>

										{/* Image Portion */}
										<div className="mb-4 rounded-base border border-surface-line bg-surface-card p-3">
											<div className="mb-2 flex items-center justify-between">
												<span className="text-[12px] font-bold text-ink-700">
													Image (rbt-image-portion)
												</span>
												<span className="text-[10px] text-ink-400">
													93 × 93 px transparent
												</span>
											</div>
											<div className="flex items-center gap-3">
												<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-surface-line bg-surface-muted p-1">
													<Image
														alt={category.title}
														className="object-contain"
														fill
														src={resolveImageUrl(category.imgSrc)}
													/>
												</div>
												<div className="flex-1 space-y-1.5">
													<button
														className="inline-flex h-7 items-center gap-1 rounded-base border border-surface-line bg-surface-card px-2.5 text-[11px] font-semibold text-ink-700 hover:bg-surface-muted"
														onClick={() =>
															triggerUpload({ categoryIndex: idx })
														}
														type="button"
													>
														<Icon className="h-3 w-3" name="upload" />
														Upload Image
													</button>
													<input
														className="h-7 w-full rounded border border-surface-line px-2 text-[11px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
														onChange={(e) =>
															updateCategoryField(
																idx,
																"imgSrc",
																e.target.value,
															)
														}
														placeholder="/assets/images/..."
														value={category.imgSrc}
													/>
												</div>
											</div>
										</div>

										{/* Category Title & Link */}
										<div className="mb-3 space-y-2">
											<div>
												<label className="mb-0.5 block text-[11px] font-semibold text-ink-700">
													Category Title
												</label>
												<input
													className="h-8 w-full rounded border border-surface-line px-2 text-[12px] font-medium text-ink-800 focus:border-brand-500 focus:outline-hidden"
													onChange={(e) =>
														updateCategoryField(
															idx,
															"title",
															e.target.value,
														)
													}
													value={category.title}
												/>
											</div>
											<div>
												<label className="mb-0.5 block text-[11px] font-semibold text-ink-700">
													Category Target Link
												</label>
												<input
													className="h-8 w-full rounded border border-surface-line px-2 text-[12px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
													onChange={(e) =>
														updateCategoryField(
															idx,
															"link",
															e.target.value,
														)
													}
													value={category.link}
												/>
											</div>
										</div>

										{/* Subcategories (Related Quick Links) */}
										<div>
											<div className="mb-1.5 flex items-center justify-between">
												<label className="text-[11px] font-semibold text-ink-700">
													Related Links ({category.subCategories?.length || 0})
												</label>
												<button
													className="text-[11px] font-bold text-brand-600 hover:text-brand-700"
													onClick={() => addSubCategory(idx)}
													type="button"
												>
													+ Add Link
												</button>
											</div>

											<div className="space-y-1.5">
												{category.subCategories?.map((sub, sIdx) => (
													<div
														className="flex items-center gap-1.5"
														key={sIdx}
													>
														<input
															className="h-7 flex-1 rounded border border-surface-line px-2 text-[11px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
															onChange={(e) =>
																updateSubCategory(
																	idx,
																	sIdx,
																	"title",
																	e.target.value,
																)
															}
															placeholder="Link Title"
															value={sub.title}
														/>
														<input
															className="h-7 w-28 rounded border border-surface-line px-2 text-[11px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
															onChange={(e) =>
																updateSubCategory(
																	idx,
																	sIdx,
																	"href",
																	e.target.value,
																)
															}
															placeholder="/link"
															value={sub.href}
														/>
														<button
															className="rounded p-1 text-ink-400 hover:text-rose-600"
															onClick={() =>
																removeSubCategory(idx, sIdx)
															}
															title="Remove link"
															type="button"
														>
															<Icon className="h-3.5 w-3.5" name="x" />
														</button>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Side Deal Promotion Banner Card */}
					<div className="rounded-base border border-surface-line bg-surface-card p-5 shadow-xs">
						<div className="mb-4 border-b border-surface-line pb-3">
							<h3 className="text-[16px] font-bold text-ink-900">
								Adjacent Promotion Banner Card
							</h3>
							<p className="text-[13px] text-ink-500">
								Configures the featured banner card displayed directly next to the 6 categories (e.g., Weekend Deal).
							</p>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{/* Form Inputs */}
							<div className="space-y-3">
								<div>
									<label className="mb-1 block text-[13px] font-semibold text-ink-800">
										Subtitle
									</label>
									<input
										className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
										onChange={(e) =>
											updateDealBanner("subtitle", e.target.value)
										}
										placeholder="Weekend Deal"
										value={data.dealBanner.subtitle}
									/>
								</div>
								<div>
									<label className="mb-1 block text-[13px] font-semibold text-ink-800">
										Primary Title
									</label>
									<input
										className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
										onChange={(e) =>
											updateDealBanner("title", e.target.value)
										}
										placeholder="DJI Ronin Action"
										value={data.dealBanner.title}
									/>
								</div>
								<div>
									<label className="mb-1 block text-[13px] font-semibold text-ink-800">
										Secondary Title
									</label>
									<input
										className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
										onChange={(e) =>
											updateDealBanner("secondaryTitle", e.target.value)
										}
										placeholder="Super holiday"
										value={data.dealBanner.secondaryTitle}
									/>
								</div>
								<div>
									<label className="mb-1 block text-[13px] font-semibold text-ink-800">
										Target Link
									</label>
									<input
										className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
										onChange={(e) =>
											updateDealBanner("link", e.target.value)
										}
										placeholder="/shop"
										value={data.dealBanner.link}
									/>
								</div>
								<div>
									<label className="mb-1 block text-[13px] font-semibold text-ink-800">
										Image URL or Path
									</label>
									<div className="flex gap-2">
										<input
											className="h-10 flex-1 rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
											onChange={(e) =>
												updateDealBanner("imgSrc", e.target.value)
											}
											placeholder="/assets/images/catagory-img/banner-cat-01.webp"
											value={data.dealBanner.imgSrc}
										/>
										<button
											className="inline-flex h-10 items-center gap-1.5 rounded-base border border-surface-line bg-surface-muted px-4 text-[13px] font-semibold text-ink-700 hover:bg-surface-line"
											onClick={() => triggerUpload("deal")}
											type="button"
										>
											<Icon className="h-4 w-4" name="upload" />
											Upload
										</button>
									</div>
								</div>
							</div>

							{/* Live Card Preview */}
							<div>
								<span className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-ink-500">
									Card Preview
								</span>
								<div className="relative flex flex-col items-center justify-between rounded-base border border-surface-line bg-linear-to-b from-sky-50 to-indigo-50/50 p-6 text-center shadow-xs">
									<p className="text-[12px] font-semibold uppercase tracking-wider text-brand-600">
										{data.dealBanner.subtitle || "Weekend Deal"}
									</p>
									<h4 className="mt-1 text-[20px] font-black text-ink-900">
										{data.dealBanner.title || "Featured Deal"}
									</h4>
									<h5 className="text-[15px] font-medium text-ink-600">
										{data.dealBanner.secondaryTitle || "Super holiday"}
									</h5>
									<div className="relative my-4 h-44 w-full">
										<Image
											alt="Deal Banner"
											className="object-contain"
											fill
											src={resolveImageUrl(data.dealBanner.imgSrc)}
										/>
									</div>
									<span className="rounded-full bg-brand-600 px-4 py-1.5 text-[12px] font-bold text-white shadow-xs">
										Shop Promotion
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
