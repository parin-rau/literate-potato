type Props = {
	tags: string[];
	deleteTag?: (_id: number) => void;
	filter?: string[];
	setFilter?: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function TagsDisplay(props: Props) {
	const { tags, deleteTag, filter, setFilter } = props;

	function handleClick(id: number, tag?: string) {
		if (setFilter && tag && !filter!.includes(tag)) {
			setFilter((prev) => [...prev, tag]);
		} else if (deleteTag) {
			deleteTag(id);
		}
	}

	return (
		<div className="flex flex-row flex-wrap py-2">
			{tags.map((tag, index) => (
				<div
					className={
						"text-sm bg-blue-300 rounded-full px-3 py-1 m-1 flex flex-row" +
						" hover:cursor-pointer hover:bg-blue-500 hover:text-white"
					}
					key={index}
					onClick={() => handleClick(index, tag)}
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
				</div>
			))}
		</div>
	);
}