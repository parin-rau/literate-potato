import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

// type Return = {
// 	data: | null;
// 	isLoading: boolean;
// };

export function useProtectedFetch<T, D = void>(
	endpoint: RequestInfo | URL,
	customOptions?: RequestInit,
	// setter?: React.Dispatch<React.SetStateAction<T>>,
	setterHelper?: (_arg: D) => T
) {
	const { user, refreshAccessToken, signOut } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState<boolean>(true);
	//const [response, setResponse] = useState<Response | null>(null);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | unknown | null>(null);
	const [ok, setOk] = useState<boolean | null>(null);

	useEffect(() => {
		const abortController = new AbortController();

		const fetchData = async () => {
			try {
				if (!user) {
					setOk(false);
					setError("Logged in user not detected");
					return navigate("/login");
				}

				const accessToken = user.token;
				const defaultOptions: RequestInit = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: "include",
					signal: abortController.signal,
				};
				const options: RequestInit = {
					...customOptions,
					...defaultOptions,
				};

				const res = await fetch(endpoint, options);

				if (!res.ok) {
					if ([400, 401, 403].some((n) => res.status === n)) {
						await refreshAccessToken();

						if (user) {
							const retryRes = await fetch(endpoint, options);
							// if (setter) {
							// 	const data = await retryRes.json();
							// 	setterHelper
							// 		? setter(setterHelper(data))
							// 		: setter(data);
							// }
							// setResponse(retryRes);
							// return setLoading(false);

							if (retryRes.ok) {
								const jsonData = await retryRes.json();
								setterHelper
									? setData(setterHelper(jsonData))
									: setData(jsonData);
								setOk(true);
								return setLoading(false);
							}
						}
					}
					setError("Failed to refresh access token");
					setOk(false);
					return await signOut();
				}

				// if (setter) {
				// 	const data = await res.json();
				// 	setterHelper
				// 		? setter(setterHelper(data))
				// 		: setter(data);
				// }
				// setResponse(res);
				// return setLoading(false);
				const jsonData = await res.json();
				setterHelper
					? setData(setterHelper(jsonData))
					: setData(jsonData);
				setOk(true);
				return setLoading(false);
			} catch (e) {
				setError(e);
				setOk(false);
				console.error(e);
			}
		};
		fetchData();
		return () => {
			abortController.abort();
		};
	}, [
		customOptions,
		endpoint,
		navigate,
		refreshAccessToken,
		user,
		signOut,
		setterHelper,
	]);

	return { data, setData, isLoading, ok, error } as {
		data: T;
		setData: React.Dispatch<React.SetStateAction<T>>;
		isLoading: boolean;
		ok: boolean;
		error: unknown;
	};
}
