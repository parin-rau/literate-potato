type Props = {
	tags: string[];
	deleteTag?: (_id: number) => void;
};

export default function TagsDisplay(props: Props) {
	const { tags, deleteTag } = props;

	return (
		<div className="flex flex-row py-2 space-x-1">
			{tags.map((tag, index) => (
				<span
					className={
						deleteTag
							? "text-sm bg-blue-300 rounded-full px-3 py-1 hover:cursor-pointer hover:bg-blue-500 hover:text-white"
							: "text-sm bg-blue-300 rounded-full px-3 py-1"
					}
					key={index}
					onClick={deleteTag && (() => deleteTag(index))}
				>
					{tag}
				</span>
			))}
		</div>
	);
}
