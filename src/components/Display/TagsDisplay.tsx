type Props = {
	tags: string[];
	deleteTag?: (_id: number) => void;
	filters?: string[];
	setFilters?: React.Dispatch<React.SetStateAction<string[]>>;
	filterCards?: (_t: string[]) => void;
};

export default function TagsDisplay(props: Props) {
	const { tags, deleteTag, filters, setFilters, filterCards } = props;

	function handleClick(id: number, tag?: string) {
		if (
			setFilters &&
			tag &&
			filters &&
			!filters.includes(tag) &&
			filterCards
		) {
			const newFilters = [...filters, tag];
			//setFilters((prev) => [...prev, tag]);
			setFilters(newFilters);
			filterCards(newFilters);
		} else if (deleteTag) {
			const newFilters = tags.filter((t) => tags.indexOf(t) !== id);
			deleteTag(id);
			filterCards && filterCards(newFilters);
		}
	}

	return (
		<div className="flex flex-row flex-wrap py-2">
			{tags.map((tag, index) => (
				<button
					type="button"
					className="text-sm bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white  hover:text-white rounded-full px-3 py-1 m-1 flex flex-row cursor-pointer "
					key={index}
					onClick={() => {
						handleClick(index, tag);
					}}
					title={deleteTag ? "Remove Tag" : "Add to Filters"}
				>
					{tag}
					{deleteTag && (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							className="w-5 h-5"
						>
							<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
						</svg>
					)}
				</button>
			))}
		</div>
	);
}
