import { useEffect, useState } from "react";
import TicketCard from "../Card/TicketCard";
import { menuLookup, sortData } from "../../utility/optionLookup";
import { FetchedTicketData, Project, SortMenu } from "../../types";
import MenuDropdown from "../Nav/MenuDropdown";
import ProjectCard from "../Card/ProjectCard";
import TagsDisplay from "../Display/TagsDisplay";
import SearchBar from "../Nav/SearchBar";

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

export default function CardContainer(props: Props) {
	const [sortMeta, setSortMeta] = useState<
		{ property: string; categories: string[] } | undefined
	>();
	const [filters, setFilters] = useState<string[]>([]);
	const [cardCache, setCardCache] = useState<FetchedTicketData[] | Project[]>(
		[]
	);
	const [isFirstFilter, setFirstFilter] = useState(true);
	const { cards, setCards, containerTitle, dataKind, projectId } = props;

	const sortMenu: SortMenu = menuLookup.sortMenu(handleSort);

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

	function deleteFilterTag(id: number) {
		setFilters((prev) => prev.filter((_tag, index) => index !== id));
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
					filters={filters}
					setFilters={setFilters}
				/>
			));
		}
		if (dataKind === "project") {
			return (cards as Project[]).map((card) => (
				<ProjectCard key={card.projectId} cardData={{ ...card }} />
			));
		}
	}

	useEffect(() => {
		function filterCards() {
			function getFilterMatches(cardArr: FetchedTicketData[]) {
				const filteredCards: FetchedTicketData[] = [];
				filters.forEach((tag) => {
					const matches = cardArr.filter(
						(card) =>
							card.tags.includes(tag) &&
							!filteredCards.includes(card)
					);
					filteredCards.push(...matches);
				});
				// if all active filter tags are not included on card, remove card

				// if (filteredCards.includes()) {

				// }
				return filteredCards;
			}

			if (filters.length === 1 && isFirstFilter) {
				const filtered: FetchedTicketData[] = getFilterMatches(cards);
				setCardCache(cards);
				setFirstFilter(false);
				setCards(filtered);
			} else if (filters.length === 0 && !isFirstFilter) {
				setCards(cardCache);
				setFirstFilter(true);
				setCardCache([]);
			} else {
				const filtered: FetchedTicketData[] =
					getFilterMatches(cardCache);
				setCards(filtered);
			}
		}
		filterCards();
	}, [filters]);

	function FilterSelect() {
		return (
			<div className="flex flex-col sm:flex-row flex-wrap rounded-md border shadow-md items-center px-2 space-x-2">
				<SearchBar
					setFilters={setFilters}
					placeholder="Filter by Tags"
				/>
				{filters.length > 0 && (
					<TagsDisplay tags={filters} deleteTag={deleteFilterTag} />
				)}
			</div>
		);
	}

	return (
		<div className="@container/cards container mx-auto flex flex-col bg-slate-100 px-2 py-2 rounded-lg">
			<div className="flex flex-row justify-between items-baseline">
				<h1 className="text-bold text-3xl my-4">
					{filters.length > 0 ? "Filtering Results" : containerTitle}
				</h1>
				<div className="flex flex-row items-baseline space-x-2">
					<FilterSelect />
					<MenuDropdown
						menuTitle="Sort"
						menuTitleFont="text-xl"
						options={sortMenu}
					/>
				</div>
			</div>
			<span>{sortMeta && getSortLabel(cards)}</span>
			<div className="grid grid-cols-1 @3xl/cards:grid-cols-2 @7xl/cards:grid-cols-3 place-items-stretch sm:container mx-auto ">
				{CardSelector(dataKind, cards)}
			</div>
		</div>
	);
}
