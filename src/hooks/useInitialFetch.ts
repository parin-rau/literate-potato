import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export function useInitialFetch<T, D = void>(
	endpoint: RequestInfo | URL,
	customOptions?: RequestInit,
	setterHelper?: (_arg: D) => T
) {
	const { user, refreshAccessToken, signOut } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState<boolean>(true);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | unknown | null>(null);
	const [ok, setOk] = useState<boolean | null>(null);

	useEffect(() => {
		const abortController = new AbortController();

		const fetchData = async () => {
			try {
				if (!user.current) {
					setOk(false);
					setError("Logged in user not detected");
					return navigate("/login");
				}

				const accessToken = user.current.token;
				const defaultOptions: RequestInit = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: "include",
					signal: abortController.signal,
				};
				const initOptions: RequestInit = {
					...customOptions,
					...defaultOptions,
				};

				const res = await fetch(endpoint, initOptions);

				if (!res.ok) {
					if ([400, 401, 403].some((n) => res.status === n)) {
						await refreshAccessToken();

						const retryAccessToken = user.current.token;
						const retryOptions = {
							...initOptions,
							headers: {
								...initOptions.headers,
								Authorization: `Bearer ${retryAccessToken}`,
							},
						};

						if (user.current) {
							const retryRes = await fetch(
								endpoint,
								retryOptions
							);

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
