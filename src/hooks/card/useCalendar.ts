import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dateToStr } from "../../utility/dateConversion";
import { useProtectedFetch } from "../utility/useProtectedFetch";
import { Calendar, emptyCalendar } from "../../types";

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

const d = new Date();

export function useCalendar(filterKind?: string, filterId?: string) {
	const navigate = useNavigate();
	const { protectedFetch } = useProtectedFetch();
	const [calendar, setCalendar] = useState<Calendar>(emptyCalendar);
	const [isHidden, setHidden] = useState(false);

	const url =
		filterKind && filterId
			? `/api/ticket/calendar/${filterKind}/${filterId}`
			: `/api/ticket/calendar`;

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

	const displayDatesFormat = useCallback(
		(
			dates: Date[],
			currentMonth: number,
			dueDates?: { [key: string]: number }
		) => {
			const stylesArr = dates.map((date) => {
				switch (true) {
					case isEqualDates(date, d):
						return "bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-500";
					case !isCurrentViewMonth(date, currentMonth):
						return "dark:text-zinc-500 text-zinc-400";
					default:
						return "";
				}
			});

			const joined: { date: Date; styles: string; dueCount: number }[] =
				[];
			for (let i = 0; i < dates.length; i++) {
				if (!dueDates) {
					joined.push({
						date: dates[i],
						styles: stylesArr[i],
						dueCount: 0,
					});
					continue;
				}

				const dt = dateToStr(dates[i]);
				const dueCount = dueDates[dt];
				joined.push({ date: dates[i], styles: stylesArr[i], dueCount });
			}

			return joined;
		},
		[isCurrentViewMonth, isEqualDates]
	);

	const initViewDates = useMemo(() => {
		const dates = getNewDatesOfMonths(d.getFullYear(), d.getMonth());
		const viewDates = monthDisplayFormat(dates);
		const strViewDates = viewDates.map((dt) => dateToStr(dt));
		return { dates, viewDates, strViewDates };
	}, [getNewDatesOfMonths, monthDisplayFormat]);

	useEffect(() => {
		const abortController = new AbortController();

		async function getInitCalendar() {
			const { dates, viewDates, strViewDates } = initViewDates;

			const res = await protectedFetch(url, {
				method: "POST",
				body: JSON.stringify(strViewDates),
				signal: abortController.signal,
			});

			const partialInit = {
				currentTime: d,
				currentView: {
					year: d.getFullYear(),
					month: monthLookup[d.getMonth()],
					monthIndex: d.getMonth(),
				},
				dates,
				displayDates: [],
			};

			if (res.ok) {
				const initDueDates = await res.json();

				const displayDates = displayDatesFormat(
					viewDates,
					d.getMonth(),
					initDueDates
				);

				setCalendar({
					...partialInit,
					displayDates,
				});
			} else {
				setCalendar(partialInit);
			}
		}
		getInitCalendar();

		return () => abortController.abort();
	}, [displayDatesFormat, initViewDates, protectedFetch, url]);

	const initCalendar = useCallback(async () => {
		const { dates, viewDates, strViewDates } = initViewDates;

		const res = await protectedFetch(url, {
			method: "POST",
			body: JSON.stringify(strViewDates),
		});

		const partialInit = {
			currentTime: d,
			currentView: {
				year: d.getFullYear(),
				month: monthLookup[d.getMonth()],
				monthIndex: d.getMonth(),
			},
			dates,
			displayDates: [],
		};

		if (!res.ok) return partialInit;

		const initDueDates = await res.json();

		const displayDates = displayDatesFormat(
			viewDates,
			d.getMonth(),
			initDueDates
		);

		return {
			...partialInit,
			displayDates,
		};
	}, [displayDatesFormat, initViewDates, protectedFetch, url]);

	// EXPOSED FUNCTIONS

	const dayLookup = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

	const handleMonthChange = useCallback(
		async (direction: 1 | -1) => {
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
			const viewDates = monthDisplayFormat(newDates);
			const strViewDates = viewDates.map((dt) => dateToStr(dt));

			const res = await protectedFetch(url, {
				method: "POST",
				body: JSON.stringify(strViewDates),
			});
			if (res.ok) {
				const dueDates = await res.json();
				const newDislayDates = displayDatesFormat(
					viewDates,
					newMonthIndex.month,
					dueDates
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
			}
		},
		[
			calendar.currentView.month,
			calendar.currentView.year,
			getNewDatesOfMonths,
			monthDisplayFormat,
			protectedFetch,
			displayDatesFormat,
			url,
		]
	);

	const handleCalendarReset = useCallback(async () => {
		const resetCalendar = await initCalendar();
		setCalendar(resetCalendar);
	}, [initCalendar]);

	const handleDateClick = useCallback(
		(date: Date) => {
			const formattedDate = dateToStr(date);
			navigate(`/search/${formattedDate}`);
		},
		[navigate]
	);

	const handleHideToggle = useCallback(() => {
		setHidden((prev) => !prev);
	}, []);

	return {
		url,
		handlers: {
			handleMonthChange,
			handleCalendarReset,
			handleDateClick,
			handleHideToggle,
		},
		utility: { dayLookup },
		state: { calendar, isHidden },
	};
}
