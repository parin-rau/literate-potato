import { useState } from "react";

export default function SearchBar() {
	const [search, setSearch] = useState("");

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setSearch(value);
	}

	return (
		<div className="flex flex-row flex-grow rounded-md bg-slate-200 items-center">
			<input
				className="bg-transparent flex-grow px-4 py-1 rounded-md"
				value={search}
				onChange={handleChange}
				placeholder="Search..."
			/>
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
		</div>
	);
}
