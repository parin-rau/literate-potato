import { useEffect } from "react";
import TicketCard from "./TicketCard";
import { sortData } from "../utility/optionLookup";
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
			<div className="flex flex-row justify-between items-center">
				<h1 className="text-bold text-3xl my-4">{containerTitle}</h1>
				<div className="flex flex-col">
					<button
						className="hover:bg-slate-200 px-2 py-1 rounded-full"
						onClick={() => {
							const sorted = sortData(cards, "priority")!;
							setCards(sorted);
						}}
					>
						Sort by Priority
					</button>
					<button
						className="hover:bg-slate-200 px-2 py-1 rounded-full"
						onClick={() => {
							const sorted = sortData(cards, "taskStatus")!;
							setCards(sorted);
						}}
					>
						Sort by Progress
					</button>
					<button
						className="hover:bg-slate-200 px-2 py-1 rounded-full"
						onClick={() => {
							const sorted = sortData(cards, "timestamp")!;
							setCards(sorted);
						}}
					>
						Sort by Recent
					</button>
				</div>
			</div>
			{cards.map((card) => (
				<TicketCard
					key={card.ticketId}
					cardData={{ ...card }}
					setCards={setCards}
				/>
			))}
		</div>
	);
}
