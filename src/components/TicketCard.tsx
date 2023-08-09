import { useState, useEffect } from "react";
import { FetchedTicketData, TicketData } from "../types";
import MenuDropdown from "./MenuDropdown";
import timestampDisplay from "../utility/timestampDisplay";
import TagsDisplay from "./TagsDisplay";
import SelectDropdown from "./SelectDropdown";
import SubtaskDisplay from "./SubtaskDisplay";

type Props = {
	cardData: FetchedTicketData;
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
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
	} = props.cardData;
	const { setCards } = props;
	const moreOptions = [
		{ name: "Delete", function: deleteCard },
		{ name: "Edit", function: editCard },
	];
	const statusOptions = [
		{
			label: "Not Started",
			value: "Not Started",
			sortValue: 0,
			bgColor: "bg-red-500",
			textColor: "text-white",
		},
		{
			label: "In Progress",
			value: "In Progress",
			sortValue: 1,
			bgColor: "bg-yellow-500",
			textColor: "text-white",
		},
		{
			label: "Completed",
			value: "Completed",
			sortValue: 2,
			bgColor: "bg-green-500",
			textColor: "text-white",
		},
	];

	const [statusColors, setStatusColors] = useState(
		statusColorsLookup(taskStatus)
	);

	function statusColorsLookup(currentStatus: string) {
		const currentOption = statusOptions.find(
			(option) => option.value === currentStatus
		);
		const optionColors =
			currentOption?.bgColor && currentOption?.textColor
				? `${currentOption.bgColor} ${currentOption.textColor}`
				: "bg-slate-100 text-black";
		return optionColors;
	}

	function deleteCard() {
		try {
			console.log("delete me");
		} catch (err) {
			console.error(err);
		}
	}

	function editCard() {
		try {
			console.log("edit me");
		} catch (err) {
			console.error(err);
		}
	}

	useEffect(() => {}, [statusColors]);

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
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				setCards((prevCards: any) =>
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
			const updatedCompletion = !subtasks.find(
				(subtask) => subtask.subtaskId === id
			)?.completed;
			const updatedSubtasks = subtasks.map((subtask) =>
				subtask.subtaskId === id
					? { ...subtask, completed: updatedCompletion }
					: subtask
			);
			// const updated = {
			// 	...editor,
			// 	subtasks: subtasks.map((subtask) =>
			// 		subtasks.indexOf(subtask) === id
			// 			? { ...subtask, completed: !subtask.completed }
			// 			: subtask
			// 	),
			// }
			try {
				const res = await fetch(`/api/ticket/${ticketId}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ subtasks: updatedSubtasks }),
				});
				if (res.ok) {
					setCards((prevCards) =>
						prevCards.map((card) =>
							card.ticketId === ticketId
								? { ...card, subtasks: updatedSubtasks }
								: card
						)
					);
				}
			} catch (e) {
				console.error(e);
			}
		}
	}

	function countCompletedSubs() {
		if (subtasks) {
			const isCompleted: number[] = subtasks.map((subtask) =>
				subtask.completed ? 1 : 0
			);
			const totalCompleted = isCompleted.reduce((a, b) => a + b, 0);
			return totalCompleted;
		} else {
			return 0;
		}
	}

	return (
		<div className="sm:container sm:mx-auto my-1 border-black border-2 rounded-lg">
			<div className="flex flex-col px-4 py-4 space-y-2">
				<div className="flex flex-row flex-grow justify-between items-start">
					<div className="flex flex-row items-center space-x-6">
						<h1 className="text-bold text-3xl">{title}</h1>
						{subtasks && subtasks.length > 0 && (
							<span>
								{countCompletedSubs()}/{subtasks.length}{" "}
								subtasks
							</span>
						)}
					</div>
					<div className="flex flex-row space-y-2 items-center">
						<SelectDropdown
							name="taskStatus"
							value={taskStatus}
							options={statusOptions}
							handleChange={changeStatus}
							colors={statusColors}
						/>
						<MenuDropdown options={moreOptions} />
					</div>
				</div>
				{description && <p className="text-lg">{description}</p>}
				{priority && <p>Priority: {priority}</p>}
				{due && <p>Due: {due}</p>}
				{subtasks && subtasks.length > 0 && (
					<SubtaskDisplay
						subtasks={subtasks}
						completeSubtask={completeSubtask}
					/>
				)}
				{tags.length > 0 && <TagsDisplay tags={tags} />}
				<div className="flex flex-col">
					<span>Created: {timestampDisplay(timestamp)}</span>
					{lastModified && (
						<i>Modified: {timestampDisplay(lastModified)}</i>
					)}
				</div>
				<p>{ticketId}</p>
			</div>
		</div>
	);
}
