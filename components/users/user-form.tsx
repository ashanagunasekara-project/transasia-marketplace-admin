"use client";

import Link from "next/link";
import {
	Field,
	FormCard,
	SelectField,
	TextAreaField,
} from "@/components/forms/admin-form-primitives";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";

export function UserForm() {
	return (
		<>
			<div className="mb-5">
				<Breadcrumb
					items={[
						{ href: routes.dashboard, label: "Home" },
						{ href: routes.customers, label: "Users" },
						{ label: "Add User" },
					]}
				/>
				<p className="mb-1 text-[13px] font-semibold uppercase text-brand-600">
					Users
				</p>
				<h1 className="text-[22px] font-semibold text-ink-900">Add User</h1>
				<p className="mt-1 text-[14px] text-ink-500">
					Create an admin, staff, or customer profile.
				</p>
			</div>
			<form className="grid min-w-0 max-w-full gap-4 xl:grid-cols-[minmax(0,1fr)_280px]">
				<div className="min-w-0">
					<FormCard title="Profile Information">
						<div className="grid gap-4 sm:grid-cols-2">
							<Field
								label="Full Name"
								name="name"
								placeholder="Full name"
								required
							/>
							<Field
								label="Email"
								name="email"
								placeholder="email@example.com"
								required
								type="email"
							/>
							<Field label="Phone" name="phone" placeholder="+1 555 0000" />
							<SelectField
								label="Role"
								name="role"
								options={["Customer", "Staff", "Admin"]}
								required
							/>
							<TextAreaField
								className="sm:col-span-2"
								label="Address"
								name="address"
								placeholder="Street, city, postal code"
							/>
						</div>
					</FormCard>
				</div>
				<aside className="min-w-0 space-y-4">
					<FormCard title="Account Status">
						<SelectField
							defaultValue="Active"
							label="Status"
							name="status"
							options={["Active", "Inactive", "Pending"]}
						/>
					</FormCard>
					<FormCard title="Invite">
						<label className="inline-flex cursor-pointer items-start gap-2">
							<input
								className="mt-0.5 h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
								defaultChecked
								name="send_welcome"
								type="checkbox"
							/>
							<span>
								<span className="block text-[14px] font-semibold text-ink-900">
									Send welcome email
								</span>
								<span className="mt-1 block text-[12px] text-ink-400">
									Send login instructions after the profile is created.
								</span>
							</span>
						</label>
					</FormCard>
				</aside>
			</form>
			<div className="mt-6 flex items-center justify-end gap-3 border-t border-surface-line pt-5">
				<Link
					className="inline-flex h-10 items-center gap-2 rounded-base border border-surface-line px-5 text-[14px] font-semibold text-ink-700 hover:bg-surface-muted"
					href={routes.customers}
				>
					Cancel
				</Link>
				<button
					className="inline-flex h-10 items-center gap-2 rounded-base bg-brand-600 px-5 text-[14px] font-semibold text-white hover:bg-brand-700"
					type="submit"
				>
					<Icon className="h-4 w-4" name="save" />
					Save Changes
				</button>
			</div>
		</>
	);
}
