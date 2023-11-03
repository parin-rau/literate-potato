import { Link } from "react-router-dom";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { User } from "../../types";

interface Props {
	groupId: string;
}

export default function MemberContainer({ groupId }: Props) {
	const { data: members, isLoading } = useInitialFetch<User[]>(
		`/api/user/group/${groupId}`
	);

	return (
		!isLoading && (
			<ul className="flex flex-col gap-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-neutral-800">
				{members.map((m) => (
					<li className="flex flex-row gap-2">
						&bull;
						<Link
							className="hover:underline"
							to={`/user/${m.userId}`}
						>{`${m.username} ${
							m.managedGroupIds.includes(groupId)
								? `(Manager)`
								: ""
						}`}</Link>
					</li>
				))}
			</ul>
		)
	);
}
