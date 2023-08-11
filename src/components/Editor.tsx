import { useState } from "react";
import SelectDropdown from "./SelectDropdown";
import TagsEditor from "./TagsEditor";
import { EditorData, FetchedTicketData, TicketData } from "../types";
import { v4 as uuidv4 } from "uuid";
import SubtaskEditor from "./SubtaskEditor";
import { optionLookup } from "../utility/optionLookup";

type Props = {
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
};

const initEditor: EditorData = {
	title: "",
	description: "",
	priority: "",
	due: "",
	tags: [],
	subtasks: [],
};

export default function Editor(props: Props) {
	const { setCards } = props;
	const [editor, setEditor] = useState(initEditor);

	function handleChange(
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
			| React.ChangeEvent<HTMLSelectElement>
	) {
		const { value, name } = e.target;
		setEditor({ ...editor, [name]: value });
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
		if (e.code === "Enter" && e.shiftKey === false) {
			e.preventDefault();
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			const newTicket: TicketData = {
				...editor,
				timestamp: Date.now(),
				ticketId: uuidv4(),
				taskStatus: "Not Started",
			};
			console.log(newTicket);
			const res = await fetch("/api/ticket", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newTicket),
			});
			if (res.ok) {
				setCards((prevCards) => [newTicket, ...prevCards]);
				setEditor(initEditor);
			}
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className="sm:container sm:mx-auto border-black border-2 rounded-lg">
			<form
				className="flex flex-col px-4 py-4 space-y-2"
				onSubmit={handleSubmit}
				onKeyDown={handleKeyDown}
			>
				<h1 className="text-3xl">Create New Task</h1>
				<input
					className="text-2xl"
					name="title"
					value={editor.title}
					onChange={handleChange}
					placeholder="Title"
					autoFocus
					required
				/>
				<textarea
					className="text-md"
					name="description"
					rows={2}
					value={editor.description}
					onChange={handleChange}
					placeholder="Description"
				/>
				<SubtaskEditor editor={editor} setEditor={setEditor} />
				<TagsEditor editor={editor} setEditor={setEditor} />
				<SelectDropdown
					name="priority"
					value={editor.priority}
					options={optionLookup.priority}
					handleChange={handleChange}
				/>
				<input
					className="text-lg max-w-xs px-1"
					name="due"
					type="date"
					value={editor.due}
					onChange={handleChange}
				/>
				<div className="space-x-2">
					<button
						className="text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full max-w-min"
						type="submit"
					>
						Submit
					</button>
					<i className="text-sm">Shift + Enter</i>
				</div>
			</form>
		</div>
	);
}
