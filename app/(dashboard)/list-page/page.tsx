import { TemplateListTable } from "@/components/admin/operation-list-pages";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { templateListItems } from "@/data/admin/operations";

export default function ListPage() {
	return (
		<>
			<PageHeader
				actions={
					<button
						className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						type="button"
					>
						<Icon className="h-4 w-4" name="plus" />
						Add Item
					</button>
				}
				description="A reusable list layout for future admin sections."
				eyebrow="Template"
				title="List Page"
			/>
			<TemplateListTable items={templateListItems} />
		</>
	);
}
