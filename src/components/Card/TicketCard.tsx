import { useState } from "react";
import { FetchedTicketData, Project, TicketData } from "../../types";
import MenuDropdown from "../Nav/MenuDropdown";
import timestampDisplay from "../../utility/timestampDisplay";
import TagsDisplay from "../Display/TagsDisplay";
import SelectDropdown from "../Nav/SelectDropdown";
import SubtaskDisplay from "../Display/SubtaskDisplay";
import { optionLookup } from "../../utility/optionLookup";
import { Link } from "react-router-dom";
import TicketEditor from "../Editor/TicketEditor";
import ProgressBar from "../Display/ProgressBar";
import { countCompletedSubs } from "../../utility/countCompleted";
import { arrayExclude } from "../../utility/arrayComparisons";

type Props = {
	cardData: FetchedTicketData;
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	filters: string[];
	setFilters: React.Dispatch<React.SetStateAction<string[]>>;
	setCardCache?: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
};

export default function TicketCard(props: Props) {
	const {
		title,
		description,
		priority,
		due,
		timestamp,
		tags,
		ticketId,
		taskStatus,
		lastModified,
		subtasks,
		project,
		ticketNumber,
		comments,
		creator,
	} = props.cardData;
	const { setCards, filters, setFilters, setCardCache, setProject } = props;
	const moreOptions = [
		{ name: "Delete", fn: deleteCard, ticketId },
		{ name: "Edit", fn: editCard, ticketId },
	];

	const [statusColors, setStatusColors] = useState(
		statusColorsLookup(taskStatus)
	);
	const [isEditing, setEditing] = useState(false);

	function statusColorsLookup(currentStatus: string) {
		const currentOption = optionLookup.taskStatus.find(
			(option) => option.value === currentStatus
		);
		const optionColors =
			currentOption?.bgColor && currentOption?.textColor
				? `${currentOption.bgColor} ${currentOption.textColor}`
				: "bg-slate-100 text-black";
		return optionColors;
	}

	async function deleteCard(id: string) {
		try {
			const subtasksCompletedIds = subtasks
				?.filter((o) => o.completed)
				.map((o) => o.subtaskId);
			const subtasksTotalIds = subtasks?.map((o) => o.subtaskId);
			const res1 = await fetch(`/api/ticket/${ticketId}`, {
				method: "DELETE",
			});
			if (res1.ok) {
				setCards((prevCards) =>
					prevCards.filter((card) => card.ticketId !== id)
				);
				setCardCache &&
					setCardCache((prev) =>
						prev.filter((card) => card.ticketId !== id)
					);
				try {
					const res2 = await fetch(
						`/api/project/${project.projectId}`,
						{
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								operation: "delete",
								subtasksCompletedIds,
								subtasksTotalIds,
							}),
						}
					);
					if (res2.ok) {
						setProject &&
							setProject((prev) =>
								prev.map((proj) =>
									proj.projectId === project.projectId
										? {
												...proj,
												subtasksCompletedIds:
													arrayExclude(
														proj.subtasksCompletedIds,
														subtasksCompletedIds
													) as string[],
												subtasksTotalIds: arrayExclude(
													proj.subtasksTotalIds,
													subtasksTotalIds
												) as string[],
										  }
										: proj
								)
							);
						console.log("Deleted tasks from project");
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

	async function changeStatus(e: React.ChangeEvent<HTMLSelectElement>) {
		const newTaskStatus = e.target.value;
		const newStatusColor = statusColorsLookup(newTaskStatus);
		try {
			const res = await fetch(`/api/ticket/${ticketId}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ taskStatus: newTaskStatus }),
			});
			if (res.ok) {
				setCards((prevCards) =>
					prevCards.map((card: TicketData) =>
						card.ticketId === ticketId
							? { ...card, taskStatus: newTaskStatus }
							: card
					)
				);
				setStatusColors(newStatusColor);
			}
		} catch (err) {
			console.error(err);
		}
	}

	async function completeSubtask(id: string) {
		if (subtasks) {
			const targetSubtask = subtasks.find(
				(subtask) => subtask.subtaskId === id
			);
			const updatedCompletion = !targetSubtask?.completed;
			const updatedSubtasks = subtasks.map((subtask) =>
				subtask.subtaskId === id
					? { ...subtask, completed: updatedCompletion }
					: subtask
			);

			const subtasksCompletedIds = [targetSubtask?.subtaskId];
			const subtasksTotalIds: string[] = [];

			try {
				const res1 = await fetch(`/api/ticket/${ticketId}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ subtasks: updatedSubtasks }),
				});
				if (res1.ok) {
					setCards((prevCards) =>
						prevCards.map((card) =>
							card.ticketId === ticketId
								? {
										...card,
										subtasks: updatedSubtasks,
										lastModified: Date.now(),
								  }
								: card
						)
					);
					if (project.projectId) {
						const operation = updatedCompletion ? "add" : "delete";

						const res2 = await fetch(
							`/api/project/${project.projectId}`,
							{
								method: "PATCH",
								headers: {
									"Content-Type": "application/json",
								},
								body: JSON.stringify({
									operation,
									subtasksCompletedIds,
									subtasksTotalIds,
								}),
							}
						);
						if (res2.ok) {
							console.log(
								"Incremented completed tasks for project"
							);
						}
					}
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	return (
		<div className="m-1 border-black border-2 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-600">
			{!isEditing && (
				<div className="flex flex-col px-4 py-4 space-y-2 dark:border-neutral-700">
					<div className="flex flex-row flex-grow justify-between items-baseline space-x-2">
						<Link
							to={`/ticket/${ticketId}`}
							className="font-semibold text-2xl sm:text-3xl hover:underline"
						>
							{title}
						</Link>

						<div className="flex flex-row space-x-2 items-center">
							<h2 className="text-lg sm:text-xl pr-2">
								{ticketNumber && `#${ticketNumber}`}
							</h2>
							<SelectDropdown
								name="taskStatus"
								value={taskStatus}
								options={optionLookup.taskStatus}
								handleChange={changeStatus}
								stylesOverride={statusColors}
							/>
							<MenuDropdown
								options={moreOptions}
								cardId={ticketId}
							/>
						</div>
					</div>
					{(priority || due || subtasks!.length > 0) && (
						<div className="flex flex-col space-y-1 rounded-lg border border-inherit shadow-sm p-2">
							{subtasks && subtasks.length > 0 && (
								<>
									<ProgressBar
										progress={countCompletedSubs(subtasks)}
									/>
									<div></div>
								</>
							)}
							{priority && (
								<p className="">Priority: {priority}</p>
							)}
							{due && (
								<p
									className={
										" " +
										(taskStatus !== "Completed" &&
											Date.now() >
												new Date(due).getTime() &&
											"text-red-500 font-semibold")
									}
								>
									Due: {due}
									{taskStatus !== "Completed" &&
										Date.now() >
											new Date(due).getTime() && (
											<i> Overdue</i>
										)}
								</p>
							)}
						</div>
					)}
					{(description ||
						subtasks!.length > 0 ||
						tags.length > 0) && (
						<div className="border-inherit border rounded-lg shadow-sm p-2 space-y-4">
							{description && (
								<p className="text-lg">{description}</p>
							)}
							{subtasks && subtasks.length > 0 && (
								<div>
									<h4 className="font-semibold">Subtasks</h4>
									<SubtaskDisplay
										subtasks={subtasks}
										completeSubtask={completeSubtask}
									/>
								</div>
							)}
							{tags.length > 0 && (
								<div>
									<h4 className="font-semibold">Tags</h4>
									<TagsDisplay
										{...{ tags, filters, setFilters }}
									/>
								</div>
							)}
						</div>
					)}
					{comments && (
						<div className="flex flex-col shadow-sm border border-inherit p-2 rounded-lg">
							<span>
								<Link to={`/ticket/${ticketId}`}>
									{`${comments.length} Comment${
										comments.length !== 1 && "s"
									}`}
								</Link>
							</span>
						</div>
					)}
					<div className="flex flex-col shadow-sm border border-inherit p-2 rounded-lg">
						{creator && <span>Creator: {creator}</span>}
						<span>
							<Link to={`/project/${project.projectId}`}>
								Project:{" "}
								{project.projectId ? (
									<u>{project.projectTitle}</u>
								) : (
									"Unassigned"
								)}
							</Link>
						</span>
						<span>Created: {timestampDisplay(timestamp)}</span>
						{lastModified && (
							<i>
								Last Activity: {timestampDisplay(lastModified)}
							</i>
						)}
					</div>
					{/* <p>ticket: {ticketId}</p>
				<p>project: {projectId}</p> */}
				</div>
			)}
			{isEditing && (
				<TicketEditor
					{...{
						setCards,
						setEditing,
						setCardCache: setCardCache as React.Dispatch<
							React.SetStateAction<FetchedTicketData[]>
						>,
					}}
					dataKind="ticket"
					previousData={{ ...props.cardData }}
				/>
			)}
		</div>
	);
}
