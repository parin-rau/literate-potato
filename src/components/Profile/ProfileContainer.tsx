import { useState } from "react";
import { useProfile } from "../../hooks/card/useProfile";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../Nav/Loading";
import timestampDisplay from "../../utility/timestampDisplay";
import MemberContainer from "../Group/MemberContainer";

export default function ProfileContainer() {
	const { profile, isLoading, isCurrentUser } = useProfile();
	const [showGroups, setShowGroups] = useState(false);

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
							<li>{`Account created ${timestampDisplay(
								profile.timestamp
							)}`}</li>
							<li>
								<Link
									className="underline"
									to={`/search/${profile.userId}/ticket`}
								>{`Tasks completed: ${profile.ticketIds.completed.length}/${profile.ticketIds.total.length}`}</Link>
							</li>
							<li>
								<Link
									className="underline"
									to={`/search/${profile.userId}/ticket`}
								>{`Subtasks completed: ${profile.subtaskIds.completed.length}/${profile.subtaskIds.total.length}`}</Link>
							</li>
							<li>
								<button
									className="hover:underline"
									type="button"
									onClick={() =>
										setShowGroups((prev) => !prev)
									}
								>
									{`Group Membership${
										showGroups ? " (hide)" : ""
									}`}
								</button>
								{showGroups && (
									<MemberContainer
										userId={profile.userId}
										dataKind="GROUP"
									/>
								)}
								{/* <ul>
									Group membership:
									{profile.groupIds.map((g) => (
										<li>
											<Link
												className="hover:underline"
												to={`/group/${g}`}
											>
												{g}
											</Link>
										</li>
									))}
								</ul> */}
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
