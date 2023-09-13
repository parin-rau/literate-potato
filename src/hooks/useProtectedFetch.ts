import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";

export async function useProtectedFetch(
	endpoint: RequestInfo | URL,
	customOptions?: RequestInit
) {
	const { user, refresh } = useAuth();
	const navigate = useNavigate();

	if (!user) return navigate("/login");

	const accessToken = user.token;
	const defaultOptions: RequestInit = {
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${accessToken}`,
		},
		credentials: "include",
	};
	const options: RequestInit = { ...customOptions, ...defaultOptions };

	try {
		const res = await fetch(endpoint, options);

		if (!res.ok) {
			if (res.status === 401) {
				try {
					const getRefreshedToken = await fetch(
						"/auth/refresh",
						defaultOptions
					);

					if (getRefreshedToken.ok) {
						const retryRes = await fetch(endpoint, options);
						return retryRes;
					}
				} catch (e) {
					console.error(e);
				}
			}
		}

		return res;
	} catch (e) {
		console.error(e);
	}
}
