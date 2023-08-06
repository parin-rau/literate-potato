import { FetchedTicketData } from "../types";
import MenuDropdown from "./MenuDropdown";
import timestampDisplay from "../utility/timestampDisplay";

type Props = {
	cardData: FetchedTicketData;
};

export default function TicketCard(props: Props) {
	const { title, description, priority, due, timestamp } = props.cardData;
	const menuOptions = [
		{ name: "Delete", function: deleteCard },
		{ name: "Edit", function: editCard },
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

	return (
		<div className="sm:container sm:mx-auto my-1 border-black border-2 rounded-lg">
			<div className="flex flex-col px-4 py-4 space-y-2">
				<div className="flex flex-row flex-grow justify-between items-center">
					<h1 className="text-bold text-3xl">{title}</h1>
					<MenuDropdown options={menuOptions} />
				</div>
				{description && <p className="text-lg">{description}</p>}
				{priority && <p>Priority: {priority}</p>}
				{due && <p>Due: {due}</p>}
				<p>Created: {timestampDisplay(timestamp)}</p>
			</div>
		</div>
	);
}
