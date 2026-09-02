"use client";

import Link from "next/link";
import {
	Field,
	FormCard,
	SelectField,
	TextAreaField,
} from "@/components/forms/admin-form-primitives";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";

const permissions = [
	["Manage products", true],
	["Manage orders", true],
	["Manage users", false],
	["Manage coupons", true],
	["View reports", false],
	["Manage settings", false],
] as const;

export function RoleForm() {
	return (
		<>
			<PageHeader
				description="Define role details and dashboard permissions."
				eyebrow="Access Control"
				title="Create Role"
			/>
			<form className="space-y-6" id="create-role-form">
				<FormCard title="Role Details">
					<div className="grid gap-5 md:grid-cols-2">
						<Field
							label="Role Name"
							name="name"
							placeholder="Store Manager"
							required
						/>
						<SelectField
							label="Status"
							name="status"
							options={["Active", "Draft"]}
						/>
						<TextAreaField
							className="md:col-span-2"
							label="Description"
							name="description"
							rows={4}
						/>
					</div>
				</FormCard>
				<FormCard title="Permissions">
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
						{permissions.map(([label, checked]) => (
							<label
								className="flex items-center gap-3 rounded-base border border-surface-line px-4 py-3 text-[14px] font-semibold text-ink-700"
								key={label}
							>
								<input
									className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
									defaultChecked={checked}
									type="checkbox"
								/>
								{label}
							</label>
						))}
					</div>
				</FormCard>
			</form>
			<div className="mt-8 flex items-center justify-end gap-3 border-t border-surface-line pt-5">
				<Link
					className="inline-flex h-11 items-center rounded-base border border-surface-line px-5 text-[14px] font-semibold text-ink-700 hover:bg-surface-muted"
					href={routes.roles}
				>
					Cancel
				</Link>
				<button
					className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700"
					form="create-role-form"
					type="submit"
				>
					<Icon className="h-4 w-4" name="save" />
					Save Changes
				</button>
			</div>
		</>
	);
}
