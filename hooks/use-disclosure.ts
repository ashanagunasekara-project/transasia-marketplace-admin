"use client";

import { useCallback, useState } from "react";

export function useDisclosure(defaultOpen = false) {
	const [open, setOpen] = useState(defaultOpen);

	const close = useCallback(() => setOpen(false), []);
	const toggle = useCallback(() => setOpen((current) => !current), []);
	const show = useCallback(() => setOpen(true), []);

	return {
		close,
		open,
		setOpen,
		show,
		toggle,
	};
}
