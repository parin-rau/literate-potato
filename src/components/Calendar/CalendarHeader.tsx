import { CalendarViewReset, CalendarMonthButton } from "./CalendarButtons";

type Props = {
	handleMonthChange: (_d: 1 | -1) => void;
	handleCalendarReset: () => void;
	view: { year: number; month: string; monthIndex: number };
};

export default function CalendarHeader(props: Props) {
	const { handleMonthChange, handleCalendarReset, view } = props;

	return (
		<div className="mx-6 p-6 flex flex-row justify-between">
			<h2 className="font-semibold text-2xl">{`${view.month} ${view.year}`}</h2>
			<div className="flex flex-row gap-2">
				<CalendarViewReset {...{ handleCalendarReset }} />
				<CalendarMonthButton
					direction={-1}
					{...{ handleMonthChange }}
				/>
				<CalendarMonthButton direction={1} {...{ handleMonthChange }} />
			</div>
		</div>
	);
}