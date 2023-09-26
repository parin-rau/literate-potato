import { useCalendar } from "../../hooks/useCalendar";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

export default function CalendarContainer() {
	const { handlers, state } = useCalendar();

	const { view } = state;
	const { handleMonthChange, handleCalendarReset } = handlers;

	return (
		<div className="bg-slate-100 dark:bg-neutral-900 rounded-lg">
			<CalendarHeader
				{...{ handleMonthChange, handleCalendarReset, view }}
			/>
			<CalendarGrid {...{ view }} />
		</div>
	);
}
