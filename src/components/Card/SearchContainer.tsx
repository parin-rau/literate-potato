import { useInitialFetch } from "../../hooks/useInitialFetch";
import { SearchResultProps } from "../../types";
import SearchResult from "./SearchResult";

type Props = { query: string };

export default function SearchContainer(props: Props) {
	const { query } = props;

	const { data: results, isLoading } = useInitialFetch<SearchResultProps[]>(
		`/api/search/${query}`
	);

	return (
		!isLoading && (
			<div className="container mx-auto flex flex-col bg-slate-100 dark:bg-neutral-900 p-2 rounded-lg gap-1">
				{`(${results.length}) search result${
					results.length !== 1 ? "s" : ""
				} for "${query}"`}
				{results.map((r, index) => (
					<SearchResult key={index} {...{ ...r }} />
				))}
			</div>
		)
	);
}
