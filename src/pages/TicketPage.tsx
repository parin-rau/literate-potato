import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchedTicketData } from "../types";
import TicketCard from "../components/Card/TicketCard";

export default function TicketPage() {
	const ticketId = useParams().id || "";
	const [card, setCard] = useState<FetchedTicketData[]>([]);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		async function getTicket() {
			try {
				const res = await fetch(`/api/ticket/${ticketId}`, {
					headers: { "content-type": "application/json" },
				});
				const data = await res.json();
				setCard([data]);
				setInitialized(true);
			} catch (e) {
				console.error(e);
			}
		}
		getTicket();
	}, [ticketId]);

	return (
		<div className="pt-20">
			<div className="container mx-auto flex flex-col bg-transparent px-2 py-2 rounded-lg space-y-1">
				{initialized && (
					<TicketCard cardData={card[0]} setCards={setCard} />
				)}
			</div>
		</div>
	);
}
