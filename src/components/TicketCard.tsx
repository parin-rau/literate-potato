import { useState } from "react";
import { FetchedTicketData, TicketData } from "../types";
import MenuDropdown from "./MenuDropdown";
import timestampDisplay from "../utility/timestampDisplay";
import TagsDisplay from "./TagsDisplay";
import SelectDropdown from "./SelectDropdown";
import SubtaskDisplay from "./SubtaskDisplay";
import { optionLookup } from "../utility/optionLookup";
import { Link } from "react-router-dom";
import TicketEditor from "./TicketEditor";

type Props = {
	cardData: FetchedTicketData;
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	filter: string[];
	setFilter: React.Dispatch<React.SetStateAction<string[]>>;
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
		//projectId,
		ticketNumber,
	} = props.cardData;
	const { setCards, filter, setFilter } = props;
	const moreOptions = [
		{ name: "Delete", fn: deleteCard, ticketId: ticketId },
		{ name: "Edit", fn: editCard, ticketId: ticketId },
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
			setEditing(true);
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
								? {
										...card,
										subtasks: updatedSubtasks,
										lastModified: Date.now(),
								  }
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
			const percentCompleted =
				Math.floor(
					subtasks.length > 0
						? (totalCompleted / subtasks.length) * 100
						: 0
				).toString() + "%";
			return { totalCompleted, percentCompleted };
		} else {
			return { totalCompleted: 0, percentCompleted: "0%" };
		}
	}

	function CardDisplay() {
		return (
			<div className="flex flex-col px-4 py-4 space-y-2">
				<div className="flex flex-row flex-grow justify-between items-baseline space-x-2">
					<div className="flex flex-col sm:flex-row sm:items-baseline space-y-1 sm:space-x-4">
						<Link
							to={`/ticket/${ticketId}`}
							className="font-semibold text-2xl sm:text-3xl"
						>
							{title}
						</Link>
						<h2 className="text-lg sm:text-xl">
							{ticketNumber && `#${ticketNumber}`}
						</h2>
					</div>
					<div className="flex flex-row space-x-2 items-center">
						<SelectDropdown
							name="taskStatus"
							value={taskStatus}
							options={optionLookup.taskStatus}
							handleChange={changeStatus}
							colors={statusColors}
						/>
						<MenuDropdown options={moreOptions} cardId={ticketId} />
					</div>
				</div>
				{(priority || due || subtasks!.length > 0) && (
					<div className="grid grid-cols-2 rounded-lg border border-1 shadow-sm p-2">
						{subtasks && subtasks.length > 0 && (
							<span>
								{`${countCompletedSubs().totalCompleted}/${
									subtasks.length
								} Subtask${subtasks.length !== 1 ? "s" : ""}`}
							</span>
						)}
						{priority && <p className="">Priority: {priority}</p>}
						{subtasks && subtasks.length > 0 && (
							<span>{`${
								countCompletedSubs().percentCompleted
							} Completed`}</span>
						)}
						{due && <p>Due: {due}</p>}
					</div>
				)}
				{(description || subtasks!.length > 0 || tags.length > 0) && (
					<div className="border border-1 rounded-lg shadow-sm p-2 space-y-4">
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
									tags={tags}
									filter={filter}
									setFilter={setFilter}
								/>
							</div>
						)}
					</div>
				)}
				<div className="flex flex-col shadow-sm border border-1 p-2 rounded-lg">
					<span>Created: {timestampDisplay(timestamp)}</span>
					{lastModified && (
						<i>Last Activity: {timestampDisplay(lastModified)}</i>
					)}
				</div>
				{/* <p>ticket: {ticketId}</p>
				<p>project: {projectId}</p> */}
			</div>
		);
	}

	return (
		<div className="my-1 mx-1 min-w-min border-black border-2 rounded-md bg-white">
			{!isEditing && <CardDisplay />}
			{isEditing && (
				<TicketEditor
					setCards={setCards}
					setEditing={setEditing}
					previousData={{ ...props.cardData }}
				/>
			)}
		</div>
	);
}
