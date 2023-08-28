import { useState } from "react";
import { EditorData } from "../../types";
import SubtaskDisplay from "../Display/SubtaskDisplay";
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
		if (e.code === "Enter" && e.ctrlKey === false) {
			addSubtask(text);
		}
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

	function editSubtask(id: string) {
		const targetSubtask = subtasks.find(
			(subtask) => subtask.subtaskId === id
		);
		if (targetSubtask) {
			setText(targetSubtask.description);
			deleteSubtask(id);
		}
	}

	return (
		<div className="flex flex-col rounded-md shadow-sm border border-inherit relative">
			<input
				className={
					"duration-500 sm:text-base text-sm px-2 py-1 flex-grow rounded-md bg-inherit " +
					(subtasks.length > 0 && "shadow-md")
				}
				name="subtasks"
				value={text}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder="Enter New Subtask"
			/>
			{text.length > 0 && (
				<button
					className="absolute right-2 top-0 sm:top-0.5 rounded-md p-0.5 hover:bg-slate-300"
					type="button"
					onClick={() => addSubtask(text)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="w-6 h-6"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</button>
			)}

			{subtasks.length > 0 && (
				<SubtaskDisplay {...{ subtasks, deleteSubtask, editSubtask }} />
			)}
		</div>
	);
}
