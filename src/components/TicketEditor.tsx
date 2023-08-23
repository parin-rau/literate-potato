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
				_id,
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
			if (previousData) {
				const patchData: TicketData = {
					...editor!,
					...init.unusedPrevData!,
				};
				const res = await fetch(
					`/api/ticket/${previousData.ticketId}`,
					{
						method: "PATCH",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(patchData),
					}
				);
				if (res.ok) {
					const updatedTicket = {
						...patchData,
						_id: init._id,
						lastModified: Date.now(),
					};
					setCards((prevCards) =>
						prevCards.map((card) =>
							card._id === updatedTicket._id
								? updatedTicket
								: card
						)
					);
					setEditor(initEditor);
					setEditing(false);
				}
			} else {
				const newTicket = {
					...editor,
					projectId: projectId,
					timestamp: Date.now(),
					ticketId: uuidv4(),
					taskStatus: "Not Started",
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
				"mx-2 sm:mx-0 " +
				(!previousData && "border-black border-2 rounded-lg")
			}
		>
			<form
				className="flex flex-col px-4 py-2 sm:py-4 space-y-2"
				onSubmit={handleSubmit}
				onKeyDown={handleKeyDown}
			>
				<div className="flex flex-row justify-between">
					<h1
						className={
							"font-semibold text-xl sm:text-2xl " +
							(!previousData && "hover:cursor-pointer")
						}
						onClick={() => {
							if (!previousData) {
								setExpand(!expand);
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
							className="text-lg sm:text-xl border rounded-lg px-2 shadow-sm"
							name="title"
							value={editor.title}
							onChange={handleChange}
							placeholder="Title"
							autoFocus
							required
						/>
						<textarea
							className="text-sm sm:text-base rounded-lg border px-2 shadow-sm"
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
						<div className="grid grid-cols-2 place-items-stretch gap-2 rounded-lg shadow-none">
							<div className="flex flex-col sm:border sm:rounded-lg shadow-none sm:shadow-sm p-2 space-y-2">
								<h4 className="px-1">Due Date</h4>
								<input
									className="text-base px-1 rounded-lg bg-slate-100"
									name="due"
									type="date"
									value={editor.due}
									onChange={handleChange}
								/>
							</div>
							<div className="flex flex-col sm:border sm:rounded-lg shadow-none sm:shadow-sm p-2 space-y-2">
								<h4 className="px-1">Priority</h4>
								<SelectDropdown
									name="priority"
									value={editor.priority}
									options={optionLookup.priority}
									handleChange={handleChange}
									colors="bg-slate-100"
								/>
							</div>
						</div>
						<div className="space-x-2">
							<button
								className="transition duration-200 mt-2 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-lg max-w-min"
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
