import { useState, useRef, useEffect, useMemo } from "react";
import { SearchResultProps } from "../../types";
import { titleCap } from "../../utility/charCaseFunctions";

interface Props {
	results: SearchResultProps[];
	setResults: React.Dispatch<React.SetStateAction<SearchResultProps[]>>;
}

const filterResults = (results: SearchResultProps[], filters: string[]) => {
	const filtered: SearchResultProps[] = [];
	filters.forEach((f) => {
		const matches = results.filter(
			(r) => r.meta.kind === f && !filtered.includes(r)
		);
		filtered.push(...matches);
	});
	return filtered;
};

const options = ["ticket", "subtask", "project", "group", "user"];

export default function FilterMenu({ results, setResults }: Props) {
	const cache = useMemo(() => [...results], []);
	const [isOpen, setOpen] = useState(false);
	const [filters, setFilters] = useState<string[]>([]);
	const filterMenuRef = useRef<HTMLDivElement>(null);

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
				filterMenuRef.current &&
				isOpen &&
				!filterMenuRef.current.contains(e.target as Node)
			)
				setOpen(false);
		};

		document.addEventListener("click", handleClickOutside, false);
		return () =>
			document.removeEventListener("click", handleClickOutside, false);
	}, [isOpen]);

	const addFilter = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		newFilter: string
	) => {
		if (filters.includes(newFilter)) return handleOpen(e);

		//if (filters.length === 0)
		setFilters((prev) => [...prev, newFilter]);
		setResults(filterResults(cache, [...filters, newFilter]));
		handleOpen(e);
	};

	const removeAllFilters = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		setResults(cache);
		setFilters([]);
		handleOpen(e);
	};

	const removeOneFilter = (filter: string) => {
		if (filters.length === 1) {
			setResults(cache);
		}
		setFilters((prev) => prev.filter((f) => f !== filter));
	};

	return (
		<div className="relative flex flex-col gap-2 items-end">
			<button
				className="p-2 rounded-lg dark:hover:bg-zinc-600 hover:bg-slate-400"
				onClick={handleOpen}
			>
				Filter
			</button>

			{filters.length > 0 && (
				<div className="flex flex-row gap-2 items-baseline">
					Applied Filters:{" "}
					{filters.map((f) => (
						<button
							className="font-semibold px-3 py-1 w-fit text-white rounded-full dark:bg-blue-700 dark:hover:bg-blue-600 bg-blue-600 hover:bg-blue-500"
							onClick={() => removeOneFilter(f)}
						>
							{titleCap(f)}
						</button>
					))}
				</div>
			)}

			{isOpen && (
				<div
					className="absolute right-0 top-8 p-2 rounded-lg z-20 flex flex-col gap-1 whitespace-nowrap dark:bg-zinc-800 bg-slate-200"
					ref={filterMenuRef}
				>
					<button
						className="p-2 rounded-lg dark:hover:bg-zinc-600 hover:bg-slate-400"
						onClick={removeAllFilters}
					>
						Clear All Filters
					</button>
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
