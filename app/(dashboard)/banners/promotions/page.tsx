"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import {
	fetchPromotionsSettings,
	updatePromotionsSettings,
	uploadImageFile,
	resolveImageUrl,
	type PromotionalBannerItem,
	type PromotionsSettings,
} from "@/lib/api";

const initialBannerState: PromotionalBannerItem = {
	subtitle: "Power Up Deals",
	titleBold: "NEW DEVICE",
	titleRegular: "COMING SOON",
	secondarySubtitle: "Land major deals",
	imgSrc: "/assets/images/product-banner/product-banner-img-08.webp",
	mobileImgSrc: "/assets/images/product-banner/product-banner-img-08.webp",
	btnText: "SHOP NOW",
	link: "/shop",
};

export default function PromotionalBannersPage() {
	const [powerUpBanner, setPowerUpBanner] = useState<PromotionalBannerItem>(initialBannerState);
	const [highlightsBanner, setHighlightsBanner] = useState<PromotionalBannerItem>({
		...initialBannerState,
		sectionTitle: "This Week’s Highlights",
		subtitle: "Power Up Deals",
		titleBold: "THE NEXT GEN",
		titleRegular: "OF SMARTPHONE",
		secondarySubtitle: "Grab huge savings",
		imgSrc: "/assets/images/product-banner/product-banner-img-09.webp",
		mobileImgSrc: "/assets/images/product-banner/product-banner-img-09.webp",
	});
	const [showTodaysBestDeals, setShowTodaysBestDeals] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [saving, setSaving] = useState<boolean>(false);
	const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);

	// Hidden file input refs
	const powerUpDesktopRef = useRef<HTMLInputElement>(null);
	const powerUpMobileRef = useRef<HTMLInputElement>(null);
	const highlightsDesktopRef = useRef<HTMLInputElement>(null);
	const highlightsMobileRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);
				const res = await fetchPromotionsSettings();
				if (res.powerUpBanner) setPowerUpBanner(res.powerUpBanner);
				if (res.highlightsBanner) setHighlightsBanner(res.highlightsBanner);
				setShowTodaysBestDeals(Boolean(res.showTodaysBestDeals));
			} catch (err: any) {
				setStatusMessage({
					text: err.message || "Failed to load promotional banners",
					type: "error",
				});
			} finally {
				setLoading(false);
			}
		}
		load();
	}, []);

	const handleSave = async () => {
		try {
			setSaving(true);
			setStatusMessage(null);
			const payload: PromotionsSettings = {
				powerUpBanner,
				highlightsBanner,
				showTodaysBestDeals,
			};
			const res = await updatePromotionsSettings(payload);
			if (res.powerUpBanner) setPowerUpBanner(res.powerUpBanner);
			if (res.highlightsBanner) setHighlightsBanner(res.highlightsBanner);
			setShowTodaysBestDeals(Boolean(res.showTodaysBestDeals));
			setStatusMessage({
				text: "Promotional banners and settings updated successfully! Live on storefront.",
				type: "success",
			});
		} catch (err: any) {
			setStatusMessage({
				text: err.message || "Failed to save promotional banners",
				type: "error",
			});
		} finally {
			setSaving(false);
		}
	};

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		banner: "powerUp" | "highlights",
		imageType: "desktop" | "mobile"
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const targetKey = `${banner}-${imageType}`;
		setUploadingTarget(targetKey);
		try {
			const res = await uploadImageFile(file);
			if (banner === "powerUp") {
				setPowerUpBanner((prev) => ({
					...prev,
					[imageType === "desktop" ? "imgSrc" : "mobileImgSrc"]: res.url,
				}));
			} else {
				setHighlightsBanner((prev) => ({
					...prev,
					[imageType === "desktop" ? "imgSrc" : "mobileImgSrc"]: res.url,
				}));
			}
			setStatusMessage({
				text: `${imageType === "desktop" ? "Desktop" : "Mobile"} image uploaded successfully!`,
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

	return (
		<div className="space-y-8 pb-16">
			<PageHeader
				title="Promotional Banners & Deals"
				description="Manage Start Product Banner Area (Figger 01), This Week’s Highlights Banner, and toggle visibility for Today's Best Deals."
				actions={
					<button
						onClick={handleSave}
						disabled={saving}
						className="inline-flex items-center gap-2 rounded-base bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-brand-700 disabled:opacity-50 transition"
					>
						<Icon name="check" className="h-4 w-4" />
						{saving ? "Saving..." : "Save All Changes"}
					</button>
				}
			/>

			{statusMessage && (
				<div
					className={`rounded-lg p-4 text-sm font-medium ${statusMessage.type === "success"
						? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
						: "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
						}`}
				>
					{statusMessage.text}
				</div>
			)}

			{/* ============================================================== */}
			{/* SECTION 1: Start Product Banner Area (Figger 01: Power Up Deals) */}
			{/* ============================================================== */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
				<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
							Figger 01
						</span>
						<h2 className="text-lg font-bold text-slate-900 dark:text-white">
							Start Product Banner Area (Power Up Deals)
						</h2>
						<p className="text-xs text-slate-500">
							Appears at the start of the electronics product section on the home page.
						</p>
					</div>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
						<Icon name="layout-template" className="h-3.5 w-3.5" />
						Full Width Banner
					</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Text configuration */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
							Banner Text & Content
						</h3>

						<div>
							<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
								Top Subtitle
							</label>
							<input
								type="text"
								value={powerUpBanner.subtitle}
								onChange={(e) =>
									setPowerUpBanner({ ...powerUpBanner, subtitle: e.target.value })
								}
								placeholder="Power Up Deals"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Title (Bold Prefix)
								</label>
								<input
									type="text"
									value={powerUpBanner.titleBold}
									onChange={(e) =>
										setPowerUpBanner({
											...powerUpBanner,
											titleBold: e.target.value,
										})
									}
									placeholder="NEW DEVICE"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Title (Regular Suffix)
								</label>
								<input
									type="text"
									value={powerUpBanner.titleRegular}
									onChange={(e) =>
										setPowerUpBanner({
											...powerUpBanner,
											titleRegular: e.target.value,
										})
									}
									placeholder="COMING SOON"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
								Secondary Subtitle (Handwriting / Blue style)
							</label>
							<input
								type="text"
								value={powerUpBanner.secondarySubtitle}
								onChange={(e) =>
									setPowerUpBanner({
										...powerUpBanner,
										secondarySubtitle: e.target.value,
									})
								}
								placeholder="Land major deals"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Button Label
								</label>
								<input
									type="text"
									value={powerUpBanner.btnText}
									onChange={(e) =>
										setPowerUpBanner({
											...powerUpBanner,
											btnText: e.target.value,
										})
									}
									placeholder="SHOP NOW"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Button Link
								</label>
								<input
									type="text"
									value={powerUpBanner.link}
									onChange={(e) =>
										setPowerUpBanner({
											...powerUpBanner,
											link: e.target.value,
										})
									}
									placeholder="/shop"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>
					</div>

					{/* Responsive Images */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
							Responsive Images (Desktop & Mobile)
						</h3>

						{/* Desktop Image */}
						<div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/50 space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-xs font-medium text-slate-700 dark:text-slate-300">
									🖥️ Desktop Image
								</span>
								<button
									type="button"
									onClick={() => powerUpDesktopRef.current?.click()}
									disabled={uploadingTarget === "powerUp-desktop"}
									className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
								>
									<Icon name="upload" className="h-3.5 w-3.5" />
									{uploadingTarget === "powerUp-desktop"
										? "Uploading..."
										: "Upload Image"}
								</button>
								<input
									ref={powerUpDesktopRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => handleImageUpload(e, "powerUp", "desktop")}
								/>
							</div>
							<input
								type="text"
								value={powerUpBanner.imgSrc}
								onChange={(e) =>
									setPowerUpBanner({ ...powerUpBanner, imgSrc: e.target.value })
								}
								placeholder="/assets/images/product-banner/product-banner-img-08.webp"
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
							/>
							<div className="relative h-24 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={resolveImageUrl(powerUpBanner.imgSrc)}
									alt="Power Up Desktop Preview"
									className="max-h-full max-w-full object-contain"
								/>
							</div>
						</div>

						{/* Mobile Image */}
						<div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/50 space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-xs font-medium text-slate-700 dark:text-slate-300">
									📱 Mobile Image
								</span>
								<button
									type="button"
									onClick={() => powerUpMobileRef.current?.click()}
									disabled={uploadingTarget === "powerUp-mobile"}
									className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
								>
									<Icon name="upload" className="h-3.5 w-3.5" />
									{uploadingTarget === "powerUp-mobile"
										? "Uploading..."
										: "Upload Image"}
								</button>
								<input
									ref={powerUpMobileRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => handleImageUpload(e, "powerUp", "mobile")}
								/>
							</div>
							<input
								type="text"
								value={powerUpBanner.mobileImgSrc || ""}
								onChange={(e) =>
									setPowerUpBanner({
										...powerUpBanner,
										mobileImgSrc: e.target.value,
									})
								}
								placeholder="Optional mobile image path or URL"
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
							/>
							<div className="relative h-24 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={resolveImageUrl(
										powerUpBanner.mobileImgSrc || powerUpBanner.imgSrc
									)}
									alt="Power Up Mobile Preview"
									className="max-h-full max-w-full object-contain"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* ============================================================== */}
			{/* SECTION 2: Today's Best Deals Visibility (Figger 02) */}
			{/* ============================================================== */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
							Figger 02
						</span>
						<h2 className="text-lg font-bold text-slate-900 dark:text-white">
							Today&apos;s Best Deals Section (Countdown & Deals)
						</h2>
						<p className="text-xs text-slate-500 max-w-xl mt-1">
							The countdown timer and deals slider (`.rbt-product-fshape-box-outline-style`).
							Requested status: <span className="font-semibold text-rose-600 dark:text-rose-400">Temporarily hidden</span> on the storefront.
						</p>
					</div>

					<div className="flex items-center gap-3">
						<span className="text-sm font-medium text-slate-700 dark:text-slate-300">
							{showTodaysBestDeals ? "Visible" : "Hidden"}
						</span>
						<button
							type="button"
							onClick={() => setShowTodaysBestDeals(!showTodaysBestDeals)}
							className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 ${showTodaysBestDeals ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-700"
								}`}
						>
							<span
								className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showTodaysBestDeals ? "translate-x-5" : "translate-x-0"
									}`}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* ============================================================== */}
			{/* SECTION 3: This Week’s Highlights Banner */}
			{/* ============================================================== */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
				<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
							Banner Two
						</span>
						<h2 className="text-lg font-bold text-slate-900 dark:text-white">
							This Week&apos;s Highlights Banner
						</h2>
						<p className="text-xs text-slate-500">
							Appears above the second electronics product grid on the home page.
						</p>
					</div>
					<span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
						<Icon name="layout-template" className="h-3.5 w-3.5" />
						Full Width Banner
					</span>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Text configuration */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
							Banner Text & Content
						</h3>

						<div>
							<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
								Section Title (Heading above banner)
							</label>
							<input
								type="text"
								value={highlightsBanner.sectionTitle || ""}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										sectionTitle: e.target.value,
									})
								}
								placeholder="This Week’s Highlights"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
							/>
						</div>

						<div>
							<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
								Top Subtitle
							</label>
							<input
								type="text"
								value={highlightsBanner.subtitle}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										subtitle: e.target.value,
									})
								}
								placeholder="Power Up Deals"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Title (Bold Prefix)
								</label>
								<input
									type="text"
									value={highlightsBanner.titleBold}
									onChange={(e) =>
										setHighlightsBanner({
											...highlightsBanner,
											titleBold: e.target.value,
										})
									}
									placeholder="THE NEXT GEN"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Title (Regular Suffix)
								</label>
								<input
									type="text"
									value={highlightsBanner.titleRegular}
									onChange={(e) =>
										setHighlightsBanner({
											...highlightsBanner,
											titleRegular: e.target.value,
										})
									}
									placeholder="OF SMARTPHONE"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
								Secondary Subtitle (Handwriting / Blue style)
							</label>
							<input
								type="text"
								value={highlightsBanner.secondarySubtitle}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										secondarySubtitle: e.target.value,
									})
								}
								placeholder="Grab huge savings"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Button Label
								</label>
								<input
									type="text"
									value={highlightsBanner.btnText}
									onChange={(e) =>
										setHighlightsBanner({
											...highlightsBanner,
											btnText: e.target.value,
										})
									}
									placeholder="SHOP NOW"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Button Link
								</label>
								<input
									type="text"
									value={highlightsBanner.link}
									onChange={(e) =>
										setHighlightsBanner({
											...highlightsBanner,
											link: e.target.value,
										})
									}
									placeholder="/shop"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500"
								/>
							</div>
						</div>
					</div>

					{/* Responsive Images */}
					<div className="space-y-4">
						<h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
							Responsive Images (Desktop & Mobile)
						</h3>

						{/* Desktop Image */}
						<div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/50 space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-xs font-medium text-slate-700 dark:text-slate-300">
									🖥️ Desktop Image
								</span>
								<button
									type="button"
									onClick={() => highlightsDesktopRef.current?.click()}
									disabled={uploadingTarget === "highlights-desktop"}
									className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
								>
									<Icon name="upload" className="h-3.5 w-3.5" />
									{uploadingTarget === "highlights-desktop"
										? "Uploading..."
										: "Upload Image"}
								</button>
								<input
									ref={highlightsDesktopRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => handleImageUpload(e, "highlights", "desktop")}
								/>
							</div>
							<input
								type="text"
								value={highlightsBanner.imgSrc}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										imgSrc: e.target.value,
									})
								}
								placeholder="/assets/images/product-banner/product-banner-img-09.webp"
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
							/>
							<div className="relative h-24 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={resolveImageUrl(highlightsBanner.imgSrc)}
									alt="Highlights Desktop Preview"
									className="max-h-full max-w-full object-contain"
								/>
							</div>
						</div>

						{/* Mobile Image */}
						<div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/50 space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-xs font-medium text-slate-700 dark:text-slate-300">
									📱 Mobile Image
								</span>
								<button
									type="button"
									onClick={() => highlightsMobileRef.current?.click()}
									disabled={uploadingTarget === "highlights-mobile"}
									className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
								>
									<Icon name="upload" className="h-3.5 w-3.5" />
									{uploadingTarget === "highlights-mobile"
										? "Uploading..."
										: "Upload Image"}
								</button>
								<input
									ref={highlightsMobileRef}
									type="file"
									accept="image/*"
									className="hidden"
									onChange={(e) => handleImageUpload(e, "highlights", "mobile")}
								/>
							</div>
							<input
								type="text"
								value={highlightsBanner.mobileImgSrc || ""}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										mobileImgSrc: e.target.value,
									})
								}
								placeholder="Optional mobile image path or URL"
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
							/>
							<div className="relative h-24 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={resolveImageUrl(
										highlightsBanner.mobileImgSrc || highlightsBanner.imgSrc
									)}
									alt="Highlights Mobile Preview"
									className="max-h-full max-w-full object-contain"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
