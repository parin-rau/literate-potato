//import { useState } from "react";
//import UserRow from "./UserRow";
import { Link } from "react-router-dom";
//import { LoadingSpinner } from "../Nav/Loading";
import { User } from "../../types";
import { useEffect, useState } from "react";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";

interface Btn {
	fn: (
		_groupId: string,
		_userId: string
	) => void | ((_userId: string) => void);
	label: string;
}

interface Loading {
	index: number;
	started: boolean;
	loaded: boolean;
}

interface Category {
	buttons: Btn[];
	title: string;
	url: (_id: string) => string;
}

interface CategoryProps extends Category {
	groupId: string;
	managerId: string;
	startLoading: Loading[];
	setLoading: React.Dispatch<React.SetStateAction<Loading[]>>;
	index: number;
}

interface Props {
	categories: Category[];
	groupId: string;
	managerId: string;
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

function MemberCategory({
	title,
	groupId,
	managerId,
	buttons,
	startLoading,
	setLoading,
	index,
	url,
}: CategoryProps) {
	const [users, setUsers] = useState<User[]>([]);
	const { protectedFetch } = useProtectedFetch();
	const resourceUrl = url(groupId);

	useEffect(() => {
		const abortController = new AbortController();

		const isNextIndex = (array: unknown[], id: number) => {
			return id === index + 1 && id < array.length;
		};

		const getMembers = async () => {
			const res = await protectedFetch(resourceUrl, {
				signal: abortController.signal,
			});
			if (res.ok) {
				const data = await res.json();
				setUsers(data);
				setLoading((prev) =>
					prev.map((l) =>
						l.index === index || isNextIndex(prev, l.index)
							? l.index === index
								? { ...l, loaded: true }
								: { ...l, started: true }
							: l
					)
				);
			}
		};
		getMembers();

		return () => abortController.abort();
	}, [index, protectedFetch, resourceUrl, setLoading]);

	return (
		startLoading[index].loaded && (
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

//const mapProps = (categories: Category[]) => categories.map(c => ({title: c.title, buttons: c.buttons, users: []}))

export default function MemberManager({
	groupId,
	managerId,
	categories,
}: Props) {
	// const url = useMemo(
	// 	() => ({
	// 		requests: `/api/user/group/${groupId}/request`,
	// 		members: `/api/user/group/${groupId}`,
	// 	}),
	// 	[groupId]
	// );

	//const { protectedFetch } = useProtectedFetch();
	//const init = mapProps(categories)
	const [startLoading, setLoading] = useState(
		categories.map((_c, index) => ({
			index,
			started: index === 0 ? true : false,
			loaded: false,
		}))
	);
	//const [data, setData] = useState<Category[]>(init)
	//const [members, setMembers] = useState<User[]>([]);
	//const [requests, setRequests] = useState<User[]>([]);

	// useEffect(() => {
	// 	const abortController1 = new AbortController();
	// 	const abortController2 = new AbortController();

	// 	const getMembers = async () => {
	// 		const res1 = await protectedFetch(url.members, {
	// 			signal: abortController1.signal,
	// 		});
	// 		if (res1.ok) {
	// 			const data1 = await res1.json();
	//             setMembers(data1)
	// 			setData(prev => prev.map((c => c.title));

	// 			const res2 = await protectedFetch(url.requests, {
	// 				signal: abortController2.signal,
	// 			});
	// 			if (res2.ok) {
	// 				const data2 = await res2.json();
	// 				setRequests(data2);
	// 			}
	// 		}
	// 	};
	// 	getMembers();

	// 	return () => {
	// 		abortController1.abort();
	// 		abortController2.abort();
	// 	};
	// }, [protectedFetch, url]);

	return (
		categories.length > 0 && (
			<div className="flex flex-col gap-2">
				{categories.map(
					(c, index) =>
						startLoading[index].started && (
							<MemberCategory
								{...{
									...c,
									index,
									groupId,
									managerId,
									startLoading,
									setLoading,
								}}
							/>
						)
				)}

				{/* {members.length > 0 && (
					<MemberCategory
						{...{
							users: members,
							title: "Members",
							groupId,
							buttons,
							managerId,
						}}
					/>
				)}
				{requests.length > 0 && (
					<MemberCategory
						{...{
							users: requests,
							title: "Requests",
							groupId,
							buttons,
							managerId,
						}}
					/>
				)} */}
			</div>
		)
	);
}
