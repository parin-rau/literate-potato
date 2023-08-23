export function firstLetterCap(string: string): string {
	const lowercaseArr = string.toLocaleLowerCase().split(/[- ]/);
	const firstUpperArr = lowercaseArr.map((word) => {
		const firstLetter = noCap.includes(word)
			? word.charAt(0)
			: word.charAt(0).toLocaleUpperCase();
		const remainderLetters = word.slice(1);
		const wordFirstUpper = firstLetter + remainderLetters;
		return wordFirstUpper;
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
	"to",
	"upon",
	"when",
	"with",
	"yet",
];
