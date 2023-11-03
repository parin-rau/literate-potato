import { useParams } from "react-router-dom";
import { useInitialFetch } from "../utility/useInitialFetch";
import { User } from "../../types";
import { useAuth } from "../auth/useAuth";
import { usePageTitle } from "../utility/usePageTitle";

export function useProfile() {
	const { user } = useAuth();
	const { id } = useParams();
	const isCurrentUser = !id ? true : false;
	const endpoint = id ?? user.current!.userId;

	const { data: profile, isLoading } = useInitialFetch<User>(
		`/api/user/${endpoint}`
	);

	usePageTitle(
		isLoading ? document.title : id ? profile.username : "Profile"
	);

	return { profile, isLoading, isCurrentUser };
}
