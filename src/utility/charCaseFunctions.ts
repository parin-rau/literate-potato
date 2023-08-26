export function titleCap(string: string): string {
	const lowercaseArr = string.toLocaleLowerCase().split(/[- ]/);
	const titleCapArr = lowercaseArr.map((word, index) => {
		const firstLetter = noCap.includes(word)
			? index === 0
				? word.charAt(0).toLocaleUpperCase()
				: word.charAt(0)
			: word.charAt(0).toLocaleUpperCase();
		const remainderLetters = word.slice(1);
		const wordTitleCap = firstLetter + remainderLetters;
		return wordTitleCap;
	});
	const words = titleCapArr.join(" ");
	return words;
}

export function firstLetterCap(string: string): string {
	const lowercaseArr = string.toLocaleLowerCase().split(/[- ]/);
	const firstUpperArr = lowercaseArr.map((word, index) => {
		const firstUpperletter =
			index === 0 ? word.charAt(0).toLocaleUpperCase() : word.charAt(0);
		const remainderLetters = word.slice(1);
		const firstWordUpper = firstUpperletter + remainderLetters;
		return firstWordUpper;
	});
	const words = firstUpperArr.join(" ");
	return words;
}

const noCap = [
	"a",
	"an",
	"and",
	"as",
	"at",
	"but",
	"by",
	"down",
	"for",
	"from",
	"if",
	"in",
	"into",
	"like",
	"near",
	"nor",
	"of",
	"off",
	"on",
	"once",
	"onto",
	"or",
	"over",
	"past",
	"so",
	"than",
	"that",
	"the",
	"to",
	"upon",
	"when",
	"with",
	"yet",
];
