import { Link } from "react-router-dom";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { Group, User } from "../../types";
import { useAuth } from "../../hooks/auth/useAuth";

interface GroupCardState {
	groupId: string;
	userId?: never;
	dataKind: "USER";
}

interface UserCardState {
	groupId?: never;
	userId: string;
	dataKind: "GROUP";
}

type Props = GroupCardState | UserCardState;

export default function MemberContainer({ groupId, userId, dataKind }: Props) {
	const { user } = useAuth();

	const resourceUrl = (groupId?: string, userId?: string) => {
		switch (true) {
			case !!groupId && !userId:
				return `/api/user/group/${groupId}`;
			case !!userId && !groupId:
				return `/api/group/user/${userId}`;
			default:
				return `/`;
		}
	};

	const { data, isLoading } = useInitialFetch<Group[] | User[]>(
		resourceUrl(groupId, userId)
	);

	return (
		!isLoading && (
			<ul className="flex flex-col gap-1 px-4 py-2 rounded-lg bg-slate-100 dark:bg-neutral-800">
				{data.map((d) => {
					if (dataKind === "USER") {
						return (
							<li className="flex flex-row gap-2">
								&bull;
								<Link
									className="hover:underline"
									to={`/user/${(d as User).userId}`}
								>{`${(d as User).username} ${
									(d as User).managedGroupIds.includes(
										groupId
									)
										? `(Manager)`
										: ""
								}`}</Link>
							</li>
						);
					} else if (dataKind === "GROUP") {
						const canViewGroup = (d as Group).userIds.includes(
							user.current!.userId
						);
						return (
							<li className="flex flex-row gap-2">
								&bull;
								{canViewGroup ? (
									<Link
										className="hover:underline"
										to={`/group/${(d as Group).groupId}`}
									>{`${(d as Group).title} ${
										(d as Group).manager.userId === userId
											? `(Manager)`
											: ""
									}`}</Link>
								) : (
									`${(d as Group).title} ${
										(d as Group).manager.userId === userId
											? `(Manager)`
											: ""
									}`
								)}
							</li>
						);
					}
				})}
			</ul>
		)
	);
}
