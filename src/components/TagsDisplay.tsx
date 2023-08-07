type Props = {
	tags: string[];
	deleteTag: (_id: number) => void;
};

export default function TagsDisplay(props: Props) {
	const { tags, deleteTag } = props;

	return (
		<div className="flex flex-row py-2 space-x-1">
			{tags.map((tag, index) => (
				<span
					className="text-sm bg-blue-300 hover:bg-blue-500 hover:text-white rounded-full px-3 py-1"
					key={index}
					onClick={() => deleteTag(index)}
				>
					{tag}
				</span>
			))}
		</div>
	);
}
