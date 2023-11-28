export function LoadingSpinner({ notFullscreen }: { notFullscreen?: boolean }) {
	const className = notFullscreen
		? "grid place-items-center"
		: "grid place-items-center h-screen";

	return (
		<div className={className}>
			<svg
				className="animate-spin -ml-1 mr-3 h-5 w-5 text-zinc-500 dark:text-zinc-300"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle
					className="opacity-25"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				></circle>
				<path
					className="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		</div>
	);
}

export function LoadingSkeletonCard({ className }: { className?: string }) {
	return (
		<div
			className={
				"p-6 rounded-lg bg-slate-100 dark:bg-neutral-900 w-full " +
				className
			}
		>
			<div className="flex flex-col gap-4 bg-slate-100 dark:bg-neutral-900 animate-pulse">
				<div className="flex flex-row gap-4 items-center">
					<div className="h-10 rounded-full w-2/3 bg-slate-300 dark:bg-neutral-700" />
					<div className="h-4 rounded-full w-full bg-slate-300 dark:bg-neutral-700" />
					<div className="h-4 rounded-full w-full bg-slate-300 dark:bg-neutral-700" />
				</div>
				<div className="h-6 rounded-full bg-slate-300 dark:bg-neutral-700" />
				<div className="h-6 rounded-full bg-slate-300 dark:bg-neutral-700" />
			</div>
		</div>
	);
}

export function LoadingSkeletonCardGrid() {
	return (
		<div className="container grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 w-11/12 place-items-center">
			<LoadingSkeletonCard />
			<LoadingSkeletonCard className="hidden lg:block" />
			<LoadingSkeletonCard className="hidden 2xl:block" />
		</div>
	);
}

export function LoadingSkeletonCalendar() {
	return (
		<div className="p-6 rounded-lg bg-slate-100 dark:bg-neutral-900 w-11/12">
			<div className="flex flex-col gap-4 bg-slate-100 dark:bg-neutral-900 animate-pulse">
				<div className="h-8 rounded-full max-w-xs w-4/12 bg-slate-300 dark:bg-neutral-700" />
				<div className="h-6 w-5/12 self-end rounded-full bg-slate-300 dark:bg-neutral-700" />
				<div className="h-6 rounded-full bg-slate-300 dark:bg-neutral-700" />
				<div className="h-6 rounded-full bg-slate-300 dark:bg-neutral-700" />
				<div className="h-6 rounded-full bg-slate-300 dark:bg-neutral-700" />
				<div className="h-6 w-4/12 self-start rounded-full bg-slate-300 dark:bg-neutral-700" />
			</div>
		</div>
	);
}
