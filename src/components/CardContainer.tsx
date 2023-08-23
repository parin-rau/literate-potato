import { useEffect, useState } from "react";
import TicketCard from "./TicketCard";
import { sortData } from "../utility/optionLookup";
import { FetchedTicketData, Project } from "../types";
import MenuDropdown from "./MenuDropdown";
import ProjectCard from "./ProjectCard";
import TagsDisplay from "./TagsDisplay";
import SearchBar from "./SearchBar";

type Props =
	| {
			cards: FetchedTicketData[];
			setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
			containerTitle: string;
			dataKind: "ticket";
			projectId?: string;
	  }
	| {
			cards: Project[];
			setCards: React.Dispatch<React.SetStateAction<Project[]>>;
			containerTitle: string;
			dataKind: "project";
			projectId?: string;
	  };

type SortMenu = {
	name: string;
	arrowDirection: "up" | "down";
	fn: () => void;
}[];

export default function CardContainer(props: Props) {
	const [sortMeta, setSortMeta] = useState<
		{ property: string; categories: string[] } | undefined
	>();
	const [filter, setFilter] = useState<string[]>([]);
	const { cards, setCards, containerTitle, dataKind, projectId } = props;
	const sortMenu: SortMenu = [
		{
			name: "Priority",
			arrowDirection: "up",
			fn: () => handleSort("priority", "asc"),
		},
		{
			name: "Priority",
			arrowDirection: "down",
			fn: () => handleSort("priority", "desc"),
		},
		{
			name: "Progress",
			arrowDirection: "up",
			fn: () => handleSort("taskStatus", "asc"),
		},
		{
			name: "Progress",
			arrowDirection: "down",
			fn: () => handleSort("taskStatus", "desc"),
		},
		{
			name: "Recent",
			arrowDirection: "up",
			fn: () => handleSort("timestamp", "asc"),
		},
		{
			name: "Recent",
			arrowDirection: "down",
			fn: () => handleSort("timestamp", "desc"),
		},
	];

	useEffect(() => {
		async function getPosts() {
			try {
				const endpoint =
					dataKind === "ticket"
						? projectId
							? `/api/project/${projectId}/ticket`
							: "/api/ticket"
						: `/api/project`;
				const res = await fetch(endpoint, {
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

	function getSortLabel(cardDataArr: typeof cards) {
		if (sortMeta) {
			const labels = cardDataArr.map((cardData) => {
				const targetProperty =
					cardData[sortMeta.property as keyof FetchedTicketData];
				const sortLabel =
					sortMeta.categories.find(
						(category) => category === targetProperty
					) || "Uncategorized";
				return sortLabel;
			});
			return labels;
		}
	}

	function CardSelector(
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
					filter={filter}
					setFilter={setFilter}
				/>
			));
		}
		if (dataKind === "project") {
			return (cards as Project[]).map((card) => (
				<ProjectCard key={card.projectId} cardData={{ ...card }} />
			));
		}
	}

	function deleteTag(id: number) {
		setFilter((prev) => prev.filter((_tag, index) => index !== id));
	}

	function FilterSelect() {
		return (
			<div className="flex rounded-md bg-slate-200 items-center px-2 space-x-2">
				<SearchBar setFilter={setFilter} placeholder="Filter by Tags" />
				{filter.length > 0 && (
					<TagsDisplay tags={filter} deleteTag={deleteTag} />
				)}
			</div>
		);
	}

	return (
		<div className="@container/cards container mx-auto flex flex-col bg-slate-100 px-2 py-2 rounded-lg">
			<div className="flex flex-row justify-between items-center">
				<h1 className="text-bold text-3xl my-4">
					{filter.length > 0 ? "Filtering Results" : containerTitle}
				</h1>
				<div className="flex flex-row items-center space-x-2">
					<FilterSelect />
					<MenuDropdown
						menuTitle="Sort"
						menuTitleFont="text-xl"
						options={sortMenu}
					/>
				</div>
			</div>
			<span>{sortMeta && getSortLabel(cards)}</span>
			<div className="grid grid-cols-1 @3xl/cards:grid-cols-2 @7xl/cards:grid-cols-3 place-items-stretch-stretch items-stretch sm:container mx-auto ">
				{CardSelector(dataKind, cards)}
			</div>
		</div>
	);
}
