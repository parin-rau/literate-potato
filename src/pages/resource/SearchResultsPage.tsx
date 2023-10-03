import { useParams } from "react-router-dom";
import SearchContainer from "../../components/Card/SearchContainer";

export default function SearchResultsPage() {
	const { query } = useParams();
	const searchQuery = query || "";

	return (
		<div className="pt-20">
			<SearchContainer query={searchQuery} />
		</div>
	);
}
