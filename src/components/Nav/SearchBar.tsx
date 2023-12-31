import { useState } from "react";
import { titleCap } from "../../utility/charCaseFunctions";
import { useNavigate } from "react-router-dom";

type Props = {
	setFilters?: React.Dispatch<React.SetStateAction<string[]>>;
	placeholder?: string;
	linkTo?: string;
};

export default function SearchBar(props: Props) {
	const { setFilters, placeholder, linkTo } = props;
	const [search, setSearch] = useState("");
	const navigate = useNavigate();

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		linkTo ? setSearch(value) : setSearch(titleCap(value));
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (setFilters && e.code === "Enter" && e.shiftKey === false) {
			e.preventDefault;
			setFilters((prev) => [...prev, search]);
			setSearch("");
		}
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (linkTo && search) {
			return navigate(`${linkTo}/${search}`);
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className={
				"dark:bg-zinc-800" +
				(setFilters
					? " bg-white rounded-md my-2"
					: " flex flex-row flex-grow rounded-md bg-slate-200 items-center w-full")
			}
		>
			<input
				className="bg-transparent w-full flex-grow px-4 py-1 rounded-md"
				value={search}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={placeholder || "Search..."}
			/>
			{!setFilters && (
				<button className="px-4" type="submit">
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
		</form>
	);
}
