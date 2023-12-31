import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/auth/useAuth";
import { LoadingSpinner } from "../Nav/Loading";

export default function PersistLogin({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, refreshAccessToken } = useAuth();
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		const persistLogin = async () => {
			await refreshAccessToken();
			setLoading(false);
		};

		!user?.current?.token ? persistLogin() : setLoading(false);
	}, [refreshAccessToken, user]);

	return <>{isLoading ? <LoadingSpinner /> : children}</>;
}
