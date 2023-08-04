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
		tags.filter((tag) => tags.indexOf(tag) !== id);
	}

	return (
		<div>
			<div>
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
			<div>
				{tags.map((tag, index) => (
					<span
						className="text-sm bg-blue-300 hover:bg-blue-500 rounded-full px-3 py-1"
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
