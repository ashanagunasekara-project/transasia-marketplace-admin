import type { Metadata } from "next";
import { UpgradePage } from "@/components/workspace/simple-pages";

export const metadata: Metadata = {
	title: "Upgrade",
};

export default function Page() {
	return <UpgradePage />;
}
