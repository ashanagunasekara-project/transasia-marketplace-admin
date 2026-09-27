"use client";

import { useEffect, useState } from "react";
import { fetchBrandingSettings, resolveImageUrl } from "@/lib/api";

interface AdminLogoProps {
	className?: string;
	isMarkOnly?: boolean;
}

export function AdminLogo({ className = "", isMarkOnly = false }: AdminLogoProps) {
	const [logoUrl, setLogoUrl] = useState<string>("/assets/images/logo/logo.webp");
	const [storeName, setStoreName] = useState<string>("Transasia");

	useEffect(() => {
		let isMounted = true;
		async function loadBranding() {
			try {
				const branding = await fetchBrandingSettings();
				if (isMounted && branding.logoUrl) {
					setLogoUrl(branding.logoUrl);
					if (branding.storeName) setStoreName(branding.storeName);
				}
			} catch {
				// Keep fallback
			}
		}
		loadBranding();
		return () => {
			isMounted = false;
		};
	}, []);

	const displaySrc = resolveImageUrl(logoUrl);

	if (isMarkOnly) {
		return (
			<img
				alt={storeName}
				className={`logo-mark h-9 w-9 shrink-0 rounded-lg object-contain ${className}`}
				src={displaySrc}
				onError={() => setLogoUrl("/assets/images/logo/logo.webp")}
			/>
		);
	}

	return (
		<img
			alt={storeName}
			className={`logo-full h-8 max-w-[180px] w-auto object-contain ${className}`}
			src={displaySrc}
			onError={() => setLogoUrl("/assets/images/logo/logo.webp")}
		/>
	);
}
