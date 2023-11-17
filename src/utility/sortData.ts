import { allLowerCase } from "./charCaseFunctions";

type Value = string | number | { [key: string]: string | number };
type Sortable = Record<string, Value> | string | number;

//type ValObj = Record<string, Value>;
// type Intermediate = {
// 	a: Value;
// 	b: Value;
// };

// class Obj implements ValObj {
// 	constructor(values: string[]) {
// 		values.forEach((v) => (this.v = v));
// 	}
// }

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

			// const getProp = (object: Obj, prop: string) => {
			// 	return prop.split(".").reduce((o, i) => o[i], object);
			// };

			// const getVal = (obj: Obj, prop: string) => {
			// 	let result: string | number | null = null;
			// 	JSON.stringify(obj, (key, val) => {
			// 		if (key === prop) result = val;
			// 	});
			// 	return result;
			// };

			// const notObj = (obj: T,) => {
			// 	return (
			// 		(typeof obj === "string" || typeof obj === "number")
			// 	)
			// }

			//if (typeof a !== "object" || typeof b !== "object") return 0;

			while (
				i < keys.length
				// 	&& (
				// 	(typeof a !== "string" && typeof a !== "number") ||
				// 	(typeof b !== "string" && typeof b !== "number")
				// )
			) {
				a = typeof a !== "object" ? a : a[keys[i]];
				b = typeof b !== "object" ? b : b[keys[i]];
				i++;
			}

			// const a = getVal(a, key);
			// const b = getVal(b, key);

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
