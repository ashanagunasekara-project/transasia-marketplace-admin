import type { ReactNode } from "react";
import { DashboardChrome } from "@/components/layout/dashboard-chrome";

type DashboardShellProps = {
	children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
	return <DashboardChrome>{children}</DashboardChrome>;
}
