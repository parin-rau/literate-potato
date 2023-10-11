import { useCalendar } from "../../hooks/useCalendar";
import { Calendar } from "../../types";
import CornerNotification from "../Display/CornerNotification";

type Props = {
	calendar: Calendar;
	handleDateClick: (_d: Date) => void;
};

export default function CalendarGrid(props: Props) {
	const { utility } = useCalendar();
	const { dayLookup } = utility;
	const { calendar, handleDateClick } = props;

	return (
		<div className="grid grid-cols-7 place-items-center gap-2 p-6">
			{dayLookup.map((day, idx) => (
				<div key={idx} className="font-semibold">
					{day}
				</div>
			))}
			{calendar.displayDates.map((d, idx) => (
				<button
					key={idx}
					className={
						"relative w-10 h-10 rounded-xl sm:text-lg hover:bg-slate-300 dark:hover:bg-neutral-700 " +
						d.styles
					}
					type="button"
					onClick={() => handleDateClick(d.date)}
				>
					{d.date.getDate()}
					{d.dueCount && <CornerNotification count={d.dueCount} />}
				</button>
			))}
		</div>
	);
}
