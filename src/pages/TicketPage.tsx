import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FetchedTicketData } from "../types";
import Nav from "../components/Nav";

export default function TicketPage() {
	const ticketId = useParams().id || "";
	const [card, setCard] = useState<FetchedTicketData>();

	useEffect(() => {
		async function getTicket() {
			try {
				const res = await fetch(`/api/ticket/${ticketId}`, {
					headers: { "content-type": "application/json" },
				});
				const data = await res.json();
				setCard(data);
			} catch (e) {
				console.error(e);
			}
		}
		getTicket();
	}, [ticketId]);

	return (
		<div>
			<Nav />
			<div>
				<h1>{card?.title}</h1>
				<p>{card?.description}</p>
			</div>
		</div>
	);
}
