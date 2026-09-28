"use client";

import { useEffect, useState, useRef } from "react";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import {
	fetchPromotionsSettings,
	updatePromotionsSettings,
	uploadImageFile,
	resolveImageUrl,
	type PromotionalBannerItem,
	type HighlightProductItem,
	type PromotionsSettings,
} from "@/lib/api";

const initialBannerState: PromotionalBannerItem = {
	subtitle: "Power Up Deals",
	titleBold: "NEW DEVICE",
	titleRegular: "COMING SOON",
	secondarySubtitle: "Land major deals",
	imgSrc: "/assets/images/product-banner/product-banner-img-01.webp",
	mobileImgSrc: "/assets/images/product-banner/product-banner-img-01.webp",
	btnText: "SHOP NOW",
	link: "/shop",
};

const defaultHighlightsList: HighlightProductItem[] = [
	{
		id: "153",
		title: "Beats Studio Pro Wireless Earbuds – Black",
		oldPrice: 83.41,
		price: 66.98,
		imgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-01.webp",
		mobileImgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-01.webp",
		rating: 5,
		ratingCount: 39,
		link: "/product/153",
	},
	{
		id: "154",
		title: "Apple 12.9-inch iPad Pro Wi-Fi 512GB Gray Space",
		oldPrice: 54.66,
		price: 43.84,
		imgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-02.webp",
		mobileImgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-02.webp",
		rating: 3,
		ratingCount: 76,
		link: "/product/154",
	},
	{
		id: "155",
		title: "DJI OM 5 Handheld Smartphone Gimbal",
		oldPrice: 90.07,
		price: 72.15,
		imgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-03.webp",
		mobileImgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-03.webp",
		rating: 4,
		ratingCount: 113,
		link: "/product/155",
	},
	{
		id: "156",
		title: "Apple Watch Ultra 2 – Titanium Case",
		oldPrice: 72.47,
		price: 57.98,
		imgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-04.webp",
		mobileImgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-04.webp",
		rating: 3,
		ratingCount: 150,
		link: "/product/156",
	},
	{
		id: "157",
		title: "Apple MacBook Pro 16-inch – M2 Chip",
		oldPrice: 95.09,
		price: 75.98,
		imgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-05.webp",
		mobileImgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-05.webp",
		rating: 5,
		ratingCount: 187,
		link: "/product/157",
	},
	{
		id: "158",
		title: "Apple iPad Air 10.9-inch – Wi-Fi 256GB",
		oldPrice: 99.09,
		price: 79.07,
		imgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-06.webp",
		mobileImgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-06.webp",
		rating: 5,
		ratingCount: 224,
		link: "/product/158",
	},
];

const fallbackSvg =
	"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%23f1f5f9'><rect width='100' height='100' fill='%23f8fafc'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' fill='%2394a3b8'>No Image</text></svg>";

export default function PromotionalBannersPage() {
	const [powerUpBanner, setPowerUpBanner] = useState<PromotionalBannerItem>(initialBannerState);
	const [highlightsBanner, setHighlightsBanner] = useState<PromotionalBannerItem>({
		...initialBannerState,
		sectionTitle: "This Week’s Highlights",
		subtitle: "Power Up Deals",
		titleBold: "THE NEXT GEN",
		titleRegular: "OF SMARTPHONE",
		secondarySubtitle: "Grab huge savings",
		imgSrc: "/assets/images/product-banner/product-banner-img-02.webp",
		mobileImgSrc: "/assets/images/product-banner/product-banner-img-02.webp",
	});
	const [highlightsProducts, setHighlightsProducts] = useState<HighlightProductItem[]>(defaultHighlightsList);
	const [showTodaysBestDeals, setShowTodaysBestDeals] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const [saving, setSaving] = useState<boolean>(false);
	const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
	const [statusMessage, setStatusMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);

	// Hidden file input refs for banners
	const powerUpDesktopRef = useRef<HTMLInputElement>(null);
	const powerUpMobileRef = useRef<HTMLInputElement>(null);
	const highlightsDesktopRef = useRef<HTMLInputElement>(null);
	const highlightsMobileRef = useRef<HTMLInputElement>(null);

	// Hidden file input refs for highlight products
	const highlightDesktopRefs = useRef<Array<HTMLInputElement | null>>([]);
	const highlightMobileRefs = useRef<Array<HTMLInputElement | null>>([]);

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);
				const res = await fetchPromotionsSettings();
				if (res.powerUpBanner) {
					setPowerUpBanner({
						subtitle: res.powerUpBanner.subtitle ?? "",
						titleBold: res.powerUpBanner.titleBold ?? "",
						titleRegular: res.powerUpBanner.titleRegular ?? "",
						secondarySubtitle: res.powerUpBanner.secondarySubtitle ?? "",
						imgSrc: res.powerUpBanner.imgSrc ?? "",
						mobileImgSrc: res.powerUpBanner.mobileImgSrc ?? "",
						btnText: res.powerUpBanner.btnText ?? "",
						link: res.powerUpBanner.link ?? "",
					});
				}
				if (res.highlightsBanner) {
					setHighlightsBanner({
						sectionTitle: res.highlightsBanner.sectionTitle ?? "This Week’s Highlights",
						subtitle: res.highlightsBanner.subtitle ?? "",
						titleBold: res.highlightsBanner.titleBold ?? "",
						titleRegular: res.highlightsBanner.titleRegular ?? "",
						secondarySubtitle: res.highlightsBanner.secondarySubtitle ?? "",
						imgSrc: res.highlightsBanner.imgSrc ?? "",
						mobileImgSrc: res.highlightsBanner.mobileImgSrc ?? "",
						btnText: res.highlightsBanner.btnText ?? "",
						link: res.highlightsBanner.link ?? "",
					});
				}
				if (Array.isArray(res.highlightsProducts) && res.highlightsProducts.length > 0) {
					setHighlightsProducts(res.highlightsProducts.slice(0, 6));
				}
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
				highlightsProducts: highlightsProducts.slice(0, 6),
				showTodaysBestDeals,
			};
			const res = await updatePromotionsSettings(payload);
			if (res.powerUpBanner) setPowerUpBanner(res.powerUpBanner);
			if (res.highlightsBanner) setHighlightsBanner(res.highlightsBanner);
			if (Array.isArray(res.highlightsProducts)) setHighlightsProducts(res.highlightsProducts);
			setShowTodaysBestDeals(Boolean(res.showTodaysBestDeals));
			setStatusMessage({
				text: "Promotional banners and highlights updated successfully! Live on storefront.",
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
			const uploadedUrl = await uploadImageFile(file);
			if (banner === "powerUp") {
				setPowerUpBanner((prev) => ({
					...prev,
					[imageType === "desktop" ? "imgSrc" : "mobileImgSrc"]: uploadedUrl,
				}));
			} else {
				setHighlightsBanner((prev) => ({
					...prev,
					[imageType === "desktop" ? "imgSrc" : "mobileImgSrc"]: uploadedUrl,
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

	const handleProductImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		idx: number,
		imageType: "desktop" | "mobile"
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const targetKey = `product-${idx}-${imageType}`;
		setUploadingTarget(targetKey);
		try {
			const uploadedUrl = await uploadImageFile(file);
			const updated = [...highlightsProducts];
			updated[idx] = {
				...updated[idx],
				[imageType === "desktop" ? "imgSrc" : "mobileImgSrc"]: uploadedUrl,
			};
			setHighlightsProducts(updated);
			setStatusMessage({
				text: `Product #${idx + 1} ${imageType} image uploaded successfully!`,
				type: "success",
			});
		} catch (err: any) {
			setStatusMessage({
				text: err.message || "Failed to upload product image",
				type: "error",
			});
		} finally {
			setUploadingTarget(null);
		}
	};

	const handleProductChange = (
		idx: number,
		field: keyof HighlightProductItem,
		val: any
	) => {
		const updated = [...highlightsProducts];
		updated[idx] = { ...updated[idx], [field]: val };
		setHighlightsProducts(updated);
	};

	const handleAddProduct = () => {
		if (highlightsProducts.length >= 6) {
			alert("Maximum 6 products allowed for This Week's Highlights.");
			return;
		}
		const newProd: HighlightProductItem = {
			id: String(Date.now()),
			title: "New Highlight Product",
			price: 49.99,
			oldPrice: 69.99,
			imgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-01.webp",
			mobileImgSrc: "/assets/images/product-img/electronics/electronics-bg-trans-list-01.webp",
			rating: 5,
			ratingCount: 10,
			link: "/shop",
		};
		setHighlightsProducts([...highlightsProducts, newProd]);
	};

	const handleRemoveProduct = (idx: number) => {
		if (highlightsProducts.length <= 1) {
			alert("At least 1 highlight product should be configured.");
			return;
		}
		setHighlightsProducts(highlightsProducts.filter((_, i) => i !== idx));
	};

	return (
		<div className="space-y-8 pb-16">
			<PageHeader
				title="Promotional Banners & Deals"
				description="Manage Start Product Banner Area (Figger 01), This Week’s Highlights (maximum 6 products + banner), and toggle Today's Best Deals."
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
					className={`rounded-lg p-4 text-sm font-medium ${
						statusMessage.type === "success"
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
						<span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
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
								value={powerUpBanner?.subtitle ?? ""}
								onChange={(e) =>
									setPowerUpBanner({ ...powerUpBanner, subtitle: e.target.value })
								}
								placeholder="Power Up Deals"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Title (Bold Prefix)
								</label>
								<input
									type="text"
									value={powerUpBanner?.titleBold ?? ""}
									onChange={(e) =>
										setPowerUpBanner({
											...powerUpBanner,
											titleBold: e.target.value,
										})
									}
									placeholder="NEW DEVICE"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Title (Regular Suffix)
								</label>
								<input
									type="text"
									value={powerUpBanner?.titleRegular ?? ""}
									onChange={(e) =>
										setPowerUpBanner({
											...powerUpBanner,
											titleRegular: e.target.value,
										})
									}
									placeholder="COMING SOON"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
								Secondary Subtitle (Handwriting / Blue style)
							</label>
							<input
								type="text"
								value={powerUpBanner?.secondarySubtitle ?? ""}
								onChange={(e) =>
									setPowerUpBanner({
										...powerUpBanner,
										secondarySubtitle: e.target.value,
									})
								}
								placeholder="Land major deals"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Button Label
								</label>
								<input
									type="text"
									value={powerUpBanner?.btnText ?? ""}
									onChange={(e) =>
										setPowerUpBanner({
											...powerUpBanner,
											btnText: e.target.value,
										})
									}
									placeholder="SHOP NOW"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Button Link
								</label>
								<input
									type="text"
									value={powerUpBanner?.link ?? ""}
									onChange={(e) =>
										setPowerUpBanner({
											...powerUpBanner,
											link: e.target.value,
										})
									}
									placeholder="/shop"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
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
									className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
								>
									<Icon name="upload" className="h-3.5 w-3.5" />
									{uploadingTarget === "powerUp-desktop" ? "Uploading..." : "Upload Image"}
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
								value={powerUpBanner?.imgSrc ?? ""}
								onChange={(e) =>
									setPowerUpBanner({ ...powerUpBanner, imgSrc: e.target.value })
								}
								placeholder="/assets/images/product-banner/product-banner-img-01.webp"
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
							/>
							<div className="relative h-24 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden p-2">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={resolveImageUrl(powerUpBanner?.imgSrc)}
									alt="Power Up Desktop Preview"
									className="max-h-full max-w-full object-contain"
									onError={(e) => {
										(e.target as HTMLImageElement).src = fallbackSvg;
									}}
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
									className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
								>
									<Icon name="upload" className="h-3.5 w-3.5" />
									{uploadingTarget === "powerUp-mobile" ? "Uploading..." : "Upload Image"}
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
								value={powerUpBanner?.mobileImgSrc ?? ""}
								onChange={(e) =>
									setPowerUpBanner({
										...powerUpBanner,
										mobileImgSrc: e.target.value,
									})
								}
								placeholder="Optional mobile image path or URL"
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
							/>
							<div className="relative h-24 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden p-2">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={resolveImageUrl(powerUpBanner?.mobileImgSrc || powerUpBanner?.imgSrc)}
									alt="Power Up Mobile Preview"
									className="max-h-full max-w-full object-contain"
									onError={(e) => {
										(e.target as HTMLImageElement).src = fallbackSvg;
									}}
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
							className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500 ${
								showTodaysBestDeals ? "bg-brand-600" : "bg-slate-300 dark:bg-slate-700"
							}`}
						>
							<span
								className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
									showTodaysBestDeals ? "translate-x-5" : "translate-x-0"
								}`}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* ============================================================== */}
			{/* SECTION 3: This Week’s Highlights (Maximum 6 Product Cards) */}
			{/* ============================================================== */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
							Highlights Products
						</span>
						<h2 className="text-lg font-bold text-slate-900 dark:text-white">
							This Week&apos;s Highlights — Product Cards (Max 6)
						</h2>
						<p className="text-xs text-slate-500">
							Manage the 6 showcase product items with images, ratings, sale prices, and links.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-xs font-semibold text-slate-500">
							{highlightsProducts.length}/6 Items
						</span>
						<button
							type="button"
							onClick={handleAddProduct}
							disabled={highlightsProducts.length >= 6}
							className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition"
						>
							<Icon name="plus" className="h-3.5 w-3.5" />
							Add Highlight Card
						</button>
					</div>
				</div>

				{/* 6 Cards Grid Editor */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{highlightsProducts.map((prod, idx) => (
						<div
							key={prod.id || idx}
							className="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50 dark:bg-slate-800/40 space-y-4 hover:border-brand-300 dark:hover:border-brand-700 transition"
						>
							<div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700/60 pb-2">
								<span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
									<span className="h-5 w-5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center text-[11px]">
										{idx + 1}
									</span>
									Card #{idx + 1}
								</span>
								<button
									type="button"
									onClick={() => handleRemoveProduct(idx)}
									className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
									title="Remove product"
								>
									<Icon name="trash" className="h-4 w-4" />
								</button>
							</div>

							<div>
								<label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
									Product Title
								</label>
								<input
									type="text"
									value={prod.title ?? ""}
									onChange={(e) => handleProductChange(idx, "title", e.target.value)}
									placeholder="e.g. Beats Studio Pro Wireless Earbuds – Black"
									className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
										Sale Price ($)
									</label>
									<input
										type="number"
										step="0.01"
										value={prod.price ?? ""}
										onChange={(e) =>
											handleProductChange(idx, "price", parseFloat(e.target.value) || 0)
										}
										placeholder="66.98"
										className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white font-semibold"
									/>
								</div>
								<div>
									<label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
										Old / MSRP Price ($)
									</label>
									<input
										type="number"
										step="0.01"
										value={prod.oldPrice ?? ""}
										onChange={(e) =>
											handleProductChange(
												idx,
												"oldPrice",
												e.target.value ? parseFloat(e.target.value) : null
											)
										}
										placeholder="83.41"
										className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
									/>
								</div>
							</div>

							<div className="grid grid-cols-3 gap-3">
								<div>
									<label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
										Rating (1-5)
									</label>
									<input
										type="number"
										min="1"
										max="5"
										value={prod.rating ?? 5}
										onChange={(e) =>
											handleProductChange(idx, "rating", parseInt(e.target.value, 10) || 5)
										}
										className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
									/>
								</div>
								<div>
									<label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
										Review Count
									</label>
									<input
										type="number"
										min="0"
										value={prod.ratingCount ?? 0}
										onChange={(e) =>
											handleProductChange(
												idx,
												"ratingCount",
												parseInt(e.target.value, 10) || 0
											)
										}
										placeholder="39"
										className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
									/>
								</div>
								<div>
									<label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
										Product Link
									</label>
									<input
										type="text"
										value={prod.link ?? ""}
										onChange={(e) => handleProductChange(idx, "link", e.target.value)}
										placeholder="/product/153"
										className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
									/>
								</div>
							</div>

							{/* Product Images (Desktop & Mobile) */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
								{/* Desktop image */}
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
											Desktop Image
										</span>
										<button
											type="button"
											onClick={() => highlightDesktopRefs.current[idx]?.click()}
											disabled={uploadingTarget === `product-${idx}-desktop`}
											className="text-[11px] font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
										>
											{uploadingTarget === `product-${idx}-desktop` ? "Uploading..." : "Upload"}
										</button>
										<input
											ref={(el) => {
												highlightDesktopRefs.current[idx] = el;
											}}
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(e) => handleProductImageUpload(e, idx, "desktop")}
										/>
									</div>
									<input
										type="text"
										value={prod.imgSrc ?? ""}
										onChange={(e) => handleProductChange(idx, "imgSrc", e.target.value)}
										placeholder="/assets/images/product-img/..."
										className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-900 dark:text-white"
									/>
									<div className="h-16 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden p-1">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={resolveImageUrl(prod.imgSrc)}
											alt={prod.title || "Preview"}
											className="max-h-full max-w-full object-contain"
											onError={(e) => {
												(e.target as HTMLImageElement).src = fallbackSvg;
											}}
										/>
									</div>
								</div>

								{/* Mobile image */}
								<div className="space-y-1.5">
									<div className="flex items-center justify-between">
										<span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
											Mobile Image
										</span>
										<button
											type="button"
											onClick={() => highlightMobileRefs.current[idx]?.click()}
											disabled={uploadingTarget === `product-${idx}-mobile`}
											className="text-[11px] font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
										>
											{uploadingTarget === `product-${idx}-mobile` ? "Uploading..." : "Upload"}
										</button>
										<input
											ref={(el) => {
												highlightMobileRefs.current[idx] = el;
											}}
											type="file"
											accept="image/*"
											className="hidden"
											onChange={(e) => handleProductImageUpload(e, idx, "mobile")}
										/>
									</div>
									<input
										type="text"
										value={prod.mobileImgSrc ?? ""}
										onChange={(e) => handleProductChange(idx, "mobileImgSrc", e.target.value)}
										placeholder="Optional mobile image"
										className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-900 dark:text-white"
									/>
									<div className="h-16 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden p-1">
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img
											src={resolveImageUrl(prod.mobileImgSrc || prod.imgSrc)}
											alt={prod.title || "Preview"}
											className="max-h-full max-w-full object-contain"
											onError={(e) => {
												(e.target as HTMLImageElement).src = fallbackSvg;
											}}
										/>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* ============================================================== */}
			{/* SECTION 4: This Week’s Highlights Banner (Right side banner) */}
			{/* ============================================================== */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm space-y-6">
				<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
							Banner Two
						</span>
						<h2 className="text-lg font-bold text-slate-900 dark:text-white">
							This Week&apos;s Highlights Banner (Right Side)
						</h2>
						<p className="text-xs text-slate-500">
							Appears next to the highlights product grid on the home page.
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
								Section Title (Heading above the 6 products)
							</label>
							<input
								type="text"
								value={highlightsBanner?.sectionTitle ?? ""}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										sectionTitle: e.target.value,
									})
								}
								placeholder="This Week’s Highlights"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
							/>
						</div>

						<div>
							<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
								Top Subtitle
							</label>
							<input
								type="text"
								value={highlightsBanner?.subtitle ?? ""}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										subtitle: e.target.value,
									})
								}
								placeholder="Power Up Deals"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Title (Bold Prefix)
								</label>
								<input
									type="text"
									value={highlightsBanner?.titleBold ?? ""}
									onChange={(e) =>
										setHighlightsBanner({
											...highlightsBanner,
											titleBold: e.target.value,
										})
									}
									placeholder="THE NEXT GEN"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Title (Regular Suffix)
								</label>
								<input
									type="text"
									value={highlightsBanner?.titleRegular ?? ""}
									onChange={(e) =>
										setHighlightsBanner({
											...highlightsBanner,
											titleRegular: e.target.value,
										})
									}
									placeholder="OF SMARTPHONE"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
								/>
							</div>
						</div>

						<div>
							<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
								Secondary Subtitle (Handwriting / Blue style)
							</label>
							<input
								type="text"
								value={highlightsBanner?.secondarySubtitle ?? ""}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										secondarySubtitle: e.target.value,
									})
								}
								placeholder="Grab huge savings"
								className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Button Label
								</label>
								<input
									type="text"
									value={highlightsBanner?.btnText ?? ""}
									onChange={(e) =>
										setHighlightsBanner({
											...highlightsBanner,
											btnText: e.target.value,
										})
									}
									placeholder="SHOP NOW"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
								/>
							</div>
							<div>
								<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
									Button Link
								</label>
								<input
									type="text"
									value={highlightsBanner?.link ?? ""}
									onChange={(e) =>
										setHighlightsBanner({
											...highlightsBanner,
											link: e.target.value,
										})
									}
									placeholder="/shop"
									className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500"
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
									className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
								>
									<Icon name="upload" className="h-3.5 w-3.5" />
									{uploadingTarget === "highlights-desktop" ? "Uploading..." : "Upload Image"}
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
								value={highlightsBanner?.imgSrc ?? ""}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										imgSrc: e.target.value,
									})
								}
								placeholder="/assets/images/product-banner/product-banner-img-02.webp"
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
							/>
							<div className="relative h-24 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden p-2">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={resolveImageUrl(highlightsBanner?.imgSrc)}
									alt="Highlights Desktop Preview"
									className="max-h-full max-w-full object-contain"
									onError={(e) => {
										(e.target as HTMLImageElement).src = fallbackSvg;
									}}
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
									className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
								>
									<Icon name="upload" className="h-3.5 w-3.5" />
									{uploadingTarget === "highlights-mobile" ? "Uploading..." : "Upload Image"}
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
								value={highlightsBanner?.mobileImgSrc ?? ""}
								onChange={(e) =>
									setHighlightsBanner({
										...highlightsBanner,
										mobileImgSrc: e.target.value,
									})
								}
								placeholder="Optional mobile image path or URL"
								className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
							/>
							<div className="relative h-24 w-full rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden p-2">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={resolveImageUrl(
										highlightsBanner?.mobileImgSrc || highlightsBanner?.imgSrc
									)}
									alt="Highlights Mobile Preview"
									className="max-h-full max-w-full object-contain"
									onError={(e) => {
										(e.target as HTMLImageElement).src = fallbackSvg;
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
