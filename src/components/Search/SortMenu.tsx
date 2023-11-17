import { useState, useRef, useEffect } from "react";
import { SearchResultProps } from "../../types";

interface Props {
	results: SearchResultProps[];
	sortFns: { label: string; fn: (_r: SearchResultProps[]) => void }[];
	//filterFns: (() => void)[];
}

export default function SearchFilter({ results, sortFns }: Props) {
	const [isOpen, setOpen] = useState(false);
	const [currentSort, setCurrentSort] = useState("");
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

	return (
		<div className="relative flex flex-row gap-2">
			<button
				className="p-2 rounded-lg dark:hover:bg-zinc-600 hover:bg-slate-400"
				type="button"
				onClick={handleOpen}
			>
				{`Sort${currentSort ? ": " + currentSort : ""}`}
			</button>
			{isOpen && (
				<div
					className="absolute right-0 top-8 p-2 rounded-lg z-20 flex flex-col gap-1 whitespace-nowrap dark:bg-zinc-800 bg-slate-200"
					ref={dropdownRef}
				>
					{sortFns.map((s) => (
						<button
							className="p-2 rounded-lg dark:hover:bg-zinc-600 hover:bg-slate-400"
							type="button"
							onClick={(e) => {
								s.fn(results);
								setCurrentSort(s.label);
								handleOpen(e);
							}}
						>
							{s.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
