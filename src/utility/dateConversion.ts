export function dateStrToTime(str: string) {
	const s = str.split("-").map((n) => Number(n));
	const d = new Date(s[0], s[1] - 1, s[2]);
	return d.getTime();
}

export function dateNumToStr(m: number) {
	if (m >= 10) return m.toString();

	const mStr = [0, m].join("");
	return mStr;
}

export function dateToStr(date: Date) {
	const dt = {
		y: date.getFullYear().toString(),
		m: dateNumToStr(date.getMonth() + 1),
		d: dateNumToStr(date.getDate()),
	};

	const formattedDateStr = [dt.y, dt.m, dt.d].join("-");
	return formattedDateStr;
}
