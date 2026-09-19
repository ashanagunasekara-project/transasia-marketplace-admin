import { CustomersClient } from "@/components/customers/customers-client";
import { type ApiCustomer, fetchCustomers, fetchCustomerStats } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
	let initialCustomers: ApiCustomer[] = [];
	let initialStats = {
		locked: 0,
		regular: 0,
		total: 0,
		wholesaleApproved: 0,
		wholesalePending: 0,
	};

	try {
		const [custRes, statsRes] = await Promise.all([
			fetchCustomers(),
			fetchCustomerStats(),
		]);
		initialCustomers = custRes.customers;
		initialStats = statsRes;
	} catch (e) {
		console.warn("Server fetch customers error:", e);
	}

	return (
		<CustomersClient
			initialCustomers={initialCustomers}
			initialStats={initialStats}
		/>
	);
}
