import Link from "next/link";
import { AttributeListTable } from "@/components/catalog/list-pages";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";
import { attributes } from "@/data/admin/catalog";

export default function AttributesPage() {
	return (
		<>
			<PageHeader
				actions={
					<Link
						className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
						href={routes.addAttribute}
					>
						<Icon className="h-4 w-4" name="plus" />
						Add Attribute
					</Link>
				}
				description="Manage product options such as size, color, material, and weight."
				eyebrow="Catalog"
				title="Attributes"
			/>
			<AttributeListTable attributes={attributes} />
		</>
	);
}
