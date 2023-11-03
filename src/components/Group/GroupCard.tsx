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
import MemberContainer from "./MemberContainer";

type Props = {
	data: Group;
	leaveGroup: (_gId: string, _uId: string) => void;
	acceptRequest: (_gId: string, _uId: string) => void;
	denyRequest: (_gId: string, _uId: string) => void;
	deleteGroup: (_id: string) => void;
	editGroup: (_id: string) => void;
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
	const [isHover, setHover] = useState(false);
	const [showManager, setShowManager] = useState(false);
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
	const editMembers = () => setShowManager((prev) => !prev);
	const onMouseEnter = (_e: React.MouseEvent) => setHover(true);
	const onMouseLeave = (_e: React.MouseEvent) => setHover(false);
	const onMemberClick = () => setShowMembers((prev) => !prev);

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

	return (
		<>
			{isCurrentPage && (
				<div className="flex flex-row gap-4">
					<Link
						to={`/group/${data.groupId}`}
						className="font-bold text-4xl hover:underline"
					>
						{data.title}
					</Link>
					<MenuDropdown options={moreOptions} cardId={data.groupId} />
				</div>
			)}
			<div
				className={
					"flex flex-col gap-2 p-4 rounded-lg dark:bg-zinc-900 " +
					(!isCurrentPage &&
						" border-2 border-black dark:border-zinc-600 ") +
					(!isCurrentPage &&
						isHover &&
						" hover:bg-slate-100 dark:hover:border-zinc-400")
				}
			>
				{!isEditing ? (
					<>
						{!isCurrentPage && (
							<div className="flex flex-row justify-between">
								<Link
									to={`/group/${data.groupId}`}
									className="font-semibold text-3xl hover:underline"
									onMouseEnter={onMouseEnter}
									onMouseLeave={onMouseLeave}
								>
									{data.title}
								</Link>
								<MenuDropdown
									options={moreOptions}
									cardId={data.groupId}
								/>
							</div>
						)}
						<p>{data.description}</p>
						<p>Group ID: {data.groupId}</p>
						<p>
							{"Manager: "}
							<Link className="hover:underline" to={profileLink}>
								{data.manager.name}
							</Link>
						</p>
						<CountLabel
							count={data.userIds.length}
							text="Member"
							onClick={onMemberClick}
						/>
						{showMembers && (
							<MemberContainer groupId={data.groupId} />
						)}
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
										className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold"
										onClick={request.fn}
									>
										{request.text}
									</button>
								)}
								{isManager && isCurrentPage && (
									<div className="flex flex-col gap-2">
										<ToggleButton onClick={editMembers}>
											<CollapseIcon
												isCollapsed={!showManager}
											/>
											<h3>Edit Members</h3>
										</ToggleButton>

										{showManager && (
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
						{...{
							setEditing,
							setGroup,
							setGroups,
							previousData: data,
						}}
					/>
				)}
			</div>
		</>
	);
}
