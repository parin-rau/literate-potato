import { useState } from "react";
import { EditorData } from "../types";
import SubtaskDisplay from "./SubtaskDisplay";
import { v4 as uuidv4 } from "uuid";

type Props = {
	editor: EditorData;
	setEditor: React.Dispatch<React.SetStateAction<EditorData>>;
};

export default function SubtaskEditor(props: Props) {
	const [text, setText] = useState("");
	const { editor, setEditor } = props;
	const { subtasks } = editor;

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value } = e.target;
		setText(value);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		e.code === "Enter" && e.shiftKey === false && addSubtask(text);
	}

	function addSubtask(subtaskDesc: string) {
		if (subtaskDesc) {
			setEditor({
				...editor,
				subtasks: [
					...subtasks,
					{
						description: subtaskDesc,
						completed: false,
						subtaskId: uuidv4(),
					},
				],
			});
			setText("");
		}
	}

	function deleteSubtask(id: string) {
		const updatedSubtasks = subtasks.filter(
			(item) => item.subtaskId !== id
		);
		setEditor({
			...editor,
			subtasks: updatedSubtasks,
		});
	}

	return (
		<div className="flex flex-col rounded-lg shadow-sm border">
			<input
				className={
					"duration-500 sm:text-base text-sm px-2 py-1 flex-grow rounded-lg " +
					(subtasks.length > 0 && "shadow-md")
				}
				name="subtasks"
				value={text}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder="Enter New Subtask"
			/>

			{subtasks.length > 0 && (
				<SubtaskDisplay
					subtasks={subtasks}
					deleteSubtask={deleteSubtask}
				/>
			)}
		</div>
	);
}
