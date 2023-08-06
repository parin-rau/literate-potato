// import { useState } from "react";
import SelectDropdown from "./SelectDropdown";
// import Tagseditor from "./Tagseditor";
// import { useNavigate } from "react-router-dom";
import { EditorData, FetchedTicketData, TicketData } from "../types";
import { v4 as uuidv4 } from "uuid";

/* type editorText = {
	title: string;
	description: string;
	priority: "" | "Low" | "Medium" | "High";
	due: string;
	tags: string[];
};

const initeditor: editorText = {
	title: "",
	description: "",
	priority: "",
	due: "",
	tags: [],
}; */

type Props = {
	editor: EditorData;
	setEditor: React.Dispatch<React.SetStateAction<EditorData>>;
	initEditor: EditorData;
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
};

export default function Editor(props: Props) {
	const { editor, setEditor, initEditor, setCards } = props;

	/* const navigate = useNavigate();
	const refreshPage = () => {
		navigate(0);
	}; */

	// const [editor, setEditor] = useState(initEditor);
	const selectOptions = [
		{
			label: "Select task priority",
			value: "",
		},
		{ label: "Low", value: "low" },
		{ label: "Medium", value: "medium" },
		{ label: "High", value: "high" },
	];

	function handleChange(
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
			| React.ChangeEvent<HTMLSelectElement>
	) {
		const { value, name } = e.target;
		setEditor({ ...editor, [name]: value });
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			const newTicket: TicketData = {
				...editor,
				timestamp: Date.now(),
				ticketId: uuidv4(),
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
				// refreshPage();
			}
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className="sm:container sm:mx-auto border-black border-2 rounded-lg">
			<form
				className="flex flex-col px-4 py-4 space-y-2"
				onSubmit={(e) => handleSubmit(e)}
			>
				<h1 className="text-3xl">Create New Task</h1>
				<input
					className="text-2xl"
					name="title"
					value={editor.title}
					onChange={(e) => handleChange(e)}
					placeholder="Title"
					autoFocus
					required
				/>
				{/* <Tagseditor /> */}
				<textarea
					className="text-md"
					name="description"
					rows={2}
					value={editor.description}
					onChange={(e) => handleChange(e)}
					placeholder="description"
				/>
				<SelectDropdown
					name="priority"
					value={editor.priority}
					options={selectOptions}
					handleChange={handleChange}
				/>
				<input
					className="text-lg max-w-xs"
					name="due"
					type="date"
					value={editor.due}
					onChange={(e) => handleChange(e)}
				/>
				<button
					className="text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full max-w-min"
					type="submit"
				>
					Submit
				</button>
			</form>
		</div>
	);
}
