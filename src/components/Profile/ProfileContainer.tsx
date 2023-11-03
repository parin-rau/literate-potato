import { useProfile } from "../../hooks/card/useProfile";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../Nav/Loading";

export default function ProfileContainer() {
	const { profile, isLoading, isCurrentUser } = useProfile();

	return (
		<div className="container mt-20 mx-auto">
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className="flex flex-col gap-2 ">
					<h1 className="px-4 font-bold text-4xl">Profile</h1>
					<div className="flex flex-col gap-2 rounded-lg p-2 border-2 border-black dark:border-zinc-600">
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
				</div>
			)}
		</div>
	);
}
