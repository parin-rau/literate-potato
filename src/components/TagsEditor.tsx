import { useState } from "react";
import TagsDisplay from "./TagsDisplay";
import { EditorData } from "../types";

type Props = {
	editor: EditorData;
	setEditor: React.Dispatch<React.SetStateAction<EditorData>>;
};

export default function TagsEditor(props: Props) {
	const [text, setText] = useState("");
	const { editor, setEditor } = props;
	const { tags } = editor;

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setText(value);
	}

	function addTag(tag: string) {
		if (tag) {
			setEditor({ ...editor, tags: [...tags, tag] });
			setText("");
		}
	}

	function deleteTag(id: number) {
		setEditor({
			...editor,
			tags: tags.filter((tag) => tags.indexOf(tag) !== id),
		});
	}

	return (
		<div className="flex flex-col">
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
			{tags && <TagsDisplay tags={tags} deleteTag={deleteTag} />}
			{/* <div className="flex flex-row py-2 space-x-1">
				{tags.map((tag, index) => (
					<span
						className="text-sm bg-blue-300 hover:bg-blue-500 hover:text-white rounded-full px-3 py-1"
						key={index}
						onClick={() => deleteTag(index)}
					>
						{tag}
					</span>
				))}
			</div> */}
		</div>
	);
}
