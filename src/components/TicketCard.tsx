import { useState } from "react";
import { EditorData, FetchedTicketData, TicketData } from "../types";
import MenuDropdown from "./MenuDropdown";
import timestampDisplay from "../utility/timestampDisplay";
import TagsDisplay from "./TagsDisplay";
import SelectDropdown from "./SelectDropdown";
import SubtaskDisplay from "./SubtaskDisplay";
import { optionLookup } from "../utility/optionLookup";
import { Link } from "react-router-dom";

type Props = {
	cardData: FetchedTicketData;
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	setEditor?: React.Dispatch<React.SetStateAction<EditorData>>;
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
		projectId,
		ticketNumber,
	} = props.cardData;
	const { setCards, setEditor } = props;
	const moreOptions = [
		{ name: "Delete", function: deleteCard, ticketId: ticketId },
		{ name: "Edit", function: editCard, ticketId: ticketId },
	];

	const [statusColors, setStatusColors] = useState(
		statusColorsLookup(taskStatus)
	);

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
			const res = await fetch(`/api/ticket/${ticketId}`, {
				method: "DELETE",
			});
			if (res.ok) {
				setCards((prevCards) =>
					prevCards.filter((card) => card.ticketId !== id)
				);
			}
		} catch (err) {
			console.error(err);
		}
	}

	function editCard() {
		try {
			const editorData: EditorData = {
				...props.cardData,
			};
			setEditor(editorData);
			console.log("edit me");
		} catch (err) {
			console.error(err);
		}
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
		<div className=" my-1 mx-1 min-w-min border-black border-2 rounded-lg bg-white">
			<div className="flex flex-col px-4 py-4 space-y-2">
				<div className="flex flex-row flex-grow justify-between items-center space-x-10">
					<div className="flex flex-row items-center space-x-6">
						<Link to={`/ticket/${ticketId}`}>
							<h1 className="text-bold text-3xl">{title}</h1>
						</Link>
						<h2 className="text-bold text-lg">
							{ticketNumber && `#${ticketNumber}`}
						</h2>
						{subtasks && subtasks.length > 0 && (
							<span>
								{countCompletedSubs()}/{subtasks.length}{" "}
								subtasks
							</span>
						)}
					</div>
					<div className="flex flex-row space-x-2 items-center">
						<SelectDropdown
							name="taskStatus"
							value={taskStatus}
							options={optionLookup.taskStatus}
							handleChange={changeStatus}
							colors={statusColors}
						/>
						<MenuDropdown options={moreOptions} />
					</div>
				</div>
				{description && <p className="text-lg">{description}</p>}
				{priority && (
					<p>
						<strong>Priority: {priority}</strong>
					</p>
				)}
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
				<p>ticket: {ticketId}</p>
				<p>project: {projectId}</p>
			</div>
		</div>
	);
}
