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
		const deleteTargetId = subtasks.find(
			(item) => item.subtaskId === id
		)?.subtaskId;
		setEditor({
			...editor,
			subtasks: subtasks.filter(() => deleteTargetId !== id),
		});
	}

	return (
		<div className="flex flex-col">
			<div className="flex flex-row space-x-2 items-center">
				<input
					className="text-lg"
					name="subtasks"
					value={text}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="Subtask"
				/>
				<button
					className="bg-slate-300 hover:bg-slate-400 rounded-full px-3 py-2"
					type="button"
					onClick={() => addSubtask(text)}
				>
					Add Subtask
				</button>
				<i className="text-sm">Enter</i>
			</div>
			{subtasks.length > 0 && (
				<SubtaskDisplay
					subtasks={subtasks}
					deleteSubtask={deleteSubtask}
				/>
			)}
		</div>
	);
}
