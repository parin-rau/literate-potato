//import { useEffect } from "react";
import { useParams } from "react-router-dom";
import SearchContainer from "../components/Card/SearchContainer";
//import { useInitialFetch } from "../hooks/useInitialFetch";

export default function SearchResultsPage() {
	const { query } = useParams();
	const searchQuery = query || "";

	// const searchResults = [];

	// const {data: results} = useInitialFetch(`/api/search/${query}`)

	// useEffect(() => {
	// 	async function getResults() {
	// 		fetch(`/api/search/${query}`, {
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 			},
	// 		});
	// 	}
	// 	getResults();
	// }, [query]);

	return (
		<div className="pt-20">
			<SearchContainer query={searchQuery} />
			{/* {`(${searchResults.length}) search result${
				searchResults.length !== 1 ? "s" : ""
			} for "${query}"`} */}
		</div>
	);
}
