import { useState } from "react";
import TagsDisplay from "../Display/TagsDisplay";
import { EditorData } from "../../types";
import { firstLetterCap } from "../../utility/charCaseFunctions";

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
		<div className="flex flex-col rounded-md shadow-sm border">
			<input
				className={
					"duration-500 sm:text-base text-sm px-2 py-1 flex-grow rounded-md " +
					(tags.length > 0 && "shadow-lg")
				}
				name="tags"
				value={text}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder="Enter New Tag"
			/>
			{tags.length > 0 && (
				<TagsDisplay tags={tags} deleteTag={deleteTag} />
			)}
		</div>
	);
}
