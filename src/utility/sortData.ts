import { allLowerCase } from "./charCaseFunctions";

// interface Resource {
// 	[key: string]: string | number | { [key: string]: string | number };
// }

type Value = string | number | { [key: string]: string | number };

// type Intermediate = {
// 	a: Value;
// 	b: Value;
// };

export function sortByKey<T extends Record<string, Value>>(
	arr: T[],
	key: string,
	direction?: 1 | -1
) {
	const splitKey = key.split(".");
	const isAscending = !direction || direction === 1;

	if (splitKey.length === 0) {
		return [];
	} else {
		const keys = key.split(".");

		const sorted = [...arr].sort((a, b) => {
			let i = 0;

			if (typeof a !== "object" || typeof b !== "object") return 0;

			while (i < keys.length) {
				a = a[keys[i]];
				b = b[keys[i]];
				i++;
			}

			if (
				(typeof a !== "string" && typeof a !== "number") ||
				(typeof b !== "string" && typeof b !== "number")
			)
				return 0;

			if (allLowerCase(a) > allLowerCase(b)) {
				return isAscending ? 1 : -1;
			} else if (allLowerCase(a) < allLowerCase(b)) {
				return isAscending ? -1 : 1;
			} else {
				return 0;
			}
		});
		return sorted;
	}
	// } else {
	// 	const sorted = [...arr].sort((a, b) =>
	// 		allLowerCase(a[key]) > allLowerCase(b[key]) ? 1 : -1
	// 	);
	// 	return sorted;
	// }
}
