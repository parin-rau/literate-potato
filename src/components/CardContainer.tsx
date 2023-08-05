import { useState, useEffect } from "react";
import TicketCard from "./TicketCard";
import { FetchedTicketData } from "../server";

export default function CardContainer() {
	const [cards, setCards] = useState<FetchedTicketData[]>([]);

	useEffect(() => {
		async function getPosts() {
			try {
				const res = await fetch("/api/ticket", {
					headers: { "Content-Type": "application/json" },
				});
				const data: FetchedTicketData[] = await res.json();
				setCards(data);
			} catch (err) {
				console.error(err);
			}
		}
		getPosts();
	}, []);

	return (
		<div className="sm:container mx-auto flex flex-col-reverse">
			{cards.map((card) => (
				<TicketCard key={card._id} cardData={{ ...card }} />
			))}
		</div>
	);
}
