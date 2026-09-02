import Link from "next/link";
import { CustomerListTable } from "@/components/catalog/list-pages";
import { StatCard } from "@/components/layout/dashboard-widgets";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";
import { customers } from "@/data/admin/catalog";

export default function CustomersPage() {
	return (
		<>
			<PageHeader
				actions={
					<Link
						className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						href={routes.addUser}
					>
						<Icon className="h-4 w-4" name="user-plus" />
						Add Customer
					</Link>
				}
				description="Review customer value, recent orders, and account health."
				eyebrow="CRM"
				title="Customers"
			/>
			<div className="mb-6 grid gap-4 md:grid-cols-3">
				<StatCard
					accentBorder="border-brand-500"
					badge="+12"
					badgeClass="bg-brand-50 text-brand-600"
					icon="users"
					iconClass="bg-brand-50 text-brand-600"
					label="New Customers"
					value="348"
				/>
				<StatCard
					accentBorder="border-success-500"
					badge="+4.2%"
					badgeClass="bg-success-50 text-success-600"
					icon="refresh-ccw"
					iconClass="bg-success-50 text-success-600"
					label="Repeat Rate"
					value="62%"
				/>
				<StatCard
					accentBorder="border-warning-500"
					badge="Review"
					badgeClass="bg-warning-50 text-warning-600"
					icon="circle-alert"
					iconClass="bg-warning-50 text-warning-600"
					label="At Risk"
					value="19"
				/>
			</div>
			<CustomerListTable customers={customers} />
		</>
	);
}
