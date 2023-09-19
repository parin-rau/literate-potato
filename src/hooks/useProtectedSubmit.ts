import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";

export function useProtectedSubmit(
	endpoint: RequestInfo | URL,
	customOptions?: RequestInit
) {
	const [isLoading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | unknown | null>(null);
	const [ok, setOk] = useState<boolean | null>(null);
	const { user, refreshAccessToken, signOut } = useAuth();

	const executeSubmit = useCallback(async () => {
		try {
			setLoading(true);

			const defaultOptions: RequestInit = {};
			const options = {
				...defaultOptions,
				...customOptions,
			};

			const res = await fetch(endpoint, options);

			if (!res.ok) {
				if ([400, 401, 403].some((n) => res.status === n)) {
					await refreshAccessToken();

					if (user) {
						const retryRes = await fetch(endpoint, options);

						if (retryRes.ok) {
							// const jsonData = await retryRes.json();
							// setterHelper
							// 	? setData(setterHelper(jsonData))
							// 	: setData(jsonData);
							setOk(true);
							return setLoading(false);
						}
					}
				}
				setError("Failed to refresh access token");
				setOk(false);
				return await signOut();
			}
			setOk(true);
			return setLoading(false);
		} catch (e) {
			setError(e);
			setOk(false);
			console.error(e);
		}
	}, [endpoint, customOptions, user, refreshAccessToken, signOut]);

	// function handleFetch(
	// 	endpoint: RequestInfo | URL,
	// 	customOptions?: RequestInit
	// ) {
	// 	if (!fetchOk) {
	// 		setLoading(false);
	// 		setError("Failed to create resource");
	// 		setSubmitOk(false);
	// 	}

	// 	setError(null);
	// 	setSubmitOk(true);
	// }

	// setSubmitOk(true);

	return { ok, error, isLoading, executeSubmit };
}
