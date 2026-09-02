"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { routes } from "@/config/routes";
import { baseURL, cn } from "@/utils/cn";
import { useDashboardChrome } from "./dashboard-chrome";
import { Icon } from "./icon";

export function Header() {
	return (
		<header className="sticky top-0 z-20 flex h-[60px] items-center border-b border-surface-line bg-surface-card px-4 lg:h-topbar lg:px-6">
			<MobileSidebarButton />
			<MobileLogo />
			<SearchUi />
			<div className="ml-auto flex items-center gap-2 sm:gap-4">
				<Notifications />
				<ThemeToggle />
				<UserProfileDropdown variant="topbar" />
			</div>
		</header>
	);
}

function MobileSidebarButton() {
	const { mobileOpen, toggleMobile } = useDashboardChrome();

	return (
		<button
			aria-controls="admin-sidebar"
			aria-expanded={mobileOpen}
			aria-label="Open sidebar"
			className="mr-3 inline-flex h-10 w-10 items-center justify-center rounded-base border border-surface-line text-ink-700 hover:bg-surface-muted lg:hidden"
			onClick={toggleMobile}
			type="button"
		>
			<Icon className="h-5 w-5" name="menu" />
		</button>
	);
}

function MobileLogo() {
	return (
		<Link
			aria-label="Unimart dashboard"
			className="absolute left-1/2 -translate-x-1/2 lg:hidden"
			href={routes.dashboard}
		>
			<Image
				alt="Unimart"
				className="h-7 w-auto dark:hidden"
				height={32}
				priority
				src={`${baseURL}assets/images/logo/logo.webp`}
				width={142}
			/>
			<Image
				alt="Unimart"
				className="hidden h-7 w-auto dark:block"
				height={32}
				src={`${baseURL}assets/images/logo/logo-blackbg.webp`}
				width={142}
			/>
		</Link>
	);
}

export function SearchUi() {
	return (
		<search className="hidden w-full max-w-[520px] items-center lg:flex">
			<form className="contents">
				<label className="sr-only" htmlFor="global-search">
					Search dashboard
				</label>
				<input
					className="h-10 flex-1 rounded-l-card border border-r-0 border-surface-line bg-surface-body px-5 text-[15px] text-ink-700 placeholder:text-ink-400 focus:border-brand-600"
					id="global-search"
					placeholder="Search Unimart .."
					type="search"
				/>
				<button
					aria-label="Submit search"
					className="inline-flex h-10 w-14 items-center justify-center rounded-r-card bg-brand-600 text-white hover:bg-brand-700 cursor-pointer"
					type="submit"
				>
					<Icon className="h-5 w-5" name="search" />
				</button>
			</form>
		</search>
	);
}

export function Notifications() {
	return (
		<Link
			aria-label="Notifications, 4 unread"
			className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card"
			href={routes.notifications}
		>
			<Icon className="h-5 w-5" name="bell" />
			<span className="absolute right-0 top-0 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-danger-500 px-1 text-[10px] font-semibold leading-none text-white">
				49
			</span>
		</Link>
	);
}

export function ThemeToggle() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		setDark(document.documentElement.classList.contains("dark"));
	}, []);

	function toggleTheme() {
		const nextDark = !dark;
		document.documentElement.classList.add("no-theme-transition");
		document.documentElement.classList.toggle("dark", nextDark);
		localStorage.setItem("unimart-theme", nextDark ? "dark" : "light");
		setDark(nextDark);

		requestAnimationFrame(() => {
			requestAnimationFrame(() =>
				document.documentElement.classList.remove("no-theme-transition"),
			);
		});
	}

	return (
		<button
			aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
			aria-pressed={dark}
			className="hidden h-10 w-10 items-center justify-center rounded-full text-ink-700 hover:bg-surface-muted sm:inline-flex"
			onClick={toggleTheme}
			type="button"
		>
			<Icon className="h-5 w-5" name={dark ? "sun" : "moon"} />
		</button>
	);
}

type UserProfileDropdownProps = {
	variant: "sidebar" | "topbar";
};

export function UserProfileDropdown({ variant }: UserProfileDropdownProps) {
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const menuId =
		variant === "topbar" ? "topbar-user-menu" : "sidebar-user-menu";

	useEffect(() => {
		function onDocumentClick(event: MouseEvent) {
			if (!containerRef.current?.contains(event.target as Node)) {
				setOpen(false);
			}
		}

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				setOpen(false);
			}
		}

		document.addEventListener("click", onDocumentClick);
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.removeEventListener("click", onDocumentClick);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, []);

	if (variant === "sidebar") {
		return (
			<div
				className="relative border-t border-surface-line p-3"
				ref={containerRef}
			>
				<button
					aria-controls={menuId}
					aria-expanded={open}
					aria-haspopup="menu"
					className="user-switch flex w-full items-center gap-3 rounded-base px-2 py-2 text-left transition-colors hover:bg-surface-muted"
					onClick={() => setOpen((current) => !current)}
					type="button"
				>
					<Image
						alt="Emay Walter"
						className="h-9 w-9 shrink-0 rounded-full object-cover"
						height={36}
						src={`${baseURL}assets/avatars/admin-avatar.svg`}
						width={36}
					/>
					<span className="user-text min-w-0 flex-1">
						<span className="block truncate text-[14px] font-semibold text-ink-900">
							Emay Walter
						</span>
						<span className="block truncate text-[12px] text-ink-400">
							admin@unimart.local
						</span>
					</span>
					<Icon
						className="user-text h-4 w-4 shrink-0 text-ink-400"
						name="chevrons-up-down"
					/>
				</button>
				<UserMenu id={menuId} open={open} placement="sidebar" />
			</div>
		);
	}

	return (
		<div className="relative" ref={containerRef}>
			<button
				aria-controls={menuId}
				aria-expanded={open}
				aria-haspopup="menu"
				aria-label="Emay Walter Admin - open account menu"
				className="flex items-center gap-3 rounded-card px-2 py-1.5 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card"
				onClick={() => setOpen((current) => !current)}
				type="button"
			>
				<Image
					alt="Emay Walter"
					className="h-10 w-10 rounded-full border border-surface-line object-cover"
					height={40}
					src={`${baseURL}assets/avatars/admin-avatar.svg`}
					width={40}
				/>
				<span className="hidden text-left lg:block">
					<span className="block text-[15px] font-semibold leading-tight text-ink-900">
						Emay Walter
					</span>
					<span className="flex items-center gap-1 text-[13px] text-ink-500">
						Admin <Icon className="h-3.5 w-3.5" name="chevron-down" />
					</span>
				</span>
			</button>
			<UserMenu id={menuId} open={open} placement="topbar" />
		</div>
	);
}

type UserMenuProps = {
	id: string;
	open: boolean;
	placement: "sidebar" | "topbar";
};

function UserMenu({ id, open, placement }: UserMenuProps) {
	const placementClass =
		placement === "topbar"
			? "absolute right-0 top-full z-50 mt-2 w-64"
			: "absolute bottom-full left-3 right-3 z-50 mb-2";

	return (
		<div
			className={cn(
				placementClass,
				"rounded-card border border-surface-line bg-surface-card p-1.5 shadow-lift",
				open ? "block" : "hidden",
			)}
			id={id}
			role="menu"
		>
			<div className="flex items-center gap-3 border-b border-surface-line px-2 pb-3 pt-2">
				<Image
					alt="Emay Walter"
					className="h-9 w-9 rounded-full object-cover"
					height={36}
					src={`${baseURL}assets/avatars/admin-avatar.svg`}
					width={36}
				/>
				<span className="min-w-0 flex-1">
					<span className="block truncate text-[14px] font-semibold text-ink-900">
						Emay Walter
					</span>
					<span className="block truncate text-[12px] text-ink-400">
						admin@unimart.local
					</span>
				</span>
			</div>
			<div className="space-y-0.5 py-1.5">
				<UserMenuItem
					href={routes.settings}
					icon="settings"
					label="Profile Setting"
				/>
				<UserMenuItem
					href={routes.notifications}
					icon="bell"
					label="Notifications"
				/>
				<UserMenuItem href={routes.history} icon="history" label="History" />
				{placement === "sidebar" ? (
					<UserMenuItem
						href={routes.integrations}
						icon="folder"
						label="Integrations"
					/>
				) : null}
			</div>
			<div className="border-t border-surface-line py-1.5">
				<Link
					aria-label="Update App"
					className="flex items-center gap-3 rounded-base bg-success-50 px-2 py-2 text-[14px] font-semibold text-success-600 transition-colors hover:bg-success-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
					href={routes.updateApp}
					role="menuitem"
				>
					<span className="h-2 w-2 rounded-full bg-success-500" />
					<span className="nav-text">Update App</span>
				</Link>
				<UserMenuItem
					className="mt-0.5"
					href={routes.signIn}
					icon="log-out"
					label="Logout"
				/>
			</div>
			{placement === "sidebar" ? (
				<p className="px-2 pb-1 pt-2 text-[12px] text-ink-400 nav-text">
					v1.5.69 - Terms &amp; Conditions
				</p>
			) : null}
		</div>
	);
}

type UserMenuItemProps = {
	className?: string;
	href: string;
	icon: string;
	label: string;
};

function UserMenuItem({ className, href, icon, label }: UserMenuItemProps) {
	return (
		<Link
			aria-label={label}
			className={cn(
				"flex items-center gap-3 rounded-base px-2 py-2 text-[14px] text-ink-700 transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600",
				className,
			)}
			href={href}
			role="menuitem"
		>
			<Icon className="h-[18px] w-[18px] text-ink-500" name={icon} />
			<span className="nav-text">{label}</span>
		</Link>
	);
}
