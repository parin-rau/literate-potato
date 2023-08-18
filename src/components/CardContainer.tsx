import { useEffect, useState } from "react";
import TicketCard from "./TicketCard";
import { sortData } from "../utility/optionLookup";
import { FetchedTicketData, Project } from "../types";
import MenuDropdown from "./MenuDropdown";
import ProjectCard from "./ProjectCard";

type Props = {
	cards: FetchedTicketData[] | Project[];
	setCards:
		| React.Dispatch<React.SetStateAction<FetchedTicketData[]>>
		| React.Dispatch<React.SetStateAction<Project[]>>;
	containerTitle: string;
	dataKind: "ticket" | "project";
};

type SortMenu = {
	name: string;
	arrowDirection: "up" | "down";
	function: () => void;
}[];

export default function CardContainer(props: Props) {
	const [sortMeta, setSortMeta] = useState<
		{ property: string; categories: string[] } | undefined
	>();
	const { cards, setCards, containerTitle, dataKind } = props;
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
				const res = await fetch(`/api/${dataKind}`, {
					headers: { "Content-Type": "application/json" },
				});
				const data = await res.json();
				setCards(data);
			} catch (err) {
				console.error(err);
			}
		}
		getPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataKind]);

	function handleSort(
		sortKind: "priority" | "taskStatus" | "timestamp",
		direction: "asc" | "desc"
	) {
		if (dataKind === "ticket") {
			const { sortedData, sortCategories } = sortData(
				cards as FetchedTicketData[],
				sortKind,
				direction
			)!;
			setCards(sortedData);
			setSortMeta(sortCategories);
		}
	}

	// function getSortLabel(cardDataArr: FetchedTicketData[]) {
	// 	if (sortMeta) {
	// 		const labels = cardDataArr.map((cardData) => {
	// 			const targetProperty =
	// 				cardData[sortMeta.property as keyof FetchedTicketData];
	// 			const sortLabel =
	// 				sortMeta.categories.find(
	// 					(category) => category === targetProperty
	// 				) || "Uncategorized";
	// 			return sortLabel;
	// 		});
	// 		return labels;
	// 	}
	// }

	function cardSelector(
		dataKind: string,
		cards: FetchedTicketData[] | Project[]
	) {
		if (dataKind === "ticket") {
			return (cards as FetchedTicketData[]).map((card) => (
				<TicketCard
					key={card.ticketId}
					cardData={{ ...card }}
					setCards={
						setCards as React.Dispatch<
							React.SetStateAction<FetchedTicketData[]>
						>
					}
				/>
			));
		}
		if (dataKind === "project") {
			return (cards as Project[]).map((card) => (
				<ProjectCard key={card.projectId} cardData={{ ...card }} />
			));
		}
	}

	return (
		<div className="sm:container mx-auto flex flex-col">
			<div className="flex flex-row justify-between items-center">
				<h1 className="text-bold text-3xl my-4">{containerTitle}</h1>
				<MenuDropdown
					menuTitle="Sort"
					menuTitleFont="text-xl"
					options={sortMenu}
				/>
			</div>
			{/* <span>{getSortLabel(cards)}</span> */}
			{
				cardSelector(dataKind, cards)
				/* {cards.map((card) => (
				<TicketCard
					key={card.ticketId}
					cardData={{ ...card }}
					setCards={setCards}
				/>
			))} */
			}
		</div>
	);
}
