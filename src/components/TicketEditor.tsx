import { useState } from "react";
import SelectDropdown from "./SelectDropdown";
import TagsEditor from "./TagsEditor";
import { EditorData, FetchedTicketData, TicketData } from "../types";
import { v4 as uuidv4 } from "uuid";
import SubtaskEditor from "./SubtaskEditor";
import { optionLookup } from "../utility/optionLookup";

type Props = {
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	projectId: string;
	// cardCount: number;
};

const initEditor: EditorData = {
	title: "",
	description: "",
	priority: "",
	due: "",
	tags: [],
	subtasks: [],
};

export default function TicketEditor(props: Props) {
	const { setCards, projectId } = props;
	const [editor, setEditor] = useState(initEditor);
	const [expand, setExpand] = useState(false);

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
				projectId: projectId,
				timestamp: Date.now(),
				ticketId: uuidv4(),
				taskStatus: "Not Started",
				//ticketNumber: cardCount + 1,
			};
			const res = await fetch("/api/ticket", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newTicket),
			});
			if (res.ok) {
				const response = await res.json();
				setCards((prevCards) => [
					{ ...newTicket, ticketNumber: response.ticketNumber },
					...prevCards,
				]);
				setEditor(initEditor);
			}
		} catch (err) {
			console.error(err);
		}
	}

	function handleExpand() {
		setExpand(!expand);
	}

	function handleReset() {
		setEditor(initEditor);
	}

	return (
		<div className="sm:container sm:mx-auto border-black border-2 rounded-lg">
			<form
				className="flex flex-col px-4 py-4 space-y-2"
				onSubmit={handleSubmit}
				onKeyDown={handleKeyDown}
			>
				<div className="flex flex-row justify-between">
					<h1
						className={
							"text-3xl " + (!expand && "hover:cursor-pointer")
						}
						onClick={() => {
							if (!expand) {
								setExpand(true);
							}
						}}
					>
						Create New Task
					</h1>
					{expand && (
						<div className="flex space-x-4">
							<button type="button" onClick={handleReset}>
								Reset Form
							</button>
							<button type="button" onClick={handleExpand}>
								Hide Editor
							</button>
						</div>
					)}
				</div>
				{expand && (
					<>
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
								className="text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-lg max-w-min"
								type="submit"
							>
								Submit
							</button>
							<i className="text-sm">Shift + Enter</i>
						</div>
					</>
				)}
			</form>
		</div>
	);
}
