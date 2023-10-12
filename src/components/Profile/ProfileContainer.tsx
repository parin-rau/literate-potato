import { useProfile } from "../../hooks/useProfile";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../Nav/Loading";
import { useAuth } from "../../hooks/useAuth";
import { useEffect } from "react";

export default function ProfileContainer() {
	const { user } = useAuth();
	const { pathname } = useLocation();
	// const userId = pathname.slice(6);
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	user.current?.userId === userId ? navigate("/user") : null;
	// }, [user, navigate, userId]);

	const { profile, isLoading } = useProfile();

	return (
		<div className="container mt-16 mx-auto">
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className="rounded-lg p-2 border-2 border-black dark:border-neutral-600">
					<h1>Profile</h1>
					<p>{pathname}</p>
					<p></p>
					<p>{user.current?.userId}</p>
					<p>{profile.username}</p>
					<p>{profile.password}</p>
					<ul>
						Group membership:
						{profile.groupIds.map((g) => (
							<li>{g}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
