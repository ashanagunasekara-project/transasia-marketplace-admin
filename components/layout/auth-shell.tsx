import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/config/routes";
import { baseURL } from "@/utils/cn";

type AuthShellProps = {
	children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
	return (
		<main className="grid min-h-screen bg-surface-body lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1fr)]">
			<section className="hidden bg-gradient-to-b from-brand-600 to-admin-sidebar-dark p-10 text-white lg:flex lg:flex-col relative">
				<Link
					aria-label="Unimart dashboard"
					className="inline-flex items-center relative z-1"
					href={routes.dashboard}
				>
					<Image
						alt="Unimart"
						className="h-10 w-auto"
						height={40}
						priority
						src={`${baseURL}assets/images/logo/logo.webp`}
						width={178}
					/>
				</Link>

				<Image
					src={`${baseURL}assets/images/banner/signin-banner.webp`}
					alt="Unimart"
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					priority
					unoptimized
				/>
			</section>
			<section className="flex items-center justify-center px-4 py-10 bg-[linear-gradient(to_bottom,#bed0fa,#79a4fa)] lg:bg-[linear-gradient(to_bottom,transparent,transparent)] relative">
				<Image
					className="lg:hidden object-cover"
					src={`${baseURL}assets/images/banner/signin-banner-small-devices.webp`}
					alt="Unimart"
					fill
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					priority
					unoptimized
				/>
				{children}
			</section>
		</main>
	);
}
