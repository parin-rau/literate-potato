import { useEffect, useCallback, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LoadingSpinner } from "../Nav/Loading";

export default function PersistLogin({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, refreshAccessToken } = useAuth();
	const [isLoading, setLoading] = useState(false);

	const refresh = useCallback(async () => {
		await refreshAccessToken();
		setLoading(false);
	}, [refreshAccessToken]);

	useEffect(() => {
		setLoading(true);
		const persistLogin = async () => {
			refresh();
		};
		!user?.token ? persistLogin() : setLoading(false);
	}, [user]);

	return <>{isLoading ? <LoadingSpinner /> : children}</>;
}
