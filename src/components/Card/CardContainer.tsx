import { useEffect, useState } from "react";
import {
	sortItemsOptions,
	sortProjectOptions,
	sortTicketOptions,
} from "../../utility/optionLookup";
import {
	FetchedTicketData,
	GenericFn,
	Project,
	SortableObj,
} from "../../types";
import FilterSelect from "../Nav/FilterSelect";
import TicketEditor from "../Editor/TicketEditor";
import CardSelector from "./CardSelector";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
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

type T = FetchedTicketData | Project;
type CProps = TicketProps | ProjectProps;
type P = { projectId: string; projectTitle: string } | undefined;

type Props = {
	styles?: string;
	group?: { groupId: string; groupTitle: string };
	isSummary?: boolean;
	hideEditor?: boolean;
	hideUncategorized?: boolean;
	setCardsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	dataUrl?: string;
	isCollapsed?: boolean;
} & CProps;

export default function CardContainer(props: Props) {
	const {
		containerTitle,
		dataKind,
		styles,
		projectId,
		projectTitle,
		setProject,
		setCardsLoading,
		group,
		isSummary,
		hideEditor,
		hideUncategorized,
		dataUrl,
		isCollapsed,
	} = props;

	const { user } = useAuth();
	const [filters, setFilters] = useState<string[]>([]);
	const [cardCache, setCardCache] = useState<T[]>([]);
	const [isFirstFilter, setFirstFilter] = useState(true);
	const [filterMode, setFilterMode] = useState<"OR" | "AND">("AND");
	const [hideContainer, setHideContainer] = useState(isCollapsed ?? false);

	const project: P =
		projectId && projectTitle ? { projectId, projectTitle } : undefined;

	const endpoint =
		dataUrl ??
		(dataKind === "ticket"
			? projectId
				? `/api/ticket/project/${projectId}`
				: isSummary
				? `/api/ticket/user/${user.current!.userId}/summary`
				: `/api/ticket/user/${user.current!.userId}`
			: group?.groupId
			? `/api/project/group/${group.groupId}`
			: isSummary
			? `/api/project/user/${user.current!.userId}/summary`
			: `/api/project/user/${user.current!.userId}`);

	const {
		data: cards,
		setData: setCards,
		isLoading,
	} = useInitialFetch<T[]>(endpoint);

	const sortMenu = [
		...sortItemsOptions(
			setCards as unknown as React.Dispatch<
				React.SetStateAction<SortableObj[]>
			>
		),
		...(dataKind === "ticket"
			? sortTicketOptions(
					setCards as React.Dispatch<
						React.SetStateAction<FetchedTicketData[]>
					>
			  )
			: sortProjectOptions(
					setCards as React.Dispatch<React.SetStateAction<Project[]>>
			  )),
	] as { label: string; fn: GenericFn }[];

	useEffect(() => {
		if (dataKind === "ticket" && setCardsLoading && !isLoading)
			setCardsLoading(false);

		if (
			dataKind === "project" &&
			setCardsLoading &&
			!isLoading &&
			hideUncategorized
		)
			setCardsLoading(false);
	}, [dataKind, hideUncategorized, isLoading, setCardsLoading]);

	function filterCards(filters: string[], mode: "AND" | "OR" = filterMode) {
		function getFilterMatches(cardArr: T[]) {
			switch (mode) {
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
					return cards;
			}
		}

		switch (true) {
			case filters.length === 1 && isFirstFilter: {
				const filtered = getFilterMatches(cards);
				setCardCache(cards);
				setFirstFilter(false);
				setCards(filtered);
				break;
			}
			case filters.length === 0 && !isFirstFilter: {
				setCards(cardCache);
				setFirstFilter(true);
				setCardCache([]);
				break;
			}
			case filters.length > 0 && !isFirstFilter: {
				const filtered = getFilterMatches(cardCache);
				setCards(filtered);
				break;
			}
			default:
				break;
		}
	}

	function deleteFilterTag(id: number) {
		setFilters((prev) => prev.filter((_tag, index) => index !== id));
	}

	function changeFilterMode() {
		const nextMode = filterMode === "OR" ? "AND" : "OR";
		setFilterMode(nextMode);
		filterCards(filters, nextMode);
	}

	function resetFilters() {
		setFilters([]);
		filterCards([]);
		setFilterMode("AND");
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
			{!hideEditor && (
				<TicketEditor
					{...{
						dataKind: dataKind as T extends FetchedTicketData
							? "ticket"
							: "project",
						setCards: setCards as T extends FetchedTicketData
							? React.Dispatch<
									React.SetStateAction<FetchedTicketData[]>
							  >
							: React.Dispatch<React.SetStateAction<Project[]>>,
						project: project as T extends Project
							? Required<P>
							: undefined,
						group,
						resetFilters,
						setProject: setProject as T extends Project
							? React.Dispatch<React.SetStateAction<Project[]>>
							: undefined,
						setCardCache:
							setCardCache as T extends FetchedTicketData
								? React.Dispatch<
										React.SetStateAction<
											FetchedTicketData[]
										>
								  >
								: React.Dispatch<
										React.SetStateAction<Project[]>
								  >,
						createOnly: true,
					}}
				/>
			)}

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
							filterCards,
							hideTagsInput: dataKind !== "ticket",
							cards: cards as T extends FetchedTicketData
								? FetchedTicketData[]
								: Project[],
						}}
					/>
				</div>
			</div>
			{!hideContainer && (
				<>
					<div className="grid grid-cols-1 @3xl/cards:grid-cols-2 @7xl/cards:grid-cols-3 place-items-stretch sm:container mx-auto ">
						<CardSelector
							{...{
								dataKind:
									dataKind as T extends FetchedTicketData
										? "ticket"
										: "project",
								cards: cards as T extends FetchedTicketData
									? FetchedTicketData[]
									: Project[],
								setCards:
									setCards as T extends FetchedTicketData
										? React.Dispatch<
												React.SetStateAction<
													FetchedTicketData[]
												>
										  >
										: React.Dispatch<
												React.SetStateAction<Project[]>
										  >,
								setCardCache:
									setCardCache as T extends FetchedTicketData
										? React.Dispatch<
												React.SetStateAction<
													FetchedTicketData[]
												>
										  >
										: React.Dispatch<
												React.SetStateAction<Project[]>
										  >,
								filters,
								setFilters: setFilters as React.Dispatch<
									React.SetStateAction<string[]>
								>,
								setProject,
								setCardsLoading,
								hideUncategorized,
								filterCards,
							}}
						/>
					</div>
				</>
			)}
		</div>
	);
}
