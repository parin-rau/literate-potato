import { FetchedTicketData } from "../server";
import timestampDisplay from "../utility/timestampDisplay";

type Props = {
	cardData: FetchedTicketData;
};

export default function TicketCard(props: Props) {
	function deleteCard() {
		console.log("delete me");
	}

	return (
		<div className="sm:container sm:mx-auto border-black border-2 rounded-lg">
			<div className="flex flex-col px-4 py-4 space-y-2">
				<div className="flex flex-row flex-grow justify-between items-center">
					<h1 className="text-bold text-3xl">
						{props.cardData.title}
					</h1>

					<button onClick={() => deleteCard()}>X</button>
				</div>

				<p className="text-lg">{props.cardData.description}</p>
				<p>Priority: {props.cardData.priority}</p>
				<p>Due: {props.cardData.due}</p>
				<p>Created: {timestampDisplay(props.cardData.timestamp)}</p>
			</div>
		</div>
	);
}
