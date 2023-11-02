import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Project } from "../../types";
import timestampDisplay from "../../utility/timestampDisplay";
import MenuDropdown from "../Nav/MenuDropdown";
import TicketEditor from "../Editor/TicketEditor";
import ProgressBar from "../Display/ProgressBar";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";

type Props = {
	isHeader?: boolean;
	cardData: Project;
	setCards: React.Dispatch<React.SetStateAction<Project[]>>;
	setCardCache?: React.Dispatch<React.SetStateAction<Project[]>>;
};

export default function ProjectCard(props: Props) {
	const {
		title,
		description,
		creator,
		projectId,
		timestamp,
		projectNumber,
		tasksCompletedIds,
		tasksTotalIds,
		subtasksCompletedIds,
		subtasksTotalIds,
		color,
		group,
	} = props.cardData;
	const { setCards, setCardCache, isHeader } = props;
	const [isEditing, setEditing] = useState(false);
	const [isHover, setHover] = useState(false);
	const { protectedFetch } = useProtectedFetch();
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const moreOptions = [
		{ name: "Delete", fn: deleteCard, projectId },
		{ name: "Edit", fn: editCard, projectId },
	];

	const taskPercentCompletedNum = Math.floor(
		(tasksCompletedIds!.length / tasksTotalIds!.length) * 100
	);
	const taskProgress = {
		totalTasks: tasksTotalIds!.length,
		totalCompleted: tasksCompletedIds!.length,
		percentCompletedNum: taskPercentCompletedNum,
		percentCompletedString: `${taskPercentCompletedNum.toString()}%`,
	};

	const subtaskPercentCompletedNum = Math.floor(
		(subtasksCompletedIds.length / subtasksTotalIds.length) * 100
	);
	const subtaskProgress = {
		totalTasks: subtasksTotalIds.length,
		totalCompleted: subtasksCompletedIds.length,
		percentCompletedNum: subtaskPercentCompletedNum,
		percentCompletedString: `${subtaskPercentCompletedNum.toString()}%`,
	};

	const onMouseEnter = (_e: React.MouseEvent) => {
		setHover(true);
	};

	const onMouseLeave = (_e: React.MouseEvent) => {
		setHover(false);
	};

	async function deleteCard() {
		try {
			const res1 = await protectedFetch(`/api/project/${projectId}`, {
				method: "DELETE",
			});
			if (res1.ok) {
				try {
					const ticketPatch = {
						project: {
							projectId: "",
							projectTitle: "No project assigned",
						},
					};
					const res2 = await protectedFetch(
						`/api/ticket/project-edit/${projectId}`,
						{
							method: "PATCH",
							body: JSON.stringify(ticketPatch),
						}
					);
					if (res2.ok) {
						pathname === `/project/${projectId}` && navigate(-1);
						const fn = (prev: Project[]) =>
							prev.filter((p) => p.projectId !== projectId);
						setCards((prev) => fn(prev));
						setCardCache && setCardCache((prev) => fn(prev));
					}
				} catch (e) {
					console.error(e);
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

	function editCard() {
		setEditing(true);
	}

	return (
		<div className="flex flex-col gap-2">
			{isHeader && (
				<div className="flex flex-row gap-2 items-baseline">
					<div className="flex flex-row gap-2 items-center">
						<h1 className="font-bold text-4xl mx-2">{title}</h1>
						{color && (
							<div
								className="p-4 rounded-md"
								style={{ backgroundColor: color }}
							></div>
						)}
					</div>
					<MenuDropdown options={moreOptions} cardId={projectId} />
				</div>
			)}
			<div
				className={
					isHeader && !isEditing
						? ""
						: "m-1 h-full border-black border-2 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-600  " +
						  (isHover &&
								" dark:hover:border-zinc-400 hover:bg-slate-100")
				}
			>
				{!isEditing && (
					<div
						//to={`/project/${projectId}`}
						className={
							"flex flex-col px-4 py-2 space-y-1 dark:border-neutral-700 z-0 "
							// + (isHeader ? "pointer-events-none" : "")
						}
						// style={disableLink()}
					>
						{!isHeader && (
							<div className="flex flex-row flex-grow justify-between items-baseline gap-2 z-10">
								<div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
									<div className="flex flex-row space-x-2 items-center">
										<Link
											className="font-semibold text-2xl sm:text-3xl hover:underline"
											to={`/project/${projectId}`}
											onMouseEnter={onMouseEnter}
											onMouseLeave={onMouseLeave}
										>
											{title}
										</Link>
										{color && (
											<div
												className="p-3 rounded-md"
												style={{
													backgroundColor: color,
												}}
											></div>
										)}
									</div>

									<h2 className="text-lg sm:text-xl">
										{projectNumber && `#${projectNumber}`}
									</h2>
								</div>
								<MenuDropdown
									options={moreOptions}
									cardId={projectId}
								/>
							</div>
						)}
						{description && (
							<h2 className={isHeader ? "text-xl" : "text-lg"}>
								{description}
							</h2>
						)}
						{creator.userId && (
							<span>
								Creator:{" "}
								<Link
									className="hover:underline"
									to={`/user/${creator.userId}`}
								>
									{creator.username}
								</Link>
							</span>
						)}
						{group.groupId && (
							<span>
								Group:{" "}
								<Link
									className="hover:underline"
									to={`/group/${group.groupId}`}
								>
									{group.groupTitle}
								</Link>
							</span>
						)}
						<span>Created {timestampDisplay(timestamp)}</span>
						{tasksTotalIds && tasksTotalIds.length > 0 ? (
							<ProgressBar
								progress={{ ...taskProgress }}
								caption="Tasks"
							/>
						) : null}
						{subtasksTotalIds.length > 0 ? (
							<ProgressBar
								progress={{ ...subtaskProgress }}
								caption="Subtasks"
							/>
						) : null}
					</div>
				)}
				{isEditing && (
					<TicketEditor
						{...{
							setCards,
							setEditing,
							setCardCache: setCardCache as React.Dispatch<
								React.SetStateAction<Project[]>
							>,
						}}
						dataKind="project"
						previousData={{ ...props.cardData }}
					/>
				)}
			</div>
		</div>
	);
}
