import { useInitialFetch } from "../../hooks/useInitialFetch";
import { Project } from "../../types";
import SearchResult from "./SearchResult";

type Props = { query: string };

export default function SearchContainer(props: Props) {
	const { query } = props;

	const { data: results, isLoading } = useInitialFetch<Project[]>(
		`/api/search/${query}`
	);

	return (
		!isLoading && (
			<div>
				{`(${results.length}) search result${
					results.length !== 1 ? "s" : ""
				} for "${query}"`}
				{results.map((r) => (
					<SearchResult data={{ ...r }} />
				))}
			</div>
		)
	);
}
