"use client";

import { useState } from "react";
import { initialTasks } from "@/data/dashboard/data";
import { cn } from "@/utils/cn";

type Task = {
	id: string;
	time: string;
	title: string;
};

export function TodoList() {
	const [tasks, setTasks] = useState<Task[]>(initialTasks);
	const [completed, setCompleted] = useState<Set<string>>(new Set());

	function addTask(formData: FormData) {
		const title = String(formData.get("task") ?? "").trim();
		if (!title) {
			return;
		}

		setTasks((current) => [
			...current,
			{
				id: `${Date.now()}`,
				time: "Just now",
				title,
			},
		]);
	}

	function toggleTask(id: string, checked: boolean) {
		setCompleted((current) => {
			const next = new Set(current);
			if (checked) {
				next.add(id);
			} else {
				next.delete(id);
			}
			return next;
		});
	}

	return (
		<article className="rounded-card border border-surface-line bg-surface-card p-6 shadow-card">
			<h2 className="mb-4 text-[20px] font-medium text-ink-900">To Do List</h2>
			<ul className="space-y-3 text-[14px]">
				{tasks.map((task) => {
					const isCompleted = completed.has(task.id);

					return (
						<li className="flex items-start gap-3" key={task.id}>
							<input
								aria-label="Mark task as complete"
								className="mt-1 h-4 w-4 rounded border-surface-line text-brand-600 focus:ring-brand-600"
								onChange={(event) => toggleTask(task.id, event.target.checked)}
								type="checkbox"
							/>
							<span>
								<span
									className={cn(
										"block font-semibold text-ink-900",
										isCompleted ? "line-through text-ink-400" : "",
									)}
								>
									{task.title}
								</span>
								<span className="text-[13px] text-ink-400">{task.time}</span>
							</span>
						</li>
					);
				})}
			</ul>
			<form action={addTask} className="mt-5 flex gap-2">
				<input
					className="h-11 flex-1 rounded-base border border-surface-line bg-surface-body px-3 text-[14px] focus:border-brand-600"
					name="task"
					placeholder="Enter Task Name"
					type="text"
				/>
				<button
					className="h-11 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700 word-break-keep-all whitespace-nowrap"
					type="submit"
				>
					Add task
				</button>
			</form>
		</article>
	);
}
