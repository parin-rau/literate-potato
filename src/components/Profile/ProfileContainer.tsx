import { useState } from "react";
import { useProfile } from "../../hooks/card/useProfile";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../Nav/Loading";
import timestampDisplay from "../../utility/timestampDisplay";
import MemberContainer from "../Group/MemberContainer";
import CollapseToggle from "../Nav/CollapseToggle";

export default function ProfileContainer() {
	const { profile, isLoading, isCurrentUser } = useProfile();
	const [showGroups, setShowGroups] = useState(false);

	return (
		<div className="container mt-20 mx-auto">
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<div className="flex flex-col gap-6 ">
					<h1 className="px-4 font-bold text-4xl">Profile</h1>
					<div className="flex flex-col gap-4 rounded-lg p-2 border-2 border-black dark:border-zinc-600">
						<ul className="flex flex-col gap-1">
							<li>
								<h1 className="font-semibold text-2xl">
									{profile.username}
								</h1>
							</li>
							<li>{`Account created ${timestampDisplay(
								profile.timestamp
							)}`}</li>
							<li>
								<Link
									className="hover:underline"
									to={`/search/${profile.userId}/ticket`}
								>{`Tasks completed: ${profile.ticketIds.completed.length}`}</Link>
							</li>
							<li>
								<Link
									className="hover:underline"
									to={`/search/${profile.userId}/ticket`}
								>{`Subtasks completed: ${profile.subtaskIds.completed.length}`}</Link>
							</li>
							<li>
								<CollapseToggle
									isOpen={showGroups}
									setOpen={setShowGroups}
									text={`Group Membership (${profile.groupIds.length})`}
								/>
								{showGroups && profile.groupIds.length > 0 && (
									<MemberContainer
										userId={profile.userId}
										dataKind="GROUP"
									/>
								)}
							</li>
						</ul>
						{isCurrentUser && (
							<Link
								className="p-2 w-fit rounded-md bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600"
								to={"/settings"}
							>
								Edit Account
							</Link>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
