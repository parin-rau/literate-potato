//import { useState } from "react";
//import UserRow from "./UserRow";
import { Link } from "react-router-dom";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
//import { LoadingSpinner } from "../Nav/Loading";
import { User } from "../../types";

interface Btn {
	fn: (
		_groupId: string,
		_userId: string
	) => void | ((_userId: string) => void);
	label: string;
}

interface Props {
	title: string;
	buttons: Btn[];
	groupId: string;
	managerId: string;
	userKind?: string;
}

interface BtnProps extends Btn {
	groupId: string;
	userId: string;
}

interface RowProps extends Omit<Props, "title"> {
	userId: string;
	username: string;
}

// interface Users {
// 	userId: string;
// 	username: string;
// }

// const mapUsers = (userIds: string[]) =>
// 	userIds.map((u) => ({
// 		userId: u,
// 		username: "",
// 	}));

const isManager = (userId: string, managerId: string) => userId === managerId;

function UserBtn({ fn, label, groupId, userId }: BtnProps) {
	return (
		<button
			className="p-2 bg-blue-600 rounded-md"
			onClick={() => fn(groupId, userId)}
		>
			{label}
		</button>
	);
}

function UserRow({ userId, username, groupId, managerId, buttons }: RowProps) {
	return (
		<div className="flex flex-row gap-4">
			<Link className="underline" to={`/user/${userId}`}>
				{username}
			</Link>
			{!isManager(userId, managerId) &&
				buttons.map((b) => <UserBtn {...{ ...b, userId, groupId }} />)}
		</div>
	);
}

export default function MemberManager({
	title,
	groupId,
	managerId,
	buttons,
	userKind,
}: Props) {
	// const [users, setUsers] = useState<Users[]>(mapUsers(userIds));
	const url = userKind
		? `/api/user/group/${groupId}/${userKind}`
		: `/api/user/group/${groupId}`;

	const { data: users, isLoading } = useInitialFetch<User[]>(url);

	return (
		!isLoading && (
			<div className="flex flex-col gap-2">
				<h3>{title}</h3>
				{users.map((u) => (
					<UserRow
						{...{
							userId: u.userId,
							username: u.username,
							managerId,
							buttons,
							groupId,
						}}
					/>
				))}
			</div>
		)
	);
}
