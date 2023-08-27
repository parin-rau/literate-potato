import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function SearchResultsPage() {
	const { query } = useParams();
	const searchResults = [];

	useEffect(() => {
		async function getResults() {
			fetch(`/api/search/${query}`, {
				headers: {
					"Content-Type": "application/json",
				},
			});
		}
		getResults();
	}, [query]);

	return (
		<div className="pt-20">
			{`(${searchResults.length}) search result${
				searchResults.length !== 1 ? "s" : ""
			} for "${query}"`}
		</div>
	);
}
