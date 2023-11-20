import { allLowerCase } from "./charCaseFunctions";

type Value = string | number | { [key: string]: string | number };
type Sortable = Record<string, Value> | string | number;

export function sortByKey<T extends Sortable>(
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

		const sorted = [...arr].sort((a: Sortable, b: Sortable) => {
			let i = 0;

			while (i < keys.length) {
				a = typeof a !== "object" ? a : a[keys[i]];
				b = typeof b !== "object" ? b : b[keys[i]];
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
}
