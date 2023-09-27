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

//const d = new Date(2023, 7, 29); // Test for current day highlighting visible across two months
const d = new Date();

export function useCalendar() {
	// LOCAL HELPERS

	// const getDatesOfMonthUTC = useCallback((year: number, month: number) => {
	// 	const date = new Date(Date.UTC(year, month, 1));
	// 	const days = [];
	// 	while (date.getUTCMonth() === month) {
	// 		days.push(new Date(date));
	// 		date.setUTCDate(date.getUTCDate() + 1);
	// 	}
	// 	return days;
	// }, []);

	const getDatesOfMonth = useCallback((year: number, month: number) => {
		const date = new Date(year, month, 1);
		const days = [];
		while (date.getMonth() === month) {
			days.push(new Date(date));
			date.setDate(date.getDate() + 1);
		}
		return days;
	}, []);

	const dateRollover = useCallback((year: number, month: number) => {
		const dateObj = { year, month };

		if (month >= 12) {
			dateObj.year = year + 1;
			dateObj.month = 0;
		} else if (month <= -1) {
			dateObj.year = year - 1;
			dateObj.month = 11;
		}

		return dateObj;
	}, []);

	const getNewDatesOfMonths = useCallback(
		(year: number, month: number) => {
			const nextMonth = dateRollover(year, month + 1);
			const prevMonth = dateRollover(year, month - 1);

			return {
				current: getDatesOfMonth(year, month),
				next: getDatesOfMonth(nextMonth.year, nextMonth.month),
				prev: getDatesOfMonth(prevMonth.year, prevMonth.month),
			};
		},
		[getDatesOfMonth, dateRollover]
	);

	const isEqualDates = useCallback((a: Date, b: Date) => {
		const year = { a: a.getFullYear(), b: b.getFullYear() };
		const month = { a: a.getMonth(), b: b.getMonth() };
		const date = { a: a.getDate(), b: b.getDate() };

		if (year.a === year.b && month.a === month.b && date.a === date.b) {
			return true;
		} else {
			return false;
		}
	}, []);

	const isCurrentViewMonth = useCallback(
		(date: Date, currentMonth: number) => {
			if (date.getMonth() === currentMonth) {
				return true;
			} else {
				return false;
			}
		},
		[]
	);

	const monthDisplayFormat = useCallback(
		(dates: { current: Date[]; next: Date[]; prev: Date[] }) => {
			const prevDisplayDates: Date[] = [];
			const nextDisplayDates: Date[] = [];

			const firstDate = dates.current[0];
			const firstDayIdx = firstDate.getDay();

			const lastDate = dates.current[dates.current.length - 1];
			const lastDayIdx = lastDate.getDay();

			for (let i = 0; i < firstDayIdx; i++) {
				const prevIdx = dates.prev.length - (firstDayIdx - i);
				prevDisplayDates.push(dates.prev[prevIdx]);
			}

			for (let i = 0; i < 6 - lastDayIdx; i++) {
				nextDisplayDates.push(dates.next[i]);
			}

			return [...prevDisplayDates, ...dates.current, ...nextDisplayDates];
		},
		[]
	);

	const dateStyles = useCallback(
		(dates: Date[], currentMonth: number) => {
			const stylesArr = dates.map((date) => {
				switch (true) {
					case isEqualDates(date, d):
						return "dark:bg-red-600 bg-red-400";
					case !isCurrentViewMonth(date, currentMonth):
						return "dark:text-zinc-500 text-zinc-400";
					default:
						return "";
				}
			});

			const joined: { date: Date; styles: string }[] = [];
			for (let i = 0; i < dates.length; i++) {
				joined.push({ date: dates[i], styles: stylesArr[i] });
			}

			return joined;
		},
		[isCurrentViewMonth, isEqualDates]
	);

	const initCalendar = useMemo(() => {
		const dates = {
			current: getDatesOfMonth(d.getFullYear(), d.getMonth()),
			next: getDatesOfMonth(d.getFullYear(), d.getMonth() + 1),
			prev: getDatesOfMonth(d.getFullYear(), d.getMonth() - 1),
		};
		const displayDates = dateStyles(
			monthDisplayFormat(dates),
			d.getMonth()
		);

		return {
			currentTime: d,
			currentView: {
				year: d.getFullYear(),
				month: monthLookup[d.getMonth()],
				monthIndex: d.getMonth(),
			},
			dates,
			displayDates,
		};
	}, [getDatesOfMonth, monthDisplayFormat, dateStyles]);

	// EXPOSED FUNCTIONS

	const dayLookup = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
	const [calendar, setCalendar] = useState(initCalendar);

	const handleMonthChange = useCallback(
		(direction: 1 | -1) => {
			const monthIndex = monthLookup.indexOf(calendar.currentView.month);
			const getNewIndex = () => {
				const rawIndex = monthIndex + direction;
				if (rawIndex <= -1) {
					return { year: calendar.currentView.year - 1, month: 11 };
				} else if (rawIndex >= 12) {
					return { year: calendar.currentView.year + 1, month: 0 };
				} else {
					return { year: calendar.currentView.year, month: rawIndex };
				}
			};

			const newMonthIndex = getNewIndex();
			const newMonth = monthLookup[newMonthIndex.month];
			const newDates = getNewDatesOfMonths(
				newMonthIndex.year,
				newMonthIndex.month
			);
			const newDislayDates = dateStyles(
				monthDisplayFormat(newDates),
				newMonthIndex.month
			);

			setCalendar((prev) => ({
				...prev,
				currentTime: new Date(),
				currentView: {
					year: newMonthIndex.year,
					month: newMonth,
					monthIndex: newMonthIndex.month,
				},
				dates: newDates,
				displayDates: newDislayDates,
			}));
		},
		[
			calendar.currentView.month,
			calendar.currentView.year,
			getNewDatesOfMonths,
			monthDisplayFormat,
			dateStyles,
		]
	);

	const handleCalendarReset = useCallback(() => {
		setCalendar(initCalendar);
	}, [initCalendar]);

	return {
		handlers: {
			handleMonthChange,
			handleCalendarReset,
		},
		utility: { dayLookup },
		state: { calendar },
	};
}
