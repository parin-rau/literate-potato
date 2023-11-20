import { useState, useRef, useEffect } from "react";
import { SearchResultProps } from "../../types";
import { titleCap } from "../../utility/charCaseFunctions";

interface Props {
	results: SearchResultProps[];
	setResults: React.Dispatch<React.SetStateAction<SearchResultProps[]>>;
}

const filterResults = (results: SearchResultProps[], filters: string[]) => {
	const filtered = results.filter((r) => filters.includes(r.meta.kind));
	return filtered;
};

const options = ["ticket", "subtask", "project", "group", "user"];

export default function FilterMenu({ results, setResults }: Props) {
	const [isOpen, setOpen] = useState(false);
	const [filters, setFilters] = useState<string[]>([]);
	const [cache, setCache] = useState<SearchResultProps[]>([]);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleOpen = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		state?: boolean
	) => {
		e.preventDefault();
		e.stopPropagation();
		typeof state !== "undefined"
			? setOpen(state)
			: setOpen((prev) => !prev);
	};

	useEffect(() => {
		const handleClickOutside = (
			e: React.MouseEvent<HTMLDivElement, MouseEvent> | MouseEvent
		) => {
			if (
				dropdownRef.current &&
				isOpen &&
				!dropdownRef.current.contains(e.target as Node)
			)
				setOpen(false);
		};

		document.addEventListener("click", handleClickOutside, false);
		return () =>
			document.removeEventListener("click", handleClickOutside, false);
	}, [isOpen]);

	const addFilter = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		filter: string
	) => {
		if (filters.includes(filter)) return handleOpen(e);

		if (filters.length === 0) setCache(results);
		setFilters((prev) => [...prev, filter]);
		setResults(filterResults(results, filters));
		handleOpen(e);
	};

	const removeAllFilters = () => {
		setResults(cache);
		setCache([]);
		setFilters([]);
	};

	const removeOneFilter = (filter: string) => {
		if (filters.length === 1) {
			setResults(cache);
			setCache([]);
		}
		setFilters((prev) => prev.filter((f) => f !== filter));
	};

	return (
		<div className="relative">
			<div>
				<button className="" onClick={handleOpen}>
					Filter
				</button>
				<button className="" onClick={removeAllFilters}>
					X
				</button>
			</div>
			<div className="flex flex-row gap-2">
				{filters.map((f) => (
					<button
						className="font-semibold px-3 py-1 w-fit text-white rounded-md dark:bg-blue-700 dark:hover:bg-blue-600 bg-blue-600 hover:bg-blue-500"
						onClick={() => removeOneFilter(f)}
					>
						{f}
					</button>
				))}
			</div>
			{isOpen && (
				<div
					className="absolute right-0 top-8 p-2 rounded-lg z-20 flex flex-col gap-1 whitespace-nowrap dark:bg-zinc-800 bg-slate-200"
					ref={dropdownRef}
				>
					{options.map((o) => (
						<button
							className="p-2 rounded-lg dark:hover:bg-zinc-600 hover:bg-slate-400"
							type="button"
							onClick={(e) => addFilter(e, o)}
						>
							{titleCap(o)}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
