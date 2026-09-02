import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { routes } from "@/config/routes";
import { baseURL } from "@/utils/cn";

export const metadata: Metadata = {
	title: "Sign In",
};

export default function SignInPage() {
	return (
		<form className="w-full max-w-[440px] rounded-card border border-surface-line bg-surface-card p-6 shadow-card relative">
			<Link
				aria-label="Unimart dashboard"
				className="inline-flex items-center lg:hidden"
				href={routes.dashboard}
			>
				<Image
					alt="Unimart"
					className="h-9 w-auto"
					height={36}
					priority
					src={`${baseURL}assets/images/logo/logo.webp`}
					width={160}
				/>
			</Link>
			<div className="mt-8 lg:mt-0">
				<p className="mb-1 text-[13px] font-semibold uppercase text-brand-600">
					Welcome back
				</p>
				<h1 className="text-[26px] font-semibold text-ink-900">
					Sign in to admin
				</h1>
				<p className="mt-2 text-[14px] text-ink-500">
					Use the demo credentials to preview the dashboard template.
				</p>
			</div>

			<div className="mt-6 space-y-4">
				<label className="block">
					<span className="text-[14px] font-semibold text-ink-700">
						Email address
					</span>
					<input
						className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px] focus:border-brand-600"
						defaultValue="admin@unimart.local"
						type="email"
					/>
				</label>
				<label className="block">
					<span className="text-[14px] font-semibold text-ink-700">
						Password
					</span>
					<input
						className="mt-2 h-11 w-full rounded-base border border-surface-line bg-surface-body px-4 text-[14px] focus:border-brand-600"
						defaultValue="password"
						type="password"
					/>
				</label>
			</div>

			<div className="mt-5 flex items-center justify-between gap-3 text-[14px]">
				<label className="flex items-center gap-2 text-ink-600">
					<input
						className="h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
						defaultChecked
						type="checkbox"
					/>
					Remember me
				</label>
				<Link
					className="font-semibold text-brand-600 hover:text-brand-700"
					href={routes.signIn}
				>
					Forgot password?
				</Link>
			</div>

			<Link
				className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-base bg-brand-600 text-[14px] font-semibold text-white hover:bg-brand-700"
				href={routes.dashboard}
			>
				Sign In
			</Link>
			<p className="mt-4 text-center text-[13px] text-ink-400">
				Demo template only. Authentication is not wired to a backend.
			</p>
		</form>
	);
}
