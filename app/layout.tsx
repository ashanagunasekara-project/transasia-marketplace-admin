import type { Metadata } from "next";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";
import { baseURL } from "@/utils/cn";

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: siteConfig.name,
		template: `%s | ${siteConfig.name}`,
	},
	description: siteConfig.description,
	applicationName: siteConfig.name,
	icons: {
		icon: [
			{
				url: `${baseURL}assets/images/favicon.png`,
				type: "image/png",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html lang="en" className="h-full antialiased" suppressHydrationWarning>
			<body className="min-h-full bg-surface-body text-ink-500">
				<AppProviders>{children}</AppProviders>
			</body>
		</html>
	);
}
