"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import {
	fetchHeroBanners,
	updateHeroBanners,
	uploadImageFile,
	resolveImageUrl,
	type HeroBannerItem,
} from "@/lib/api";

export default function HeroBannersPage() {
	const [banners, setBanners] = useState<HeroBannerItem[]>([]);
	const [autoShift, setAutoShift] = useState(true);
	const [autoShiftDelay, setAutoShiftDelay] = useState(3500);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [uploadingIndex, setUploadingIndex] = useState<{
		index: number;
		type: "desktop" | "mobile";
	} | null>(null);
	const [statusMessage, setStatusMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);
	const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
	const [activeTab, setActiveTab] = useState<number>(0);

	// Ref for hidden file inputs
	const desktopFileRef = useRef<HTMLInputElement>(null);
	const mobileFileRef = useRef<HTMLInputElement>(null);
	const [targetBannerIndex, setTargetBannerIndex] = useState<number>(0);

	useEffect(() => {
		async function loadData() {
			try {
				setLoading(true);
				const res = await fetchHeroBanners();
				setBanners(res.data);
				setAutoShift(res.autoShift);
				setAutoShiftDelay(res.autoShiftDelay);
			} catch (err: any) {
				setStatusMessage({
					text: err.message || "Failed to load hero banners",
					type: "error",
				});
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	const handleSave = async () => {
		try {
			setSaving(true);
			setStatusMessage(null);
			const res = await updateHeroBanners({
				autoShift,
				autoShiftDelay: Number(autoShiftDelay) || 3500,
				banners,
			});
			setBanners(res.data);
			setAutoShift(res.autoShift);
			setAutoShiftDelay(res.autoShiftDelay);
			setStatusMessage({
				text: "Hero banners updated successfully! Changes are live on the storefront.",
				type: "success",
			});
		} catch (err: any) {
			setStatusMessage({
				text: err.message || "Failed to save hero banners",
				type: "error",
			});
		} finally {
			setSaving(false);
		}
	};

	const handleAddBanner = () => {
		const newBanner: HeroBannerItem = {
			btnText: "SHOP NOW",
			hasCurvedPortion: false,
			height: 908,
			id: String(Date.now()),
			imgSrc: "/assets/images/product-banner/product-banner-img-17.webp",
			link: "/shop",
			mobileImgSrc: "/assets/images/product-banner/product-banner-img-17.webp",
			oldPrice: 1999.0,
			order: banners.length + 1,
			price: 1499.0,
			savePercent: "25%",
			subtitle: "Exclusive New Arrival",
			title: "NEW HERO\nEDITION",
			width: 1296,
		};
		const updated = [...banners, newBanner];
		setBanners(updated);
		setActiveTab(updated.length - 1);
	};

	const handleDeleteBanner = (index: number) => {
		if (banners.length <= 1) {
			alert("You must keep at least one hero banner.");
			return;
		}
		if (confirm("Are you sure you want to delete this banner?")) {
			const updated = banners.filter((_, i) => i !== index);
			setBanners(updated);
			setActiveTab(Math.max(0, index - 1));
		}
	};

	const handleMoveBanner = (index: number, direction: "up" | "down") => {
		const targetIndex = direction === "up" ? index - 1 : index + 1;
		if (targetIndex < 0 || targetIndex >= banners.length) return;
		const updated = [...banners];
		const temp = updated[index];
		updated[index] = updated[targetIndex];
		updated[targetIndex] = temp;
		setBanners(updated);
		setActiveTab(targetIndex);
	};

	const updateBannerField = (
		index: number,
		field: keyof HeroBannerItem,
		value: any,
	) => {
		const updated = [...banners];
		updated[index] = { ...updated[index], [field]: value };
		setBanners(updated);
	};

	const triggerUpload = (index: number, type: "desktop" | "mobile") => {
		setTargetBannerIndex(index);
		if (type === "desktop" && desktopFileRef.current) {
			desktopFileRef.current.value = "";
			desktopFileRef.current.click();
		} else if (type === "mobile" && mobileFileRef.current) {
			mobileFileRef.current.value = "";
			mobileFileRef.current.click();
		}
	};

	const handleFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		type: "desktop" | "mobile",
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploadingIndex({ index: targetBannerIndex, type });
		try {
			const url = await uploadImageFile(file);
			if (type === "desktop") {
				updateBannerField(targetBannerIndex, "imgSrc", url);
			} else {
				updateBannerField(targetBannerIndex, "mobileImgSrc", url);
			}
			setStatusMessage({
				text: `${type === "desktop" ? "Desktop" : "Mobile"} image uploaded successfully. Don't forget to click 'Save Changes'.`,
				type: "success",
			});
		} catch (err: any) {
			setStatusMessage({
				text: err.message || "Failed to upload image",
				type: "error",
			});
		} finally {
			setUploadingIndex(null);
		}
	};

	const currentBanner = banners[activeTab];

	return (
		<>
			{/* Hidden file inputs for image uploads */}
			<input
				accept="image/*"
				className="hidden"
				onChange={(e) => handleFileUpload(e, "desktop")}
				ref={desktopFileRef}
				type="file"
			/>
			<input
				accept="image/*"
				className="hidden"
				onChange={(e) => handleFileUpload(e, "mobile")}
				ref={mobileFileRef}
				type="file"
			/>

			<PageHeader
				actions={
					<div className="flex items-center gap-3">
						<button
							className="inline-flex h-10 items-center gap-2 rounded-base border border-surface-line bg-surface-card px-4 text-[14px] font-semibold text-ink-700 hover:bg-surface-muted"
							onClick={handleAddBanner}
							type="button"
						>
							<Icon className="h-4 w-4" name="plus" />
							Add New Banner
						</button>
						<button
							className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
							disabled={saving || loading}
							onClick={handleSave}
							type="button"
						>
							<Icon className="h-4 w-4" name="save" />
							{saving ? "Saving..." : "Save Changes"}
						</button>
					</div>
				}
				description="Manage hero carousel banners, configure separate desktop & mobile images for responsive scaling, and control auto-shift transitions."
				eyebrow="Home Banners"
				title="Hero Banners"
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

			{/* Section 1: Auto-Shifting Carousel Settings */}
			<div className="mb-6 rounded-base border border-surface-line bg-surface-card p-5 shadow-xs">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h3 className="text-[16px] font-bold text-ink-900">
							Carousel Auto-Shifting Function
						</h3>
						<p className="text-[13px] text-ink-500">
							Automatically cycles through hero banners on storefront home page with smooth slide transitions.
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-6">
						<label className="flex cursor-pointer items-center gap-3">
							<input
								checked={autoShift}
								className="h-5 w-5 rounded border-surface-line text-brand-600 focus:ring-brand-500"
								onChange={(e) => setAutoShift(e.target.checked)}
								type="checkbox"
							/>
							<span className="text-[14px] font-medium text-ink-800">
								Enable Auto-Shifting
							</span>
						</label>
						<div className="flex items-center gap-2">
							<span className="text-[13px] text-ink-600">Cycle Delay:</span>
							<input
								className="h-9 w-24 rounded-base border border-surface-line px-2 text-center text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
								disabled={!autoShift}
								min={1000}
								onChange={(e) => setAutoShiftDelay(Number(e.target.value))}
								step={500}
								type="number"
								value={autoShiftDelay}
							/>
							<span className="text-[13px] text-ink-400">ms</span>
						</div>
					</div>
				</div>
			</div>

			{loading ? (
				<div className="flex h-64 items-center justify-center rounded-base border border-surface-line bg-surface-card">
					<div className="flex items-center gap-3 text-ink-500">
						<Icon className="h-5 w-5 animate-spin" name="refresh-ccw" />
						<span>Loading hero banners...</span>
					</div>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
					{/* Banner Tabs & List */}
					<div className="lg:col-span-4">
						<div className="rounded-base border border-surface-line bg-surface-card p-4 shadow-xs">
							<div className="mb-3 flex items-center justify-between">
								<span className="text-[13px] font-bold uppercase tracking-wider text-ink-500">
									Active Banners ({banners.length})
								</span>
								<button
									className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-600 hover:text-brand-700"
									onClick={handleAddBanner}
									type="button"
								>
									<Icon className="h-3.5 w-3.5" name="plus" />
									Add Banner
								</button>
							</div>

							<div className="space-y-2">
								{banners.map((banner, idx) => (
									<div
										className={`group relative flex items-center justify-between rounded-base border p-3 transition-all cursor-pointer ${
											activeTab === idx
												? "border-brand-600 bg-brand-50/40 text-brand-900 shadow-xs"
												: "border-surface-line bg-surface-card hover:border-brand-300"
										}`}
										key={banner.id || idx}
										onClick={() => setActiveTab(idx)}
									>
										<div className="flex items-center gap-3 overflow-hidden">
											<div className="relative h-12 w-16 shrink-0 overflow-hidden rounded bg-surface-muted border border-surface-line">
												<Image
													alt="Banner Preview"
													className="object-cover"
													fill
													sizes="64px"
													src={resolveImageUrl(banner.imgSrc)}
												/>
											</div>
											<div className="min-w-0">
												<div className="truncate text-[14px] font-semibold">
													{banner.title.replace("\n", " ") || `Banner ${idx + 1}`}
												</div>
												<div className="truncate text-[12px] text-ink-500">
													{banner.subtitle || "No subtitle"} • LKR {banner.price}
												</div>
											</div>
										</div>

										<div
											className="flex items-center gap-1 opacity-80 group-hover:opacity-100"
											onClick={(e) => e.stopPropagation()}
										>
											<button
												className="rounded p-1 text-ink-400 hover:bg-surface-muted hover:text-ink-700 disabled:opacity-30"
												disabled={idx === 0}
												onClick={() => handleMoveBanner(idx, "up")}
												title="Move up"
												type="button"
											>
												<Icon className="h-4 w-4" name="chevron-up" />
											</button>
											<button
												className="rounded p-1 text-ink-400 hover:bg-surface-muted hover:text-ink-700 disabled:opacity-30"
												disabled={idx === banners.length - 1}
												onClick={() => handleMoveBanner(idx, "down")}
												title="Move down"
												type="button"
											>
												<Icon className="h-4 w-4" name="chevron-down" />
											</button>
											<button
												className="rounded p-1 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
												onClick={() => handleDeleteBanner(idx)}
												title="Delete"
												type="button"
											>
												<Icon className="h-4 w-4" name="trash-2" />
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Banner Editor & Live Preview */}
					<div className="space-y-6 lg:col-span-8">
						{currentBanner && (
							<div className="rounded-base border border-surface-line bg-surface-card p-6 shadow-xs">
								<div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-surface-line pb-4">
									<div>
										<h2 className="text-[18px] font-bold text-ink-900">
											Editing Banner #{activeTab + 1}:{" "}
											<span className="text-brand-600">
												{currentBanner.title.replace("\n", " ")}
											</span>
										</h2>
										<p className="text-[13px] text-ink-500">
											Configure responsive images for mobile vs desktop screen dimensions.
										</p>
									</div>

									{/* Responsive Preview Switcher */}
									<div className="flex items-center rounded-base border border-surface-line bg-surface-muted p-1">
										<button
											className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[12px] font-semibold transition-all ${
												previewMode === "desktop"
													? "bg-surface-card text-brand-600 shadow-xs"
													: "text-ink-600 hover:text-ink-900"
											}`}
											onClick={() => setPreviewMode("desktop")}
											type="button"
										>
											<Icon className="h-3.5 w-3.5" name="store" />
											Desktop View
										</button>
										<button
											className={`flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-[12px] font-semibold transition-all ${
												previewMode === "mobile"
													? "bg-surface-card text-brand-600 shadow-xs"
													: "text-ink-600 hover:text-ink-900"
											}`}
											onClick={() => setPreviewMode("mobile")}
											type="button"
										>
											<Icon className="h-3.5 w-3.5" name="phone" />
											Mobile View
										</button>
									</div>
								</div>

								{/* Live Preview Simulator */}
								<div className="mb-6 rounded-base border border-surface-line bg-slate-900 p-4 text-white">
									<div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
										<span>
											{previewMode === "desktop"
												? "Desktop Ratio Preview (Aspect 16:9 - 1296x908)"
												: "Mobile Responsive Preview (Aspect 4:3 / 1:1 - Adaptable)"}
										</span>
										<span>Live Visual Feedback</span>
									</div>

									<div
										className={`relative mx-auto overflow-hidden rounded-base bg-slate-800 transition-all ${
											previewMode === "desktop"
												? "h-[220px] w-full"
												: "h-[220px] w-[320px] border-4 border-slate-700 shadow-lg"
										}`}
									>
										<Image
											alt="Responsive Preview"
											className="object-cover"
											fill
											src={resolveImageUrl(
												previewMode === "mobile" && currentBanner.mobileImgSrc
													? currentBanner.mobileImgSrc
													: currentBanner.imgSrc,
											)}
										/>
										<div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent p-5 flex flex-col justify-center">
											<span className="text-[12px] font-medium text-brand-300">
												{currentBanner.subtitle}
											</span>
											<h3 className="text-[18px] font-extrabold text-white leading-tight mt-1 whitespace-pre-line">
												{currentBanner.title}
											</h3>
											<div className="mt-2 flex items-center gap-2">
												{currentBanner.oldPrice && (
													<span className="text-[12px] line-through text-slate-400">
														LKR {currentBanner.oldPrice}
													</span>
												)}
												<span className="text-[15px] font-bold text-amber-400">
													LKR {currentBanner.price}
												</span>
												{currentBanner.savePercent && (
													<span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
														{currentBanner.savePercent}
													</span>
												)}
											</div>
											<div className="mt-3">
												<span className="inline-block rounded-full bg-brand-600 px-3 py-1 text-[11px] font-bold text-white">
													{currentBanner.btnText || "SHOP NOW"}
												</span>
											</div>
										</div>
									</div>
								</div>

								{/* Responsive Image Inputs Section */}
								<div className="mb-6 rounded-base border border-brand-100 bg-brand-50/30 p-4">
									<h4 className="mb-2 text-[14px] font-bold text-brand-900 flex items-center gap-2">
										<Icon className="h-4 w-4 text-brand-600" name="image" />
										Responsive Banner Images
									</h4>
									<p className="mb-4 text-[12px] text-ink-600">
										Upload distinct images tailored to desktop and mobile screen viewports. This prevents distortion, cuts down mobile bandwidth, and fits screen dimensions perfectly.
									</p>

									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										{/* Desktop Image */}
										<div className="rounded-base border border-surface-line bg-surface-card p-4">
											<div className="mb-2 flex items-center justify-between">
												<span className="text-[13px] font-bold text-ink-800">
													1. Desktop Image
												</span>
												<span className="text-[11px] text-ink-400">
													1296 × 908 px recommended
												</span>
											</div>
											<div className="mb-3 flex items-center gap-3">
												<div className="relative h-16 w-24 shrink-0 overflow-hidden rounded border border-surface-line bg-surface-muted">
													<Image
														alt="Desktop"
														className="object-cover"
														fill
														src={resolveImageUrl(currentBanner.imgSrc)}
													/>
												</div>
												<div className="flex-1">
													<button
														className="inline-flex h-8 items-center gap-1.5 rounded-base border border-surface-line bg-surface-muted px-3 text-[12px] font-semibold text-ink-700 hover:bg-surface-line"
														disabled={uploadingIndex !== null}
														onClick={() => triggerUpload(activeTab, "desktop")}
														type="button"
													>
														<Icon className="h-3.5 w-3.5" name="upload" />
														{uploadingIndex?.index === activeTab &&
														uploadingIndex?.type === "desktop"
															? "Uploading..."
															: "Upload Desktop Image"}
													</button>
												</div>
											</div>
											<div>
												<label className="mb-1 block text-[11px] font-medium text-ink-500">
													Or Image Path / URL:
												</label>
												<input
													className="h-9 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
													onChange={(e) =>
														updateBannerField(activeTab, "imgSrc", e.target.value)
													}
													placeholder="/assets/images/product-banner/..."
													value={currentBanner.imgSrc}
												/>
											</div>
										</div>

										{/* Mobile Image */}
										<div className="rounded-base border border-surface-line bg-surface-card p-4">
											<div className="mb-2 flex items-center justify-between">
												<span className="text-[13px] font-bold text-ink-800">
													2. Mobile Device Image
												</span>
												<span className="text-[11px] text-ink-400">
													640 × 640 px or 768 × 500 px
												</span>
											</div>
											<div className="mb-3 flex items-center gap-3">
												<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border border-surface-line bg-surface-muted">
													<Image
														alt="Mobile"
														className="object-cover"
														fill
														src={resolveImageUrl(
															currentBanner.mobileImgSrc || currentBanner.imgSrc,
														)}
													/>
												</div>
												<div className="flex-1">
													<button
														className="inline-flex h-8 items-center gap-1.5 rounded-base border border-surface-line bg-surface-muted px-3 text-[12px] font-semibold text-ink-700 hover:bg-surface-line"
														disabled={uploadingIndex !== null}
														onClick={() => triggerUpload(activeTab, "mobile")}
														type="button"
													>
														<Icon className="h-3.5 w-3.5" name="upload" />
														{uploadingIndex?.index === activeTab &&
														uploadingIndex?.type === "mobile"
															? "Uploading..."
															: "Upload Mobile Image"}
													</button>
												</div>
											</div>
											<div>
												<label className="mb-1 block text-[11px] font-medium text-ink-500">
													Or Mobile Image Path / URL:
												</label>
												<input
													className="h-9 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
													onChange={(e) =>
														updateBannerField(
															activeTab,
															"mobileImgSrc",
															e.target.value,
														)
													}
													placeholder="Defaults to desktop image if empty"
													value={currentBanner.mobileImgSrc || ""}
												/>
											</div>
										</div>
									</div>
								</div>

								{/* Text & Content Inputs */}
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="md:col-span-2">
										<label className="mb-1 block text-[13px] font-semibold text-ink-800">
											Banner Title (Line 1 bold, Line 2 regular — separate by line break)
										</label>
										<textarea
											className="w-full rounded-base border border-surface-line p-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden font-mono"
											onChange={(e) =>
												updateBannerField(activeTab, "title", e.target.value)
											}
											rows={2}
											value={currentBanner.title}
										/>
									</div>

									<div>
										<label className="mb-1 block text-[13px] font-semibold text-ink-800">
											Subtitle (Badge text)
										</label>
										<input
											className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
											onChange={(e) =>
												updateBannerField(activeTab, "subtitle", e.target.value)
											}
											placeholder="Exclusive Offer Going"
											value={currentBanner.subtitle || ""}
										/>
									</div>

									<div>
										<label className="mb-1 block text-[13px] font-semibold text-ink-800">
											Discount Percentage / Offer Tag
										</label>
										<input
											className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
											onChange={(e) =>
												updateBannerField(
													activeTab,
													"savePercent",
													e.target.value,
												)
											}
											placeholder="30%"
											value={currentBanner.savePercent || ""}
										/>
									</div>

									<div>
										<label className="mb-1 block text-[13px] font-semibold text-ink-800">
											Offer Price (LKR)
										</label>
										<input
											className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
											onChange={(e) =>
												updateBannerField(activeTab, "price", e.target.value)
											}
											placeholder="243.55"
											type="number"
											value={currentBanner.price ?? ""}
										/>
									</div>

									<div>
										<label className="mb-1 block text-[13px] font-semibold text-ink-800">
											Original Price (LKR)
										</label>
										<input
											className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
											onChange={(e) =>
												updateBannerField(activeTab, "oldPrice", e.target.value)
											}
											placeholder="2364.56"
											type="number"
											value={currentBanner.oldPrice ?? ""}
										/>
									</div>

									<div>
										<label className="mb-1 block text-[13px] font-semibold text-ink-800">
											Button Text
										</label>
										<input
											className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
											onChange={(e) =>
												updateBannerField(activeTab, "btnText", e.target.value)
											}
											placeholder="SHOP NOW"
											value={currentBanner.btnText || ""}
										/>
									</div>

									<div>
										<label className="mb-1 block text-[13px] font-semibold text-ink-800">
											Button Target Link
										</label>
										<input
											className="h-10 w-full rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-hidden"
											onChange={(e) =>
												updateBannerField(activeTab, "link", e.target.value)
											}
											placeholder="/shop"
											value={currentBanner.link || ""}
										/>
									</div>

									<div className="flex items-center gap-3 pt-2 md:col-span-2">
										<label className="flex cursor-pointer items-center gap-2">
											<input
												checked={Boolean(currentBanner.hasCurvedPortion)}
												className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-500"
												onChange={(e) =>
													updateBannerField(
														activeTab,
														"hasCurvedPortion",
														e.target.checked,
													)
												}
												type="checkbox"
											/>
											<span className="text-[13px] text-ink-700">
												Apply curved corner styling box decoration (Unimart Curved Style)
											</span>
										</label>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</>
	);
}
