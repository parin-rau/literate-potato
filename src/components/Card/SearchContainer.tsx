import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { SearchResultProps } from "../../types";
import SearchResult from "./SearchResult";

type Props = { query: string; filter?: string };

export default function SearchContainer(props: Props) {
	const { query, filter } = props;

	const { data: results, isLoading } = useInitialFetch<SearchResultProps[]>(
		filter ? `/api/search/${query}/${filter}` : `/api/search/${query}`
	);

	return (
		!isLoading && (
			<div className="container mx-auto flex flex-col bg-slate-100 dark:bg-neutral-900 p-2 rounded-lg gap-2">
				<>
					<p className="pb-2">
						{`(${results.length}) search result${
							results.length !== 1 ? "s" : ""
						} for "${query}" ${filter}`}
					</p>
					{results.map((r, index) => (
						<SearchResult key={index} {...{ ...r }} />
					))}
				</>
			</div>
		)
	);
}
