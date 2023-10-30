import { Link } from "react-router-dom";
import { User } from "../../types";
import { useEffect, useState } from "react";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";

interface Btn {
	fn: (_groupId: string, _userId: string) => void;
	label: string;
}

interface Category {
	buttons: Btn[];
	title: string;
}

interface CategoryProps extends Category {
	groupId: string;
	managerId: string;
	users: User[];
}

interface BtnFns {
	label: string;
	fn: (_groupId: string, _userId: string) => void;
}

interface Props {
	groupId: string;
	managerId: string;
	memberFns: BtnFns[];
	requestFns: BtnFns[];
}

interface BtnProps extends Btn {
	groupId: string;
	userId: string;
}

interface RowProps {
	userId: string;
	username: string;
	groupId: string;
	managerId: string;
	buttons: Btn[];
}

const isManager = (userId: string, managerId: string) => userId === managerId;

function UserBtn({ fn, label, groupId, userId }: BtnProps) {
	return (
		<button
			className="px-2 py-1 text-white bg-blue-600 hover:bg-blue-500 rounded-md"
			onClick={() => fn(groupId, userId)}
		>
			{label}
		</button>
	);
}

function UserRow({ userId, username, groupId, managerId, buttons }: RowProps) {
	return (
		<>
			<Link className="underline" to={`/user/${userId}`}>
				{username}
			</Link>
			<div className="flex flex-row gap-2">
				{!isManager(userId, managerId) &&
					buttons.map((b) => (
						<UserBtn {...{ ...b, userId, groupId }} />
					))}
			</div>
		</>
	);
}

function MemberCategory({
	title,
	groupId,
	managerId,
	buttons,
	users,
}: CategoryProps) {
	return (
		users.length > 0 && (
			<div className="flex flex-col gap-2">
				<h3 className="font-semibold text-xl">{title}</h3>
				<div className="grid grid-cols-2 gap-4 items-center">
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
			</div>
		)
	);
}

export default function MemberManager({
	groupId,
	managerId,
	memberFns,
	requestFns,
}: Props) {
	const [users, setUsers] = useState<{ members: User[]; requests: User[] }>({
		members: [],
		requests: [],
	});
	const { protectedFetch } = useProtectedFetch();

	const kickUser = (groupId: string, userId: string) => {
		memberFns.find((f) => f.label === "Kick")!.fn(groupId, userId);
		setUsers((prev) => ({
			...prev,
			members: prev.members.filter((u) => u.userId !== userId),
		}));
	};

	const acceptUser = (groupId: string, userId: string) => {
		requestFns.find((f) => f.label === "Accept")!.fn(groupId, userId);
		setUsers((prev) => {
			const acceptedUser = prev.requests.find(
				(u) => u.userId === userId
			)!;
			return {
				members: [...prev.members, acceptedUser],
				requests: prev.requests.filter((u) => u.userId !== userId),
			};
		});
	};

	const denyUser = (groupId: string, userId: string) => {
		requestFns.find((f) => f.label === "Deny")!.fn(groupId, userId);
		setUsers((prev) => ({
			...prev,
			requests: prev.requests.filter((u) => u.userId !== userId),
		}));
	};

	const memberButtons = [{ fn: kickUser, label: "Kick" }];
	const requestButtons = [
		{ fn: acceptUser, label: "Accept" },
		{ fn: denyUser, label: "Deny" },
	];

	useEffect(() => {
		const memberAbort = new AbortController();
		const requestAbort = new AbortController();

		const memberUrl = `/api/user/group/${groupId}`;
		const requestUrl = `/api/user/group/${groupId}/request`;

		const getUsers = async () => {
			const res1 = await protectedFetch(memberUrl, {
				signal: memberAbort.signal,
			});
			if (res1.ok) {
				const data1 = await res1.json();
				setUsers((prev) => ({ ...prev, members: data1 }));

				const res2 = await protectedFetch(requestUrl, {
					signal: requestAbort.signal,
				});
				if (res2.ok) {
					const data2 = await res2.json();
					console.log(data2);
					setUsers((prev) => ({ ...prev, requests: data2 }));
				}
			}
		};
		getUsers();

		return () => {
			memberAbort.abort();
			requestAbort.abort();
		};
	}, [groupId, protectedFetch]);

	return (
		<div className="flex flex-col gap-4 p-4 dark:bg-neutral-800 rounded-lg">
			<MemberCategory
				{...{
					title: "Members",
					users: users.members,
					buttons: memberButtons,
					managerId,
					groupId,
				}}
			/>
			<MemberCategory
				{...{
					title: "Requests",
					users: users.requests,
					buttons: requestButtons,
					managerId,
					groupId,
				}}
			/>
		</div>
	);
}
