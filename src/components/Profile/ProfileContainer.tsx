import { useProfile } from "../../hooks/card/useProfile";
import { Link, useParams } from "react-router-dom";
import { LoadingSpinner } from "../Nav/Loading";
import { useAuth } from "../../hooks/auth/useAuth";

export default function ProfileContainer() {
	const { user } = useAuth();
	const { id } = useParams();
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
					<ul>
						<li>
							<h1 className="font-semibold text-xl">
								{profile.username}
							</h1>
						</li>
						<li>{`Account age: ${profile.timestamp}`}</li>
						<li>
							<Link
								className="underline"
								to={`/user/${profile.userId}/ticket`}
							>{`Tasks completed: ${profile.ticketIds.completed.length}/${profile.ticketIds.total.length}`}</Link>
						</li>
						<li>
							<Link
								className="underline"
								to={`/user/${profile.userId}/ticket`}
							>{`Subtasks completed: ${profile.subtaskIds.completed.length}/${profile.subtaskIds.total.length}`}</Link>
						</li>
						<li>
							<ul>
								Group membership:
								{profile.groupIds.map((g) => (
									<li>{g}</li>
								))}
							</ul>
						</li>
					</ul>
				</div>
			)}
		</div>
	);
}
