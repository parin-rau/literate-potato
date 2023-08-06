import { useEffect } from "react";
import TicketCard from "./TicketCard";
import { FetchedTicketData } from "../types";

type Props = {
	cards: FetchedTicketData[];
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	containerTitle: string;
};

export default function CardContainer(props: Props) {
	const { cards, setCards, containerTitle } = props;

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
	}, [setCards]);

	return (
		<div className="sm:container mx-auto flex flex-col">
			<div className="flex flex-row justify-between">
				<h1 className="text-bold text-3xl my-4">{containerTitle}</h1>
				<button onClick={() => console.log("sorting")}>Sort</button>
			</div>
			{cards.map((card) => (
				<TicketCard key={card.ticketId} cardData={{ ...card }} />
			))}
		</div>
	);
}
