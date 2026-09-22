"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Icon } from "@/components/layout/icon";
import {
	fetchBrandingSettings,
	updateBrandingSettings,
	uploadImageFile,
	resolveImageUrl,
} from "@/lib/api";

export function StoreProfileForm() {
	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [statusMessage, setStatusMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);

	const [storeName, setStoreName] = useState("Transasia");
	const [supportEmail, setSupportEmail] = useState("support@transasia.lk");
	const [logoUrl, setLogoUrl] = useState("/assets/images/logo/logo.webp");
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		async function loadSettings() {
			try {
				const branding = await fetchBrandingSettings();
				if (branding.storeName) setStoreName(branding.storeName);
				if (branding.logoUrl) setLogoUrl(branding.logoUrl);
			} catch {
				// Fallback to defaults
			}
		}
		loadSettings();
	}, []);

	async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		setUploading(true);
		setStatusMessage(null);
		try {
			const uploadedUrl = await uploadImageFile(file);
			setLogoUrl(uploadedUrl);
			setStatusMessage({
				type: "success",
				text: "Logo image uploaded successfully. Click 'Save Store Identity' to apply.",
			});
		} catch (err: any) {
			setStatusMessage({
				type: "error",
				text: err.message || "Failed to upload logo image.",
			});
		} finally {
			setUploading(false);
		}
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setStatusMessage(null);

		try {
			await updateBrandingSettings({
				storeName: storeName.trim(),
				logoUrl: logoUrl.trim(),
			});
			setStatusMessage({
				type: "success",
				text: "Store identity & logo updated successfully! Changes are now live across all storefront pages.",
			});
		} catch (err: any) {
			setStatusMessage({
				type: "error",
				text: err.message || "Failed to update branding settings.",
			});
		} finally {
			setLoading(false);
		}
	}

	const displayLogoSrc = resolveImageUrl(logoUrl);

	return (
		<form
			onSubmit={handleSubmit}
			className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card"
		>
			<div className="border-b border-surface-line pb-5">
				<h2 className="text-[20px] font-medium text-ink-900">Store Profile & Branding</h2>
				<p className="mt-1 text-[14px] text-ink-500">
					Configure store identity, storefront logo, and metadata displayed on all pages.
				</p>
			</div>

			{statusMessage && (
				<div
					className={`mt-4 flex items-center gap-2 rounded-base p-3 text-[14px] ${
						statusMessage.type === "success"
							? "bg-emerald-50 text-emerald-800 border border-emerald-200"
							: "bg-red-50 text-red-800 border border-red-200"
					}`}
				>
					<Icon
						name={statusMessage.type === "success" ? "check" : "alertTriangle"}
						className="h-4 w-4 shrink-0"
					/>
					<span>{statusMessage.text}</span>
				</div>
			)}

			{/* Storefront Logo Management Card */}
			<div className="mt-6 rounded-card border border-brand-200 bg-brand-50/20 p-5">
				<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
					<div>
						<h3 className="text-[16px] font-semibold text-ink-900">
							Storefront Logo (Configurable)
						</h3>
						<p className="mt-1 text-[13px] text-ink-500">
							This logo is displayed in headers, footers, mobile menus, and sign-in pages.
						</p>
					</div>

					<div className="flex items-center gap-2">
						<input
							type="file"
							ref={fileInputRef}
							onChange={handleLogoUpload}
							accept="image/*"
							className="hidden"
						/>
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							disabled={uploading}
							className="inline-flex h-9 items-center gap-1.5 rounded-base border border-surface-line bg-white px-3 text-[13px] font-medium text-ink-800 shadow-sm hover:bg-surface-line/20 disabled:opacity-50"
						>
							<Icon name="upload" className="h-4 w-4" />
							{uploading ? "Uploading..." : "Upload New Logo"}
						</button>
						<button
							type="button"
							onClick={() => setLogoUrl("/assets/images/logo/logo.webp")}
							className="inline-flex h-9 items-center gap-1.5 rounded-base border border-surface-line bg-white px-3 text-[13px] font-medium text-ink-600 shadow-sm hover:bg-surface-line/20"
							title="Reset to default storefront logo"
						>
							<Icon name="refresh" className="h-3.5 w-3.5" />
							Reset
						</button>
					</div>
				</div>

				<div className="mt-4 flex flex-col sm:flex-row items-center gap-5 rounded-base border border-surface-line bg-white p-4">
					<div className="flex h-20 w-48 shrink-0 items-center justify-center rounded-base border border-surface-line bg-gray-900 p-2">
						<img
							src={displayLogoSrc}
							alt="Current Logo Preview"
							className="max-h-full max-w-full object-contain"
						/>
					</div>
					<div className="flex-1 w-full space-y-2">
						<div className="flex items-center justify-between">
							<span className="text-[12px] font-medium text-ink-500">
								Current Logo Source:
							</span>
							<span className="text-[11px] font-mono text-ink-400 truncate max-w-xs">
								{logoUrl}
							</span>
						</div>
						<div className="flex gap-2">
							<input
								type="text"
								value={logoUrl}
								onChange={(e) => setLogoUrl(e.target.value)}
								placeholder="Enter image URL or upload above"
								className="h-9 flex-1 rounded-base border border-surface-line px-3 text-[13px] text-ink-800 focus:border-brand-500 focus:outline-none"
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Store Identity Fields */}
			<div className="mt-6 grid gap-5 md:grid-cols-2">
				<div>
					<label className="block text-[13px] font-medium text-ink-700">
						Store Name <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						value={storeName}
						onChange={(e) => setStoreName(e.target.value)}
						required
						className="mt-1 h-10 w-full rounded-base border border-surface-line px-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none"
					/>
				</div>

				<div>
					<label className="block text-[13px] font-medium text-ink-700">
						Support Email
					</label>
					<input
						type="email"
						value={supportEmail}
						onChange={(e) => setSupportEmail(e.target.value)}
						className="mt-1 h-10 w-full rounded-base border border-surface-line px-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none"
					/>
				</div>

				<div>
					<label className="block text-[13px] font-medium text-ink-700">
						Default Currency
					</label>
					<select
						defaultValue="LKR - Sri Lankan Rupee"
						className="mt-1 h-10 w-full rounded-base border border-surface-line px-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none"
					>
						<option value="LKR">LKR - Sri Lankan Rupee</option>
						<option value="USD">USD - US Dollar</option>
					</select>
				</div>

				<div>
					<label className="block text-[13px] font-medium text-ink-700">
						Timezone
					</label>
					<select
						defaultValue="Asia/Colombo"
						className="mt-1 h-10 w-full rounded-base border border-surface-line px-3 text-[14px] text-ink-900 focus:border-brand-500 focus:outline-none"
					>
						<option value="Asia/Colombo">Asia/Colombo (GMT+5:30)</option>
						<option value="UTC">UTC</option>
					</select>
				</div>
			</div>

			<div className="mt-6 flex justify-end border-t border-surface-line pt-5">
				<button
					type="submit"
					disabled={loading || uploading}
					className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white shadow-sm hover:bg-brand-700 disabled:opacity-50"
				>
					<Icon name="save" className="h-4 w-4" />
					{loading ? "Saving Settings..." : "Save Store Identity & Logo"}
				</button>
			</div>
		</form>
	);
}
