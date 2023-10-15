import { useParams } from "react-router-dom";
import { useInitialFetch } from "../utility/useInitialFetch";
import { User } from "../../types";
import { useAuth } from "../utility/useAuth";

export function useProfile() {
	const { user } = useAuth();
	const { id } = useParams();
	const endpoint = id ?? user.current!.userId;

	const { data: profile, isLoading } = useInitialFetch<User>(
		`/api/user/${endpoint}`
	);

	return { profile, isLoading };
}
