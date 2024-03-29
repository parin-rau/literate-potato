import SearchBar from "./SearchBar";
import TagsDisplay from "../Display/TagsDisplay";
import { FetchedTicketData, Project, SortMenu } from "../../types";
import MenuDropdown from "./MenuDropdown";
import { firstLetterCap } from "../../utility/charCaseFunctions";

type Props = {
	filters: string[];
	setFilters: React.Dispatch<React.SetStateAction<string[]>>;
	deleteFilterTag: (_id: number) => void;
	filterMode: string;
	changeFilterMode: () => void;
	resetFilters: () => void;
	sortMenu?: SortMenu;
	filterCards?: (_t: string[]) => void;
	hideTagsInput?: boolean;
	cards?: FetchedTicketData[] | Project[];
};

export default function FilterSelect(props: Props) {
	const {
		filters,
		setFilters,
		deleteFilterTag,
		filterMode,
		changeFilterMode,
		resetFilters,
		sortMenu,
		filterCards,
		hideTagsInput,
		cards,
	} = props;

	return (
		<div className="flex flex-col items-end sm:items-center sm:flex-row flex-wrap rounded-md border dark:border-zinc-800 shadow-md px-2 space-x-2 dark:bg-neutral-900">
			{!hideTagsInput && (
				<SearchBar
					setFilters={setFilters}
					placeholder="Filter by Tags"
				/>
			)}
			{filters.length > 0 && (
				<>
					<TagsDisplay
						tags={filters}
						deleteTag={deleteFilterTag}
						filterCards={filterCards}
					/>
					<div className="grid grid-cols-2 justify-items-center divide-x divide-neutral-700">
						<button
							className="px-2 py-1 hover:bg-slate-300 hover:rounded-full dark:hover:bg-zinc-700"
							type="button"
							onClick={changeFilterMode}
						>
							{firstLetterCap(filterMode)}
						</button>
						<button
							className="px-2 py-1 hover:bg-slate-300 hover:rounded-full dark:hover:bg-zinc-700"
							type="button"
							onClick={resetFilters}
						>
							Reset
						</button>
					</div>
				</>
			)}
			{sortMenu && (
				<MenuDropdown
					menuTitle="Sort"
					menuTitleFont="text-lg"
					options={sortMenu}
					cards={cards}
				/>
			)}
		</div>
	);
}
