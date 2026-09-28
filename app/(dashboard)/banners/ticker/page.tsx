"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import {
	fetchTopbarSettings,
	updateTopbarSettings,
	type TopbarSlide,
} from "@/lib/api";

export default function TopbarTickerPage() {
	const [slides, setSlides] = useState<TopbarSlide[]>([]);
	const [delay, setDelay] = useState<number>(3500);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [statusMessage, setStatusMessage] = useState<{
		text: string;
		type: "success" | "error";
	} | null>(null);

	useEffect(() => {
		async function load() {
			try {
				setLoading(true);
				const res = await fetchTopbarSettings();
				setSlides(res.slides || []);
				setDelay(res.delay || 3500);
			} catch (err: any) {
				setStatusMessage({
					text: err.message || "Failed to load topbar ticker settings",
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
			const res = await updateTopbarSettings({
				slides,
				delay: Number(delay) || 3500,
			});
			setSlides(res.slides || []);
			setDelay(res.delay || 3500);
			setStatusMessage({
				text: "Topbar ticker updated successfully! Live on storefront.",
				type: "success",
			});
		} catch (err: any) {
			setStatusMessage({
				text: err.message || "Failed to save ticker settings",
				type: "error",
			});
		} finally {
			setSaving(false);
		}
	};

	const handleAddSlide = () => {
		const newSlide: TopbarSlide = {
			id: String(Date.now()),
			text: "Special Discount — Limited time only!",
			linkText: "Shop Now",
			link: "/shop",
		};
		setSlides([...slides, newSlide]);
	};

	const handleRemoveSlide = (idx: number) => {
		if (slides.length <= 1) {
			alert("You must keep at least one announcement slide.");
			return;
		}
		setSlides(slides.filter((_, i) => i !== idx));
	};

	const handleSlideChange = (
		idx: number,
		field: keyof TopbarSlide,
		val: string
	) => {
		const updated = [...slides];
		updated[idx] = { ...updated[idx], [field]: val };
		setSlides(updated);
	};

	return (
		<div className="space-y-6 pb-12">
			<PageHeader
				title="Topbar Announcements Ticker"
				description="Manage the sliding notification ticker displayed at the top header of the storefront."
				actions={
					<div className="flex items-center gap-3">
						<button
							onClick={handleAddSlide}
							className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
						>
							<Icon name="plus" className="h-4 w-4" />
							Add Announcement
						</button>
						<button
							onClick={handleSave}
							disabled={saving}
							className="inline-flex items-center gap-2 rounded-base bg-brand-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-brand-700 disabled:opacity-50 transition"
						>
							<Icon name="check" className="h-4 w-4" />
							{saving ? "Saving..." : "Save Changes"}
						</button>
					</div>
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

			{/* Live Storefront Ticker Preview */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-white p-5 shadow-sm">
				<div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
					<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
						<span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
						Live Topbar Preview
					</div>
					<span className="text-xs text-slate-400">
						Auto-cycle speed: {delay}ms
					</span>
				</div>

				<div className="py-2 flex items-center justify-center overflow-hidden">
					{slides.length > 0 ? (
						<div className="flex items-center text-sm font-medium text-center">
							<span className="mr-2 text-amber-400">⚡</span>
							<span>{slides[0]?.text}</span>
							{slides[0]?.linkText && (
								<span className="ml-3 underline font-semibold text-primary-400 cursor-pointer">
									{slides[0]?.linkText} →
								</span>
							)}
						</div>
					) : (
						<span className="text-xs text-slate-500">No slides configured</span>
					)}
				</div>
			</div>

			{/* Settings Card */}
			<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
				<h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">
					Slider Transition Speed
				</h3>
				<div className="max-w-xs">
					<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
						Rotation Delay (milliseconds)
					</label>
					<input
						type="number"
						step="500"
						min="1000"
						value={delay ?? 3500}
						onChange={(e) => setDelay(Number(e.target.value))}
						className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
					/>
					<p className="text-xs text-slate-500 mt-1">
						Recommended: 3500ms (3.5 seconds)
					</p>
				</div>
			</div>

			{/* Slide list */}
			<div className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-semibold text-slate-900 dark:text-white">
						Announcements ({slides.length})
					</h3>
				</div>

				{loading ? (
					<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center text-slate-500">
						Loading announcements...
					</div>
				) : (
					slides.map((slide, idx) => (
						<div
							key={slide.id || idx}
							className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-slate-300 dark:hover:border-slate-700"
						>
							<div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
								<div className="flex items-center gap-2">
									<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-950 text-xs font-bold text-primary-700 dark:text-primary-300">
										{idx + 1}
									</span>
									<span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
										Announcement #{idx + 1}
									</span>
								</div>
								<button
									onClick={() => handleRemoveSlide(idx)}
									className="text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition"
								>
									<Icon name="trash" className="h-4 w-4" />
								</button>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="md:col-span-2">
									<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
										Announcement Message / Text
									</label>
									<input
										type="text"
										value={slide.text ?? ""}
										onChange={(e) =>
											handleSlideChange(idx, "text", e.target.value)
										}
										placeholder="e.g. The best-selling watch —all under $100."
										className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
									/>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<div>
										<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
											Link Text
										</label>
										<input
											type="text"
											value={slide.linkText ?? ""}
											onChange={(e) =>
												handleSlideChange(idx, "linkText", e.target.value)
											}
											placeholder="Shop Now"
											className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
									<div>
										<label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
											URL / Route
										</label>
										<input
											type="text"
											value={slide.link ?? ""}
											onChange={(e) =>
												handleSlideChange(idx, "link", e.target.value)
											}
											placeholder="/shop"
											className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
										/>
									</div>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
