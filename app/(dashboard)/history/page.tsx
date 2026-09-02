import type { Metadata } from "next";
import { HistoryPage } from "@/components/workspace/simple-pages";

export const metadata: Metadata = {
	title: "History",
};

export default function Page() {
	return <HistoryPage />;
}
