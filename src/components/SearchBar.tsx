import { useState } from "react";
import { firstLetterCap } from "../utility/charCaseFunctions";

type Props = {
	setFilter?: React.Dispatch<React.SetStateAction<string[]>>;
	placeholder?: string;
};

export default function SearchBar(props: Props) {
	const { setFilter, placeholder } = props;
	const [search, setSearch] = useState("");

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setSearch(firstLetterCap(value));
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (setFilter && e.code === "Enter" && e.shiftKey === false) {
			setFilter((prev) => [...prev, search]);
			setSearch("");
		}
	}

	return (
		<div
			className={
				setFilter
					? "bg-slate-100 rounded-md my-2"
					: "flex flex-row flex-grow rounded-md bg-slate-200 items-center w-full"
			}
		>
			<input
				className="bg-transparent w-full flex-grow px-4 py-1 rounded-md"
				value={search}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder || "Search..."}
			/>
			{!setFilter && (
				<button className="px-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
						/>
					</svg>
				</button>
			)}
		</div>
	);
}
