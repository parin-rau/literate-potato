type CalendarMonthProps = {
	direction: 1 | -1;
	handleMonthChange: (_d: 1 | -1) => void;
};

type ViewResetProps = {
	handleCalendarReset: () => void;
};

export function CalendarMonthButton(props: CalendarMonthProps) {
	const { direction, handleMonthChange } = props;

	return (
		<>
			<button
				className="p-1 rounded-md  hover:bg-slate-300 dark:hover:bg-neutral-700"
				onClick={() => handleMonthChange(direction)}
				type="button"
			>
				{direction === 1 && (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
						/>
					</svg>
				)}
				{direction === -1 && (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
						/>
					</svg>
				)}
			</button>
		</>
	);
}

export function CalendarViewReset(props: ViewResetProps) {
	return (
		<button
			className="py-1 px-2 rounded-md  hover:bg-white dark:hover:bg-zinc-700"
			onClick={props.handleCalendarReset}
			type="button"
		>
			Current Month
		</button>
	);
}
