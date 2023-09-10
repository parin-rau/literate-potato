import { useEffect, useState } from "react";
import { menuLookup, sortData } from "../../utility/optionLookup";
import { FetchedTicketData, Project, SortMenu } from "../../types";
import FilterSelect from "../Nav/FilterSelect";
import TicketEditor from "../Editor/TicketEditor";
import CardSelector from "../Card/CardSelector";
import CardCategory from "./CardCategory";

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

export default function CardContainer(props: Props) {
	const {
		containerTitle,
		dataKind,
		styles,
		projectId,
		projectTitle,
		setProject,
	} = props;
	const [cards, setCards] = useState<FetchedTicketData[] | Project[]>([]);
	const [sortMeta, setSortMeta] = useState<
		{ property: string; categories: string[] } | undefined
	>();
	const [filters, setFilters] = useState<string[]>([]);
	const [cardCache, setCardCache] = useState<FetchedTicketData[] | Project[]>(
		[]
	);
	const [isFirstFilter, setFirstFilter] = useState(true);
	const [filterMode, setFilterMode] = useState<"OR" | "AND">("AND");

	const sortMenu: SortMenu = menuLookup.sortMenu(handleSort);
	const project = { projectId, projectTitle };

	useEffect(() => {
		async function getPosts() {
			try {
				const endpoint =
					dataKind === "ticket"
						? projectId
							? `/api/project/${projectId}/ticket`
							: "/api/ticket"
						: `/api/project`;
				const accessToken = sessionStorage.getItem("accessToken");

				const res = await fetch(endpoint, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
					credentials: "include",
				});
				const data = await res.json();
				if (res.ok) {
					setCards(data);
				}
			} catch (err) {
				console.error(err);
			}
		}
		getPosts();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [dataKind]);

	useEffect(() => {
		function filterCards() {
			function getFilterMatches(
				cardArr: FetchedTicketData[] | Project[]
			) {
				if (filterMode === "OR") {
					const filteredCards: FetchedTicketData[] = [];
					filters.forEach((mask) => {
						const matches = (cardArr as FetchedTicketData[]).filter(
							(card) => {
								if ("tags" in card) {
									return (
										card.tags.includes(mask) &&
										!filteredCards.includes(card)
									);
								}
							}
						);
						filteredCards.push(...matches);
					});
					console.log(filteredCards);

					return filteredCards;
				}
				if (filterMode === "AND") {
					const filteredCards: FetchedTicketData[] = (
						cardArr as FetchedTicketData[]
					).filter((card) =>
						filters.every((mask) => card.tags.includes(mask))
					);

					console.log(filteredCards);

					return filteredCards;
				}
			}

			if (filters.length === 1 && isFirstFilter) {
				const filtered = getFilterMatches(cards)!;
				setCardCache(cards);
				setFirstFilter(false);
				setCards(filtered);
			} else if (filters.length === 0 && !isFirstFilter) {
				setCards(cardCache);
				setFirstFilter(true);
				setCardCache([]);
			} else if (filters.length > 0 && !isFirstFilter) {
				const filtered = getFilterMatches(cardCache);
				setCards(filtered!);
			}
		}
		filterCards();
	}, [filters, filterMode, setCardCache, setCards]);

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

	function changeFilterMode() {
		const nextMode = filterMode === "OR" ? "AND" : "OR";
		setFilterMode(nextMode);
	}

	function resetFilters() {
		setFilters([]);
	}

	return (
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
						setCards: setCards as React.Dispatch<
							React.SetStateAction<FetchedTicketData[]>
						>,
						project,
						resetFilters,
						setProject,
						setCardCache: setCardCache as React.Dispatch<
							React.SetStateAction<FetchedTicketData[]>
						>,
					}}
					// setCards={setCards}
					// projectId={projectId}
					// setCardCache={
					// 	setCardCache as React.Dispatch<
					// 		React.SetStateAction<FetchedTicketData[]>
					// 	>
					// }
					// resetFilters={resetFilters}
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
	);
}
