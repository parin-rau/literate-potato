import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { SearchResultProps } from "../../types";
import SortMenu from "./SortMenu";
import SearchResult from "./SearchResult";
import { sortByKey } from "../../utility/sortData";
import FilterMenu from "./FilterMenu";

type Props = { query: string; filter?: string };
// type Value = string | number | { [key: string]: string | number };
// type GenericResults = { [key: string]: Value };

export default function SearchContainer(props: Props) {
	const { query, filter } = props;

	const {
		data: results,
		setData: setResults,
		isLoading,
	} = useInitialFetch<SearchResultProps[]>(
		filter ? `/api/search/${query}/${filter}` : `/api/search/${query}`
	);

	const sortFns = [
		{
			label: "Title, A -> Z",
			fn: (r: SearchResultProps[]) => {
				const sorted = sortByKey(r, "data.title");
				setResults(sorted);
			},
		},
		{
			label: "Title, Z -> A",
			fn: (r: SearchResultProps[]) => {
				const sorted = sortByKey(r, "data.title", -1);
				setResults(sorted);
			},
		},
		{
			label: "Oldest First",
			fn: (r: SearchResultProps[]) => {
				const sorted = sortByKey(r, "data.timestamp");
				setResults(sorted);
			},
		},
		{
			label: "Newest First",
			fn: (r: SearchResultProps[]) => {
				const sorted = sortByKey(r, "data.timestamp", -1);
				setResults(sorted);
			},
		},
		{
			label: "Type, A -> Z",
			fn: (r: SearchResultProps[]) => {
				const sorted = sortByKey(r, "meta.kind");
				setResults(sorted);
			},
		},
		{
			label: "Type, Z -> A",
			fn: (r: SearchResultProps[]) => {
				const sorted = sortByKey(r, "meta.kind", -1);
				setResults(sorted);
			},
		},
	];

	return (
		!isLoading && (
			<div className="container mx-auto flex flex-col bg-slate-100 dark:bg-neutral-900 p-2 rounded-lg gap-2">
				<>
					<div className="flex flex-row justify-between items-baseline p-2">
						<p className="">
							{`(${results.length}) search result${
								results.length !== 1 ? "s" : ""
							} for "${query}"`}
						</p>
						<div className="flex flex-row gap-6 items-baseline">
							<FilterMenu {...{ results, setResults }} />
							<SortMenu {...{ results, sortFns }} />
						</div>
					</div>
					{results.map((r, index) => (
						<SearchResult key={index} {...{ ...r }} />
					))}
				</>
			</div>
		)
	);
}
