"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { Icon } from "@/components/layout/icon";
import { routes } from "@/config/routes";

type CategoryScrollerProps = {
	categories: Array<{
		image: string;
		label: string;
	}>;
};

export function CategoryScroller({ categories }: CategoryScrollerProps) {
	const scrollerRef = useRef<HTMLDivElement>(null);
	const [atStart, setAtStart] = useState(true);
	const [atEnd, setAtEnd] = useState(false);

	function updateArrows() {
		const scroller = scrollerRef.current;
		if (!scroller) {
			return;
		}

		setAtStart(scroller.scrollLeft <= 0);
		setAtEnd(
			scroller.scrollLeft >= scroller.scrollWidth - scroller.clientWidth - 2,
		);
	}

	function scrollByDirection(direction: "next" | "prev") {
		const scroller = scrollerRef.current;
		if (!scroller) {
			return;
		}

		const step = Math.max(scroller.clientWidth * 0.8, 200);
		scroller.scrollTo({
			behavior: "smooth",
			left: scroller.scrollLeft + (direction === "next" ? step : -step),
		});
	}

	return (
		<section className="mt-6 rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<div className="flex items-center justify-between gap-3">
				<h1 className="text-[20px] font-medium text-ink-900">Category</h1>
				<div className="flex items-center gap-3">
					<Link
						className="text-[14px] font-semibold text-brand-600 hover:text-brand-700"
						href={routes.categories}
					>
						View all
					</Link>
					<div className="flex items-center gap-1.5">
						<button
							aria-label="Previous categories"
							className="grid h-8 w-8 place-items-center rounded-full border border-surface-line text-ink-500 transition-colors hover:bg-surface-muted hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-500"
							disabled={atStart}
							onClick={() => scrollByDirection("prev")}
							type="button"
						>
							<Icon className="h-4 w-4" name="chevron-left" />
						</button>
						<button
							aria-label="Next categories"
							className="grid h-8 w-8 place-items-center rounded-full border border-surface-line text-ink-500 transition-colors hover:bg-surface-muted hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink-500"
							disabled={atEnd}
							onClick={() => scrollByDirection("next")}
							type="button"
						>
							<Icon className="h-4 w-4" name="chevron-right" />
						</button>
					</div>
				</div>
			</div>
			<div
				className="no-scrollbar mt-5 flex flex-nowrap gap-5 overflow-x-auto pb-2"
				onScroll={updateArrows}
				ref={scrollerRef}
			>
				{categories.map((category) => (
					<Link
						className="group min-w-[110px] text-center"
						href={routes.products}
						key={category.label}
					>
						<span className="mx-auto block h-[104px] w-[104px] transition duration-300">
							<Image
								alt=""
								className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
								height={104}
								src={category.image}
								width={104}
							/>
						</span>
						<span className="mt-3 block truncate text-[14px] tracking-normal text-ink-600 transition-colors group-hover:text-brand-600">
							{category.label}
						</span>
					</Link>
				))}
			</div>
		</section>
	);
}
