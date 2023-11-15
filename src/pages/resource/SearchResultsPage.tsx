import { useParams } from "react-router-dom";
import SearchContainer from "../../components/Search/SearchContainer";

export default function SearchResultsPage() {
	const { query, filter } = useParams();
	const searchQuery = query ?? "";
	const searchFilter = filter ?? "";

	return (
		<div className="pt-20">
			<SearchContainer query={searchQuery} filter={searchFilter} />
		</div>
	);
}
