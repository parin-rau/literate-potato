import { useEffect, useState } from "react";
import { menuLookup, sortData } from "../../utility/optionLookup";
import { FetchedTicketData, Project, SortMenu } from "../../types";
import FilterSelect from "../Nav/FilterSelect";
import TicketEditor from "../Editor/TicketEditor";
import CardSelector from "./CardSelector";
import CardCategory from "./CardCategory";
import { useInitialFetch } from "../../hooks/useInitialFetch";
import { useGetter } from "../../hooks/useGetter";

type TicketProps = {
	containerTitle: string;
	dataKind: "ticket";
	projectId?: string;
	projectTitle?: string;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
};

type ProjectProps = {
	containerTitle: string;
	dataKind: "project";
	projectId?: string;
	projectTitle?: never;
	setProject?: never;
};

type Props = {
	styles?: string;
} & (TicketProps | ProjectProps);

export default function CardContainer<
	T extends
		| (FetchedTicketData & { dataKind: "ticket" })
		| (Project & { dataKind: "project" })
>(props: Props) {
	const {
		containerTitle,
		dataKind,
		styles,
		projectId,
		projectTitle,
		setProject,
	} = props;

	const [sortMeta, setSortMeta] = useState<
		{ property: string; categories: string[] } | undefined
	>();
	const [filters, setFilters] = useState<string[]>([]);
	const [cardCache, setCardCache] = useState<T[]>([]);
	const [isFirstFilter, setFirstFilter] = useState(true);
	const [filterMode, setFilterMode] = useState<"OR" | "AND">("AND");

	const sortMenu: SortMenu = menuLookup.sortMenu(handleSort);
	const project = { projectId, projectTitle };

	const endpoint =
		dataKind === "ticket"
			? projectId
				? `/api/ticket/project/${projectId}`
				: "/api/ticket"
			: `/api/project`;

	const {
		data: cards,
		setData: setCards,
		isLoading,
	} = useInitialFetch<T[]>(endpoint);

	const getStableCards = useGetter({ cards, cardCache });

	useEffect(() => {
		function filterCards() {
			const { cards: stableCards, cardCache: stableCardCache } =
				getStableCards();

			function getFilterMatches(cardArr: T[]) {
				switch (filterMode) {
					case "OR": {
						const filteredCards: T[] = [];
						filters.forEach((mask) => {
							const matches = cardArr.filter((card) => {
								if ("tags" in card) {
									return (
										card.tags.includes(mask) &&
										!filteredCards.includes(card)
									);
								}
							});
							filteredCards.push(...matches);
						});
						return filteredCards;
					}
					case "AND": {
						const filteredCards: T[] = cardArr.filter((card) => {
							if ("tags" in card)
								return filters.every((mask) =>
									card.tags.includes(mask)
								);
						});
						return filteredCards;
					}
					default:
						return stableCards;
				}
			}

			switch (true) {
				case filters.length === 1 && isFirstFilter: {
					const filtered = getFilterMatches(stableCards);
					setCardCache(stableCards);
					setFirstFilter(false);
					setCards(filtered);
					break;
				}
				case filters.length === 0 && !isFirstFilter: {
					setCards(stableCardCache);
					setFirstFilter(true);
					setCardCache([]);
					break;
				}
				case filters.length > 0 && !isFirstFilter: {
					const filtered = getFilterMatches(stableCardCache);
					setCards(filtered);
					break;
				}
				default:
					break;
			}
		}
		filterCards();
	}, [
		filters,
		filterMode,
		setCardCache,
		setCards,
		isFirstFilter,
		getStableCards,
	]);

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
			setCards(sortedData as T[]);
			setSortMeta(sortCategories);
		}
	}

	function getSortLabel(cardDataArr: typeof cards) {
		if (sortMeta) {
			const labels = cardDataArr.map((cardData) => {
				const targetProperty = cardData[sortMeta.property as keyof T];
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

	function changeFilterMode() {
		const nextMode = filterMode === "OR" ? "AND" : "OR";
		setFilterMode(nextMode);
	}

	function resetFilters() {
		setFilters([]);
	}

	return (
		!isLoading && (
			<div
				className={
					"@container/cards container mx-auto flex flex-col bg-slate-100 px-2 py-2 rounded-lg space-y-1 " +
					styles
				}
			>
				<div
					className={
						!projectId
							? "grid grid-cols-1 gap-2 sm:grid-cols-2 sm:items-start"
							: ""
					}
				>
					<TicketEditor
						{...{
							dataKind,
							setCards,
							//setCards as React.Dispatch<
							//	React.SetStateAction<T[]>
							//>,
							project,
							resetFilters,
							setProject,
							setCardCache,
							// : setCardCache as React.Dispatch<
							// 	React.SetStateAction<T[]>
							// >,
						}}
					/>
					{!projectId && (
						<TicketEditor
							dataKind="ticket"
							project={{ projectId: "", projectTitle: "" }}
						/>
					)}
				</div>
				<div className="flex flex-row justify-between items-baseline mx-1">
					<h1 className="font-semibold text-3xl my-4">
						{filters.length > 0
							? `Filtering Results (${cards.length})`
							: containerTitle}
					</h1>
					<div className="flex flex-row items-baseline space-x-2">
						<FilterSelect
							{...{
								filters,
								setFilters,

								deleteFilterTag,
								filterMode,
								changeFilterMode,
								resetFilters,
								sortMenu,
							}}
						/>
					</div>
				</div>
				<span>{sortMeta && getSortLabel(cards)}</span>
				<div className="grid grid-cols-1 @3xl/cards:grid-cols-2 @7xl/cards:grid-cols-3 place-items-stretch sm:container mx-auto ">
					<CardSelector
						{...{
							dataKind,
							cards,
							setCards,
							setCardCache,
							filters,
							setFilters,

							setProject,
						}}
					/>
				</div>
			</div>
		)
	);
}
