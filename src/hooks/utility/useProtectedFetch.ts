import { useCallback, useState } from "react";
import { useAuth } from "../auth/useAuth";

export function useProtectedFetch() {
	const [isLoading, setLoading] = useState<boolean | null>(null);
	const [error, setError] = useState<string | unknown | null>(null);
	const [ok, setOk] = useState<boolean | null>(null);
	const { user, refreshAccessToken, signOut } = useAuth();

	const protectedFetch = useCallback(
		async (
			endpoint: RequestInfo | URL,
			customOptions?: RequestInit
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
					...customOptions,
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
								// setError("Failed to refresh access token");
								// setOk(false);
								// await signOut();
								// return res;
								setOk(true);
								setLoading(false);
								return retryRes;
							}
						}
					}

					setError("Expired refresh token");
					setOk(false);
					await signOut();
					return res;
				}

				setOk(true);
				setLoading(false);
				return res;
			} catch (e) {
				setError(e);
				setOk(false);
				console.error(e);
				return new Response(undefined, {
					status: 500,
					statusText: "Internal server error",
				});
			}
		},
		[user, refreshAccessToken, signOut]
	);

	return { ok, error, isLoading, protectedFetch };
}
