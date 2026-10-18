import { CartsClient } from "@/components/carts/carts-client";
import { type AdminCart, type AdminCartStats, fetchAbandonedCarts } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CartsPage() {
	let initialCarts: AdminCart[] = [];
	let initialStats: AdminCartStats = {
		customerCarts: 0,
		guestCarts: 0,
		totalCarts: 0,
	};

	try {
		const res = await fetchAbandonedCarts({ limit: 50 });
		initialCarts = res.carts;
		initialStats = res.stats;
	} catch (e) {
		console.warn("Server fetch carts error:", e);
	}

	return (
		<CartsClient
			initialCarts={initialCarts}
			initialStats={initialStats}
		/>
	);
}
