import { Link } from "react-router-dom";
import { SearchResultProps } from "../../types";
import timestampDisplay from "../../utility/timestampDisplay";
import { titleCap } from "../../utility/charCaseFunctions";

export default function SearchResult(props: SearchResultProps) {
	const { data, meta } = props;

	return (
		<Link
			className="p-4 rounded-md border-2 dark:border-zinc-600 dark:hover:border-zinc-400 border-black"
			to={`/${meta.kind === "subtask" ? "ticket" : meta.kind}/${data.id}`}
		>
			<ul className="flex flex-col gap-1">
				<li className="font-semibold text-lg pb-2">{data.title}</li>
				<li>Resource Type: {titleCap(meta.kind)}</li>
				<li>Resrouce ID: {data.id}</li>
				{data.timestamp && (
					<li>Created {timestampDisplay(data.timestamp)}</li>
				)}
				{data.description && <li>Description: {data.description}</li>}
			</ul>
		</Link>
	);
}
