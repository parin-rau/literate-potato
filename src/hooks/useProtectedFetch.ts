import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export function useProtectedFetch<T>(
	endpoint: RequestInfo | URL,
	customOptions?: RequestInit,
	setter?: React.Dispatch<React.SetStateAction<T>>
): Response | void {
	const { user, refreshAccessToken, signOut } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (!user) {
					return navigate("/login");
				}

				const accessToken = user.token;
				const defaultOptions: RequestInit = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: "include",
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
							if (!setter) return retryRes;

							const data = await retryRes.json();
							return setter(data);
						}
					}
					return signOut();
				}

				if (res.ok) {
					if (!setter) return res;

					const data = await res.json();
					return setter(data);
				}
			} catch (e) {
				console.error(e);
			}
		};
		fetchData();
	}, [
		customOptions,
		endpoint,
		navigate,
		refreshAccessToken,
		user,
		signOut,
		setter,
	]);
}
