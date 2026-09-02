import type { Metadata } from "next";
import { UpdateAppPage } from "@/components/workspace/simple-pages";

export const metadata: Metadata = {
	title: "Update App",
};

export default function Page() {
	return <UpdateAppPage />;
}
