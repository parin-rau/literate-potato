export function arraysDiffs(arr1: unknown[], arr2: unknown[]) {
	const difference = arr1
		.filter((x) => !arr2.includes(x))
		.concat(arr2.filter((x) => !arr1.includes(x)));

	return difference;
}

export function arraysEqual(arr1: unknown[], arr2: unknown[]) {
	if (typeof arr1 !== typeof arr2 || arr1.length !== arr2.length) {
		return false;
	} else {
		const [sortArr1, sortArr2] = [arr1.sort(), arr2.sort()];
		for (let i = 0; i < arr1.length; i++) {
			if (sortArr1[i] !== sortArr2[i]) {
				return false;
			} else {
				continue;
			}
		}
		return true;
	}
}

export function arrayExclude(sourceArr: string[], filterArr: string[]) {
	if (typeof sourceArr !== typeof filterArr) {
		return;
	} else {
		const returnArr: string[] = [];
		for (let i = 0; i < sourceArr.length; i++) {
			if (!filterArr.includes(sourceArr[i])) {
				returnArr.push(sourceArr[i]);
			}
		}
		return returnArr;
	}
}

export const countPerElement = <T extends string | number | symbol>(
	arr: T[]
) => {
	const counts = arr.reduce(
		(a, c) => ((a[c] = (a[c] || 0) + 1), a),
		<Record<T, number>>{}
	);

	return counts;
};
