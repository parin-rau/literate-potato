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

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		e.code === "Enter" && e.shiftKey === false && addTag(text);
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
			<div className="flex flex-row space-x-2 items-center">
				<input
					className="text-lg"
					name="tags"
					value={text}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Tag"
				/>
				<button
					className="bg-slate-300 hover:bg-slate-400 rounded-full px-3 py-2"
					type="button"
					onClick={() => addTag(text)}
				>
					Add Tag
				</button>
				<i className="text-sm">Enter</i>
			</div>
			{tags.length > 0 && (
				<TagsDisplay tags={tags} deleteTag={deleteTag} />
			)}
		</div>
	);
}
