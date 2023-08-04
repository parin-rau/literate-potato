export default function countDisplay(num: number) {
	let displayNum: string;

	if (num < 1e3) {
		displayNum = num.toString();
	} else if (num < 1e5) {
		displayNum = (Math.floor((num * 10) / 1e3) / 10).toString() + "k";
	} else if (num < 1e6) {
		displayNum = Math.floor(num / 1e3).toString() + "k";
	} else if (num < 1e9) {
		displayNum = Math.floor(num / 1e6).toString() + "M";
	} else {
		displayNum = Math.floor(num / 1e9).toString() + "B";
	}

	return displayNum;
}
