import { Link } from "react-router-dom";
import { SearchResultProps } from "../../types";
import timestampDisplay, {
	longDateDisplay,
} from "../../utility/timestampDisplay";
import { titleCap } from "../../utility/charCaseFunctions";

export default function SearchResult(props: SearchResultProps) {
	const { data, meta } = props;

	return (
		<Link
			className="p-4 rounded-md border-2 dark:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-900 dark:hover:border-zinc-400 border-black"
			to={`/${meta.kind === "subtask" ? "ticket" : meta.kind}/${data.id}`}
		>
			<ul className="flex flex-col gap-1">
				<li className="flex flex-row gap-4 pb-1 dark:text-zinc-400 text-zinc-600 items-baseline">
					<span className="text-lg font-semibold dark:text-slate-100 text-black">
						{data.title}
					</span>

					<span className="">
						<i>{titleCap(meta.kind)}</i>
					</span>
				</li>
				{data.timestamp && (
					<li>Created: {longDateDisplay(data.timestamp)}</li>
				)}
				{data.description && <li>Description: {data.description}</li>}
			</ul>
		</Link>
	);
}
