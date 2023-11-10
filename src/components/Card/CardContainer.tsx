import { useEffect, useState } from "react";
import { menuLookup, sortData } from "../../utility/optionLookup";
import { FetchedTicketData, Project, SortMenu } from "../../types";
import FilterSelect from "../Nav/FilterSelect";
import TicketEditor from "../Editor/TicketEditor";
import CardSelector from "./CardSelector";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { useGetter } from "../../hooks/utility/useGetter";
import { LoadingSpinner } from "../Nav/Loading";
import ToggleButton from "../Nav/ToggleButton";
import CollapseIcon from "../Svg/CollapseIcon";
import { useAuth } from "../../hooks/auth/useAuth";

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
	group?: { groupId: string; groupTitle: string };
	setCardsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
} & (TicketProps | ProjectProps);

export default function CardContainer<
	T extends FetchedTicketData | Project,
	// | (FetchedTicketData & { dataKind: "ticket" })
	// | (Project & { dataKind: "project" })
>(props: Props) {
	const {
		containerTitle,
		dataKind,
		styles,
		projectId,
		projectTitle,
		setProject,
		setCardsLoading,
		group,
	} = props;

	const { user } = useAuth();
	const [sortMeta, setSortMeta] = useState<
		{ property: string; categories: string[] } | undefined
	>();
	const [filters, setFilters] = useState<string[]>([]);
	const [cardCache, setCardCache] = useState<T[]>([]);
	const [isFirstFilter, setFirstFilter] = useState(true);
	const [filterMode, setFilterMode] = useState<"OR" | "AND">("AND");
	const [hideContainer, setHideContainer] = useState(false);

	const sortMenu: SortMenu = menuLookup.sortMenu(handleSort);
	const project = { projectId, projectTitle };

	const endpoint =
		dataKind === "ticket"
			? projectId
				? `/api/ticket/project/${projectId}`
				: `/api/ticket/user/${user.current!.userId}`
			: group?.groupId
			? `/api/project/group/${group.groupId}`
			: `/api/project/user/${user.current!.userId}`;

	const {
		data: cards,
		setData: setCards,
		isLoading,
	} = useInitialFetch<T[]>(endpoint);

	const getStableCards = useGetter({ cards, cardCache });

	useEffect(() => {
		if (dataKind === "ticket" && setCardsLoading && !isLoading)
			setCardsLoading(false);
	}, [dataKind, isLoading, setCardsLoading]);

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

	function handleHideToggle() {
		setHideContainer((prev) => !prev);
	}

	return isLoading ? (
		<LoadingSpinner />
	) : (
		<div
			className={
				"@container/cards container mx-auto flex flex-col bg-slate-100 dark:bg-neutral-900 p-2 rounded-lg gap-2 " +
				styles
			}
		>
			<TicketEditor
				{...{
					dataKind,
					setCards,
					project,
					group,
					resetFilters,
					setProject,
					setCardCache,
				}}
			/>

			<div className="flex flex-row justify-between items-end">
				<div className="flex flex-row gap-2 items-center">
					<ToggleButton onClick={handleHideToggle}>
						<CollapseIcon isCollapsed={hideContainer} />
						<h1 className="font-semibold text-2xl ">
							{filters.length > 0
								? `Filtering Results (${cards.length})`
								: `${containerTitle} (${cards.length})`}
						</h1>
					</ToggleButton>
				</div>
				<div className="flex flex-row items-baseline gap-2">
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
			{!hideContainer && (
				<>
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
								setCardsLoading,
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
}
