import { useCallback, useState } from "react";
import { useAuth } from "../auth/useAuth";

interface ExtraOptions {
	allow4xx?: boolean;
	readMessage?: boolean;
}

export function useProtectedFetch() {
	const [isLoading, setLoading] = useState<boolean | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);
	const [ok, setOk] = useState<boolean | null>(null);
	const { user, refreshAccessToken, signOut } = useAuth();

	const readMsg = useCallback(
		async (response: Response, isError?: boolean) => {
			const { message: msg }: { message: string } = await response.json();
			if (msg) {
				isError ? setError(msg) : setMessage(msg);
			}
		},
		[]
	);

	const protectedFetch = useCallback(
		async (
			endpoint: RequestInfo | URL,
			fetchOptions?: RequestInit,
			extraOptions?: ExtraOptions
		): Promise<Response> => {
			try {
				setLoading(true);

				if (!user.current) {
					setOk(false);
					setError("Logged in user not detected");
					setLoading(false);
					await signOut();
					return new Response(undefined, {
						status: 401,
						statusText: "Logged in user not detected",
					});
				}

				const initAccessToken = user.current.token;
				const defaultOptions: RequestInit = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${initAccessToken}`,
					},
					credentials: "include",
				};
				const initOptions = {
					...defaultOptions,
					...fetchOptions,
				};

				const res = await fetch(endpoint, initOptions);
				const isErrorResponse = [400, 401, 403].some(
					(n) => res.status === n
				);

				if (!res.ok) {
					if (!extraOptions?.allow4xx && isErrorResponse) {
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
								const clone = retryRes.clone();
								// const { message: resMsg }: { message: string } =
								// 	await retryRes.json();
								// if (resMsg) setMessage(resMsg);
								extraOptions?.readMessage && readMsg(retryRes);

								setOk(true);
								setLoading(false);
								return clone;
							}
						}
					} else if (extraOptions?.allow4xx && isErrorResponse) {
						const clone = res.clone();
						// const { message: resMsg }: { message: string } =
						// 	await res.json();
						// setError(resMsg);
						extraOptions.readMessage && readMsg(res, true);

						setOk(true);
						setLoading(false);
						return clone;
					}

					setError("Expired refresh token");
					setOk(false);
					await signOut();
					return res;
				}

				const clone = res.clone();
				// const { message: resMsg }: { message: string } =
				// 	await res.json();
				// setMessage(resMsg);
				extraOptions?.readMessage && readMsg(res);

				setOk(true);
				setLoading(false);
				return clone;
			} catch (e) {
				setError("Internal server error.");
				setOk(false);
				console.error(e);
				return new Response(undefined, {
					status: 500,
					statusText: "Internal server error",
				});
			}
		},
		[user, readMsg, signOut, refreshAccessToken]
	);

	return {
		ok,
		error,
		setError,
		message,
		setMessage,
		isLoading,
		protectedFetch,
	};
}
