import { useCalendar } from "../../hooks/useCalendar";

type Props = {
	calendar: {
		currentTime: Date;
		currentView: { year: number; month: string; monthIndex: number };
		dates: { current: Date[]; next: Date[]; prev: Date[] };
		displayDates: { date: Date; styles: string }[];
	};
};

export default function CalendarGrid(props: Props) {
	const { dayLookup } = useCalendar().utility;
	const { displayDates } = props.calendar;

	return (
		<div className="grid grid-cols-7 place-items-center gap-2 p-6">
			{dayLookup.map((day, idx) => (
				<div key={idx} className="font-semibold">
					{day}
				</div>
			))}
			{displayDates.map((d, idx) => (
				<div key={idx} className={"p-2 rounded-xl " + d.styles}>
					{d.date.getDate()}
				</div>
			))}
		</div>
	);
}
