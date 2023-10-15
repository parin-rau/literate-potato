import { useLayoutEffect, useRef, useCallback } from "react";

export function useGetter<S>(value: S): () => S {
	const ref = useRef(value);
	useLayoutEffect(() => {
		ref.current = value;
	});
	return useCallback(() => ref.current, [ref]);
}
