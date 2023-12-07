import { useEffect, useState } from "react";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";
import { statusCodeLookup } from "../../utility/statusCodeMsg";

export function useInitialFetch<T, D = void>(
	endpoint: RequestInfo | URL,
	customOptions?: RequestInit,
	setterHelper?: (_arg: D) => T,
	defaultData?: T
) {
	type JsonData = D extends void ? T : D;

	const { user, refreshAccessToken, signOut } = useAuth();
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState<boolean>(true);
	const [data, setData] = useState<T | null>(null);
	const [error, setError] = useState<string | unknown | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [ok, setOk] = useState<boolean | null>(null);

	useEffect(() => {
		const abortController = new AbortController();
		const retryAbortController = new AbortController();

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
						const retryOptions: RequestInit = {
							...initOptions,
							headers: {
								...initOptions.headers,
								Authorization: `Bearer ${retryAccessToken}`,
							},
							signal: retryAbortController.signal,
						};

						if (user.current) {
							const retryRes = await fetch(
								endpoint,
								retryOptions
							);

							if (retryRes.ok) {
								const jsonData: JsonData =
									await retryRes.json();
								setterHelper
									? setData(setterHelper(jsonData as D))
									: setData(jsonData as T);
								setOk(true);

								if (
									Object.hasOwn(statusCodeLookup, res.status)
								) {
									setMessage(statusCodeLookup[res.status]);
								}
								return setLoading(false);
							}
						}
					}
					setError("Failed to refresh access token");
					setOk(false);
					return await signOut();
				}

				const jsonData: JsonData = await res.json();
				setterHelper
					? setData(setterHelper(jsonData as D))
					: setData(jsonData as T);
				setOk(true);

				if (Object.hasOwn(statusCodeLookup, res.status)) {
					setMessage(statusCodeLookup[res.status]);
				}

				return setLoading(false);
			} catch (e) {
				setError(e);
				setOk(false);
				console.error(e);
			}
		};

		function ignoreFetch(fallbackData: T) {
			setData(fallbackData);
			setOk(true);
			setLoading(false);
		}

		const ignoreUrls = ["/api/project/uncategorized"];

		ignoreUrls.some((u) => endpoint === u)
			? defaultData && ignoreFetch(defaultData)
			: fetchData();

		return () => {
			abortController.abort();
			retryAbortController.abort();
		};
	}, [
		customOptions,
		endpoint,
		navigate,
		refreshAccessToken,
		user,
		signOut,
		setterHelper,
		defaultData,
	]);

	return { data, setData, isLoading, ok, error, message } as {
		data: T;
		setData: React.Dispatch<React.SetStateAction<T>>;
		isLoading: boolean;
		ok: boolean;
		error: unknown;
		message: string | null;
	};
}
