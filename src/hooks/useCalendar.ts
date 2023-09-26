import { useState, useCallback, useMemo } from "react";

const monthLookup = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

const dayLookup = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

const d = new Date();

export function useCalendar() {
	const initView = useMemo(
		() => ({
			year: d.getFullYear(),
			month: monthLookup[d.getMonth()],
			date: d.getDate(),
			day: dayLookup[d.getDay()],
		}),
		[]
	);

	const [view, setView] = useState(initView);

	const getDatesOfMonth = useCallback((month: number, year: number) => {
		const date = new Date(Date.UTC(year, month, 1));
		const days = [];
		while (date.getUTCMonth() === month) {
			days.push(new Date(date));
			date.setUTCDate(date.getUTCDate() + 1);
		}
		return days;
	}, []);

	const handleMonthChange = useCallback(
		(direction: 1 | -1) => {
			const monthIndex = monthLookup.indexOf(view.month);
			const getNewIndex = () => {
				const rawIndex = monthIndex + direction;
				if (rawIndex <= -1) {
					setView((prev) => ({ ...prev, year: prev.year - 1 }));
					return 11;
				} else if (rawIndex >= 12) {
					setView((prev) => ({ ...prev, year: prev.year + 1 }));
					return 0;
				} else {
					return rawIndex;
				}
			};

			const newMonthIndex = getNewIndex();
			const newMonth = monthLookup[newMonthIndex];

			setView((prev) => ({ ...prev, month: newMonth }));
		},
		[view]
	);

	const handleCalendarReset = useCallback(() => {
		setView(initView);
	}, [initView]);

	return {
		handlers: {
			handleMonthChange,
			handleCalendarReset,
		},
		state: { view },
	};
}
