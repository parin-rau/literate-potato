import { useState } from "react";

type Props = {
	tags: string[];
};

export default function TagsEditor(props: Props) {
	const [text, setText] = useState("");
	const [tags, setTags] = useState<string[]>([]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setText(value);
	}

	function addTag(tag: string) {
		if (tag !== "") {
			setTags([...tags, tag]);
			setText("");
		}
	}

	function deleteTag(id: number) {
		setTags(tags.filter((tag) => tags.indexOf(tag) !== id));
	}

	return (
		<div className="flex flex-col space-y-1">
			<div className="flex flex-row space-x-1">
				<input
					className="text-lg"
					name="tags"
					value={text}
					onChange={(e) => handleChange(e)}
					placeholder="Tag"
				/>
				<button type="button" onClick={() => addTag(text)}>
					+Tag
				</button>
			</div>
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
		</div>
	);
}
