type Props = {
	view: { year: number; month: string; day: string; date: number };
};

export default function CalendarGrid(props: Props) {
	const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

	const dates = [];
	for (let i = 1; i <= 35; i++) {
		dates.push(i);
	}

	return (
		<div className="grid grid-cols-7 grid-rows-7 place-items-center gap-2 p-6">
			{days.map((day, idx) => (
				<div key={idx} className="font-semibold">
					{day}
				</div>
			))}
			{dates.map((date, idx) => (
				<div
					key={idx}
					className={
						"" + (date === props.view.date ? "bg-red-500" : "")
					}
				>
					{date}
				</div>
			))}
		</div>
	);
}
