import { FetchedTicketData, TicketData } from "../types";
import MenuDropdown from "./MenuDropdown";
import timestampDisplay from "../utility/timestampDisplay";
import TagsDisplay from "./TagsDisplay";
import SelectDropdown from "./SelectDropdown";

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
	} = props.cardData;
	const { setCards } = props;
	const moreOptions = [
		{ name: "Delete", function: deleteCard },
		{ name: "Edit", function: editCard },
	];
	const statusOptions = [
		{
			label: "Not Started",
			value: 0,
			bgColor: "bg-red-500",
			textColor: "text-white",
		},
		{
			label: "In Progress",
			value: 1,
			bgColor: "bg-yellow-500",
			textColor: "text-white",
		},
		{
			label: "Completed",
			value: 2,
			bgColor: "bg-green-500",
			textColor: "text-white",
		},
	];

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

	async function changeStatus(e: React.ChangeEvent<HTMLSelectElement>) {
		const newTaskStatus = e.target.value;
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
			}
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className="sm:container sm:mx-auto my-1 border-black border-2 rounded-lg">
			<div className="flex flex-col px-4 py-4 space-y-2">
				<div className="flex flex-row flex-grow justify-between items-center">
					<h1 className="text-bold text-3xl">{title}</h1>
					<div className="flex flex-row space-y-2">
						<SelectDropdown
							name="taskStatus"
							value={taskStatus}
							options={statusOptions}
							handleChange={changeStatus}
						/>
						<MenuDropdown options={moreOptions} />
					</div>
				</div>
				{description && <p className="text-lg">{description}</p>}
				{priority && <p>Priority: {priority}</p>}
				{due && <p>Due: {due}</p>}
				{tags.length > 0 && <TagsDisplay tags={tags} />}
				<p>Created: {timestampDisplay(timestamp)}</p>
				{lastModified && (
					<p>Last Modified: {timestampDisplay(lastModified)}</p>
				)}
				<p>{ticketId}</p>
			</div>
		</div>
	);
}
