import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Group } from "../../types";
import MenuDropdown from "../Nav/MenuDropdown";
import GroupEditor from "./GroupEditor";
import CountLabel from "../Display/CountLabel";
import { useAuth } from "../../hooks/auth/useAuth";
import MemberManager from "./MemberManager";
import ToggleButton from "../Nav/ToggleButton";
import CollapseIcon from "../Svg/CollapseIcon";

type Props = {
	data: Group;
	leaveGroup: (_gId: string, _uId: string) => void;
	//requestGroup?: (_gId: string, _uId: string) => void;
	acceptRequest: (_gId: string, _uId: string) => void;
	denyRequest: (_gId: string, _uId: string) => void;
	deleteGroup: (_id: string) => void;
	editGroup: (_id: string) => void;
	//setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
	// isEditing: boolean;
	// setEditing: React.Dispatch<React.SetStateAction<boolean>>;
} & (
	| {
			setGroup?: never;
			setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
			requestGroup: (_gId: string, _uId: string) => void;
	  }
	| {
			setGroup: React.Dispatch<React.SetStateAction<Group>>;
			setGroups?: never;
			requestGroup?: never;
	  }
);

export default function GroupCard(props: Props) {
	const { user } = useAuth();
	const {
		data,
		// isEditing,
		// setEditing,
		//editGroup,
		deleteGroup,
		setGroup,
		setGroups,
		leaveGroup,
		requestGroup,
		denyRequest,
		acceptRequest,
	} = props;
	const [isRequested, setRequested] = useState(
		data.requestUserIds.includes(user.current!.userId)
	);
	const [isEditing, setEditing] = useState(false);
	const [showMembers, setShowMembers] = useState(false);
	const { id } = useParams();
	const isCurrentPage = data.groupId === id;

	const isMember = data.userIds.includes(user.current!.userId);
	const request = requestGroup
		? isRequested
			? {
					text: "Cancel Request",
					fn: () => {
						denyRequest(data.groupId, user.current!.userId);
						setRequested(false);
					},
			  }
			: {
					text: "Request to join",
					fn: () => {
						requestGroup(data.groupId, user.current!.userId);
						setRequested(true);
					},
			  }
		: null;
	const isManager = data.manager.userId === user.current!.userId;

	const editGroup = () => setEditing((prev) => !prev);
	const editMembers = () => setShowMembers((prev) => !prev);

	const moreOptions = [
		isManager
			? { name: "Delete", fn: deleteGroup }
			: {
					name: "Leave Group",
					fn: () => leaveGroup(data.groupId, user.current!.userId),
			  },
		{ name: "Edit", fn: editGroup },
	];
	const profileLink =
		user.current?.userId === data.manager.userId
			? `/user`
			: `/user/${data.manager.userId}`;

	const memberButtons = [{ fn: leaveGroup, label: "Kick" }];
	const requestButtons = [
		{ fn: acceptRequest, label: "Accept" },
		{ fn: denyRequest, label: "Deny" },
	];
	// const categories = [
	// 	{
	// 		title: "Members",
	// 		buttons: memberButtons,
	// 		url: (groupId: string) => `/api/user/group/${groupId}`,
	// 	},
	// 	{
	// 		title: "Requests",
	// 		buttons: requestButtons,
	// 		url: (groupId: string) => `/api/user/group/${groupId}/request`,
	// 	},
	// ];

	return (
		<div className="flex flex-col gap-2 p-4 rounded-lg border-2 dark:border-neutral-700 dark:bg-zinc-900">
			{!isEditing ? (
				<>
					<div className="flex flex-row justify-between">
						<Link
							to={`/group/${data.groupId}`}
							className="font-semibold text-3xl hover:underline"
						>
							{data.title}
						</Link>
						<MenuDropdown
							options={moreOptions}
							cardId={data.groupId}
						/>
					</div>
					<p>{data.description}</p>
					<p>Group ID: {data.groupId}</p>
					<p>
						{"Manager: "}
						<Link className="underline" to={profileLink}>
							{data.manager.name}
						</Link>
					</p>
					<CountLabel count={data.userIds.length} text="Member" />
					<CountLabel
						count={data.projectIds.length}
						text="Project"
						showZero
					/>
					<CountLabel
						count={data.ticketIds.length}
						text="Task"
						showZero
					/>
					{isManager && (
						<CountLabel
							count={data.requestUserIds.length}
							text="Request"
							showZero
						/>
					)}
					{(!isMember || isManager) && (
						<div className="flex flex-row gap-2">
							{!isMember && request && (
								<button
									className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold"
									onClick={request.fn}
								>
									{request.text}
								</button>
							)}
							{isManager && isCurrentPage && (
								<div className="flex flex-col gap-2">
									<ToggleButton onClick={editMembers}>
										<CollapseIcon
											isCollapsed={!showMembers}
										/>
										<h3>Edit Members</h3>
									</ToggleButton>

									{showMembers && (
										<MemberManager
											managerId={data.manager.userId}
											groupId={data.groupId}
											memberFns={memberButtons}
											requestFns={requestButtons}
										/>
									)}
								</div>
							)}
						</div>
					)}
				</>
			) : (
				<GroupEditor
					{...{ setEditing, setGroup, setGroups, previousData: data }}
				/>
			)}
		</div>
	);
}
