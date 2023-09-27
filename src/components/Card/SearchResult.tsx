import { Link } from "react-router-dom";
import { SearchResultProps } from "../../types";

export default function SearchResult(props: SearchResultProps) {
	const { data, meta } = props;

	return (
		<Link
			className="p-4 rounded-md border-2 dark:border-zinc-400 border-black"
			to={`/${meta.kind}/${data.id}`}
		>
			<p>title: {data.title}</p>
			<p>type: {meta.kind}</p>
			<p>id: {data.id}</p>
			{data.timestamp && <p>timestamp: {data.timestamp}</p>}
			{data.description && <p>description: {data.description}</p>}
		</Link>
	);
}
