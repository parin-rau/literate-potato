import { FetchedTicketData } from "../types";
import timestampDisplay from "../utility/timestampDisplay";

type Props = {
	cardData: FetchedTicketData;
};

export default function TicketCard(props: Props) {
	const { title, description, priority, due, timestamp } = props.cardData;

	function deleteCard() {
		console.log("delete me");
	}

	function editCard() {
		console.log("edit me");
	}

	return (
		<div className="sm:container sm:mx-auto my-1 border-black border-2 rounded-lg">
			<div className="flex flex-col px-4 py-4 space-y-2">
				<div className="flex flex-row flex-grow justify-between items-center">
					<h1 className="text-bold text-3xl">{title}</h1>
					<button onClick={() => deleteCard()}>X</button>
					<button onClick={() => editCard()}>Edit</button>
				</div>
				{description && <p className="text-lg">{description}</p>}
				{priority && <p>Priority: {priority}</p>}
				{due && <p>Due: {due}</p>}
				<p>Created: {timestampDisplay(timestamp)}</p>
			</div>
		</div>
	);
}
