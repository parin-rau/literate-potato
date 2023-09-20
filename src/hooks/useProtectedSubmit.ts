import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export function useProtectedSubmit() {
	// endpoint: RequestInfo | URL,
	// customOptions?: RequestInit
	const [isLoading, setLoading] = useState<boolean | null>(null);
	const [error, setError] = useState<string | unknown | null>(null);
	const [ok, setOk] = useState<boolean | null>(null);
	const { user, refreshAccessToken, signOut } = useAuth();
	const navigate = useNavigate();

	const executeSubmit = useCallback(
		async (
			endpoint: RequestInfo | URL,
			customOptions?: RequestInit
		): Promise<{ res: Response }> => {
			try {
				setLoading(true);

				if (!user) {
					setOk(false);
					setError("Logged in user not detected");
					setLoading(false);
					navigate("/login");
					return {
						res: new Response(undefined, {
							status: 401,
							statusText: "Logged in user not detected",
						}),
					};
				}

				const accessToken = user.token;
				const defaultOptions: RequestInit = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: "include",
					// signal: abortController.signal,
				};
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
								console.log("second attempt ok");
								setOk(true);
								setLoading(false);
								return { res: retryRes };
							}
						}
					}
					console.log("failed to refresh token");
					setError("Failed to refresh access token");
					setOk(false);
					await signOut();
					return { res };
				}
				console.log("first attempt ok");
				setOk(true);
				setLoading(false);
				return { res };
			} catch (e) {
				console.log("caught error");
				setError(e);
				setOk(false);
				console.error(e);
				return {
					res: new Response(undefined, {
						status: 500,
						statusText: "Internal server error",
					}),
				};
			}
		},
		[user, refreshAccessToken, signOut, navigate]
	);

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
