import { CalendarViewReset, CalendarMonthButton } from "./CalendarButtons";

type Props = {
	handleMonthChange: (_d: 1 | -1) => void;
	handleCalendarReset: () => void;
	view: { year: number; month: string; monthIndex: number };
	headerText: string;
};

export default function CalendarHeader(props: Props) {
	const { handleMonthChange, handleCalendarReset, view, headerText } = props;

	return (
		<div className="mx-6 p-6 flex flex-row justify-between">
			<div className="flex flex-row gap-4 items-baseline">
				<h2 className="font-semibold text-2xl">{`${view.month} ${view.year}`}</h2>
				<h3 className="text-lg">{headerText}</h3>
			</div>
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
