import { useEffect, useState } from "react";
import TicketCard from "./TicketCard";
import { sortData } from "../utility/optionLookup";
import { FetchedTicketData } from "../types";
import MenuDropdown from "./MenuDropdown";

type Props = {
	cards: FetchedTicketData[];
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	containerTitle: string;
};

type SortMenu = {
	name: string;
	arrowDirection: "up" | "down";
	function: () => void;
}[];

export default function CardContainer(props: Props) {
	const [sortKind, setSortKind] = useState<
		{ property: string; categories: string[] } | undefined
	>();
	const { cards, setCards, containerTitle } = props;
	const sortMenu: SortMenu = [
		{
			name: "Priority",
			arrowDirection: "up",
			function: () => handleSort("priority", "asc"),
		},
		{
			name: "Priority",
			arrowDirection: "down",
			function: () => handleSort("priority", "desc"),
		},
		{
			name: "Progress",
			arrowDirection: "up",
			function: () => handleSort("taskStatus", "asc"),
		},
		{
			name: "Progress",
			arrowDirection: "down",
			function: () => handleSort("taskStatus", "desc"),
		},
		{
			name: "Recent",
			arrowDirection: "up",
			function: () => handleSort("timestamp", "asc"),
		},
		{
			name: "Recent",
			arrowDirection: "down",
			function: () => handleSort("timestamp", "desc"),
		},
	];

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

	function handleSort(
		sortKind: "priority" | "taskStatus" | "timestamp",
		direction: "asc" | "desc"
	) {
		const { sortedData, sortCategories } = sortData(
			cards,
			sortKind,
			direction
		)!;
		setCards(sortedData);
		setSortKind(sortCategories);
	}

	function getSortLabel(cardData: FetchedTicketData) {
		if (sortKind) {
			const target = cardData[sortKind?.property];
			const sortLabel = sortKind?.categories.find(
				(category) => category === target
			);
			return sortLabel;
		}
	}

	return (
		<div className="sm:container mx-auto flex flex-col">
			<div className="flex flex-row justify-between items-center">
				<h1 className="text-bold text-3xl my-4">{containerTitle}</h1>
				<MenuDropdown menuTitle="Sort" options={sortMenu} />
			</div>
			{cards.map((card) => (
				<>
					<span>{getSortLabel(card)}</span>
					<TicketCard
						key={card.ticketId}
						cardData={{ ...card }}
						setCards={setCards}
					/>
				</>
			))}
		</div>
	);
}
