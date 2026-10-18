import type { NextConfig } from "next";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const nextConfig: NextConfig = {
	basePath: baseURL,
	experimental: {
		optimizePackageImports: ["lucide-react", "@radix-ui/react-select"],
	},
	images: {
		unoptimized: true,
		remotePatterns: [
			{ protocol: "http", hostname: "localhost" },
			{ protocol: "http", hostname: "127.0.0.1" },
			{ protocol: "https", hostname: "**" },
		],
	},
};

export default nextConfig;
