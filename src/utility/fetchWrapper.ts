export async function fetchProtected(
	endpoint: RequestInfo | URL,
	options?: RequestInit
) {
	try {
		const res = await fetch(endpoint, options);
		if (!res.ok) {
			const resStatus = await res.json();
			if (resStatus === 401) {
				try {
					const accessToken = sessionStorage.getItem("accessToken");
					const res2 = await fetch("/auth/refresh", {
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${accessToken}`,
						},
						credentials: "include",
					});
					if (res2.ok) {
						const retry = await fetch(endpoint, options);
						return retry;
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
