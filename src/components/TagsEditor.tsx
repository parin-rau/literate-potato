import { useState } from "react";
import TagsDisplay from "./TagsDisplay";
import { EditorData } from "../types";
import { firstLetterCap } from "../utility/charCaseFunctions";

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
			const firstUpperTag = firstLetterCap(tag);
			setEditor({ ...editor, tags: [...tags, firstUpperTag] });
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
		<div className="flex flex-col rounded-lg border pt-2">
			<div className="flex flex-row space-x-2 items-center">
				<input
					className="text-lg bg-slate-100 p-1 flex-grow mx-1 rounded-md"
					name="tags"
					value={text}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Enter New Tag"
				/>
				{/* <button
					className="bg-slate-300 hover:bg-slate-400 rounded-lg px-3 py-2"
					type="button"
					onClick={() => addTag(text)}
				>
					Add Tag
				</button> */}
				{/* <i className="text-sm">Enter</i> */}
			</div>
			{tags.length > 0 && (
				<TagsDisplay tags={tags} deleteTag={deleteTag} />
			)}
		</div>
	);
}
