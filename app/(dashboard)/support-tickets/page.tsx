import { SupportTicketListTable } from "@/components/admin/operation-list-pages";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { supportTickets } from "@/data/admin/operations";

export default function SupportTicketsPage() {
	return (
		<>
			<PageHeader
				actions={
					<button
						className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						type="button"
					>
						<Icon className="h-4 w-4" name="plus" />
						New Ticket
					</button>
				}
				description="Track customer requests, assignment, priority, and resolution status."
				eyebrow="Support"
				title="Support Tickets"
			/>
			<SupportTicketListTable tickets={supportTickets} />
		</>
	);
}
