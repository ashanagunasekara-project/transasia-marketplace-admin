import type { NextConfig } from "next";
const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

const nextConfig: NextConfig = {
	basePath: baseURL
};

export default nextConfig;
