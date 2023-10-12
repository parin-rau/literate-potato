export function trimObject(
	obj: Record<string | number, unknown>,
	keys: string[]
) {
	keys.forEach((k) => {
		if (k in obj) delete obj[k];
	});

	return obj;
}
