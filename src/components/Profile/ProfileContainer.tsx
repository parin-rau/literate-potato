import { useProfile } from "../../hooks/card/useProfile";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../Nav/Loading";
//import { useAuth } from "../../hooks/auth/useAuth";

export default function ProfileContainer() {
	// const { user } = useAuth();
	// const { id } = useParams();
	// const userId = pathname.slice(6);
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	user.current?.userId === userId ? navigate("/user") : null;
	// }, [user, navigate, userId]);

	const { profile, isLoading, isCurrentUser } = useProfile();

	return (
		<div className="container mt-20 mx-auto">
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className="flex flex-col gap-2 rounded-lg p-2 border-2 border-black dark:border-neutral-600">
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
					{isCurrentUser && (
						<Link
							className="p-2 w-fit rounded-md bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
							to={"/settings"}
						>
							Edit Profile
						</Link>
					)}
				</div>
			)}
		</div>
	);
}
