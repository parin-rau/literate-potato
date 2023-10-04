import { useCalendar } from "../../hooks/useCalendar";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";
import ToggleButton from "../Nav/ToggleButton";
import CollapseIcon from "../Svg/CollapseIcon";

type Props = {
	headerText: string;
};

export default function CalendarContainer({ headerText }: Props) {
	const { handlers, state } = useCalendar();

	const { calendar, isHidden } = state;
	const {
		handleMonthChange,
		handleCalendarReset,
		handleDateClick,
		handleHideToggle,
	} = handlers;

	return (
		<div className="bg-slate-100 dark:bg-neutral-900 rounded-lg">
			<ToggleButton className="m-2" onClick={handleHideToggle}>
				<CollapseIcon isCollapsed={isHidden} />
				<h2 className="font-semibold text-2xl">Calendar</h2>
			</ToggleButton>

			{!isHidden && (
				<>
					<hr className="border-slate-300 dark:border-neutral-700 mx-4" />
					<CalendarHeader
						{...{
							handleMonthChange,
							handleCalendarReset,
							view: calendar.currentView,
							headerText,
						}}
					/>
					{calendar.displayDates && (
						<CalendarGrid {...{ calendar, handleDateClick }} />
					)}
				</>
			)}
		</div>
	);
}
