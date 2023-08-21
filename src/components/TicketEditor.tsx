import { useState } from "react";
import SelectDropdown from "./SelectDropdown";
import TagsEditor from "./TagsEditor";
import {
	initEditor,
	FetchedTicketData,
	TicketData,
	EditorData,
} from "../types";
import { v4 as uuidv4 } from "uuid";
import SubtaskEditor from "./SubtaskEditor";
import { optionLookup } from "../utility/optionLookup";

type Props = {
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
} & (
	| {
			projectId: string;
			previousData?: never;
			setEditing?: never;
	  }
	| {
			projectId?: never;
			previousData: FetchedTicketData;
			setEditing: React.Dispatch<React.SetStateAction<boolean>>;
	  }
);

export default function TicketEditor(props: Props) {
	const { setCards, projectId, previousData, setEditing } = props;
	const init = handleInit();
	const [editor, setEditor] = useState(init.initState);
	const [expand, setExpand] = useState(init.defaultExpand);

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

	function handleInit() {
		if (previousData) {
			const {
				title,
				description,
				due,
				tags,
				subtasks,
				priority,
				_id,
				...unusedPrevData
			} = previousData;
			return {
				initState: {
					title,
					description,
					priority,
					due,
					subtasks,
					tags,
				},
				unusedPrevData,
				defaultExpand: true,
				editorHeading: "Edit Task",
			};
		} else {
			return {
				initState: initEditor,
				defaultExpand: false,
				editorHeading: "Create New Task",
			};
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			const newTicket: TicketData = previousData // get rid of mongo assigned id
				? { ...editor, ...init.unusedPrevData }
				: {
						...editor,
						projectId: projectId,
						timestamp: Date.now(),
						ticketId: uuidv4(),
						taskStatus: "Not Started",
				  };
			console.log(newTicket);
			const res = previousData
				? await fetch(`/api/ticket/${previousData.ticketId}`, {
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(newTicket),
				  })
				: await fetch("/api/ticket", {
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

	function handleEditCancel() {
		if (previousData) {
			setEditing(false);
		}
	}

	return (
		<div
			className={
				"container mx-auto  " +
				(!previousData && "border-black border-2 rounded-lg")
			}
		>
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
						{init.editorHeading}
					</h1>
					{expand && (
						<div className="flex space-x-4">
							<button type="button" onClick={handleReset}>
								Reset Form
							</button>
							{previousData ? (
								<button
									type="button"
									onClick={handleEditCancel}
								>
									Cancel Edit
								</button>
							) : (
								<button type="button" onClick={handleExpand}>
									Hide Editor
								</button>
							)}
						</div>
					)}
				</div>
				{expand && (
					<>
						<input
							className="text-xl sm:text-2xl bg-slate-100 rounded-lg px-2"
							name="title"
							value={editor.title}
							onChange={handleChange}
							placeholder="Title"
							autoFocus
							required
						/>
						<textarea
							className="text-md rounded-lg bg-slate-100 px-2"
							name="description"
							rows={2}
							value={editor.description}
							onChange={handleChange}
							placeholder="Description"
						/>
						<SubtaskEditor
							editor={editor as EditorData}
							setEditor={
								setEditor as React.Dispatch<
									React.SetStateAction<EditorData>
								>
							}
						/>
						<TagsEditor
							editor={editor as EditorData}
							setEditor={
								setEditor as React.Dispatch<
									React.SetStateAction<EditorData>
								>
							}
						/>
						<SelectDropdown
							name="priority"
							value={editor.priority}
							options={optionLookup.priority}
							handleChange={handleChange}
							colors="bg-slate-100"
						/>
						<input
							className="text-lg max-w-xs px-1 rounded-lg bg-slate-100"
							name="due"
							type="date"
							value={editor.due}
							onChange={handleChange}
						/>
						<div className="space-x-2">
							<button
								className="mt-2 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-lg max-w-min"
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
