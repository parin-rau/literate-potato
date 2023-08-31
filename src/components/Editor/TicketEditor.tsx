import { useState } from "react";
import {
	initProjectEditor,
	initTicketEditor,
	FetchedTicketData,
	EditorData,
	Project,
	ProjectEditor,
} from "../../types";
import { v4 as uuidv4 } from "uuid";
import ProjectForm from "../Form/ProjectForm";
import TicketForm from "../Form/TicketForm";

type CommonProps = {
	dataKind: string;
	resetFilters?: () => void;
};

type CommonProjectProps = {
	dataKind: "project";
	setCards: React.Dispatch<React.SetStateAction<Project[]>>;
	setCardCache: React.Dispatch<React.SetStateAction<Project[]>>;
};

type CommonTicketProps = {
	dataKind: "ticket";
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	setCardCache: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
};

type CreatingProjectProps = CommonProjectProps & {
	project?: never;
	previousData?: never;
	setEditing?: never;
};

type CreatingTicketProps = CommonTicketProps & {
	project?: { projectId: string; projectTitle: string };
	previousData?: never;
	setEditing?: never;
};

type EditingProjectProps = CommonProjectProps & {
	project?: never;
	previousData: Project;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

type EditingTicketProps = CommonTicketProps & {
	project?: never;
	previousData: FetchedTicketData;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

type Props = CommonProps &
	(
		| (CreatingTicketProps | EditingTicketProps)
		| (CreatingProjectProps | EditingProjectProps)
	);

export default function TicketEditor(props: Props) {
	const {
		dataKind,
		setCards,
		previousData,
		setEditing,
		setCardCache,
		resetFilters,
	} = props;
	const init = handleInit(dataKind);
	const [editor, setEditor] = useState(init!.initState);
	const [expand, setExpand] = useState(init!.defaultExpand);
	const [isPinned, setPinned] = useState(false);

	function handleChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) {
		const { value, name } = e.target;
		if (name === "projectId" || name === "projectTitle") {
			setEditor({
				...(editor as EditorData),
				project: { ...(editor as EditorData).project, [name]: value },
			});
		} else {
			setEditor({ ...editor, [name]: value });
		}
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
		if (e.code === "Enter" && e.ctrlKey === false) {
			e.preventDefault();
		}
	}

	function handleInit(dataKind: "ticket" | "project") {
		if (dataKind === "ticket") {
			if (previousData) {
				const {
					title,
					description,
					due,
					tags,
					subtasks,
					priority,
					project,
					...unusedPrevData
				} = previousData as FetchedTicketData;
				return {
					initState: {
						title,
						description,
						priority,
						due,
						subtasks,
						tags,
						project,
					},
					unusedPrevData,
					defaultExpand: true,
					editorHeading: "Edit Task",
				};
			} else {
				const { project } = props;
				return {
					initState: { ...initTicketEditor, project },
					defaultExpand: false,
					editorHeading: "Create New Task",
				};
			}
		} else if (dataKind === "project") {
			if (previousData) {
				const { title, description, creator, ...unusedPrevData } =
					previousData as Project;
				return {
					initState: {
						title,
						description,
						creator,
					},
					unusedPrevData,
					defaultExpand: true,
					editorHeading: "Edit Project",
				};
			} else {
				return {
					initState: initProjectEditor,
					defaultExpand: false,
					editorHeading: "Create New Project",
				};
			}
		} else {
			console.error("Init undefined");
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			if (dataKind === "ticket") {
				if (previousData) {
					const patchData = {
						...editor!,
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
						const updatedTicket: FetchedTicketData = {
							...(patchData as EditorData),
							...(init!.unusedPrevData! as FetchedTicketData),
							lastModified: Date.now(),
						};
						setCards((prevCards) =>
							prevCards.map((card) =>
								card.ticketId === updatedTicket.ticketId
									? updatedTicket
									: card
							)
						);
						setCardCache &&
							setCardCache((prev) =>
								prev.map((card) =>
									card.ticketId === updatedTicket.ticketId
										? updatedTicket
										: card
								)
							);
						setEditor(init?.initState || initTicketEditor);
						setEditing(false);
					}
				} else {
					const newTicket = {
						...(editor as EditorData),
						timestamp: Date.now(),
						ticketId: uuidv4(),
						taskStatus: "Not Started",
						comments: [],
					};
					const res1 = await fetch("/api/ticket", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(newTicket),
					});
					if (res1.ok) {
						const response = await res1.json();
						setCards((prevCards) => [
							{
								...newTicket,
								ticketNumber: response.ticketNumber,
							},
							...prevCards,
						]);
						if (setCardCache && resetFilters) {
							setCardCache((prevCards) => [
								{
									...newTicket,
									ticketNumber: response.ticketNumber,
								},
								...prevCards,
							]);
							resetFilters();
						}
						setEditor(init?.initState || initTicketEditor);
						!isPinned && setExpand(false);
						if (newTicket.project.projectId) {
							try {
								const totalSubtasks = newTicket.subtasks.length;
								const res2 = await fetch(
									`/api/project/${newTicket.project.projectId}`,
									{
										method: "PATCH",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											subtasksTotalIncrement:
												totalSubtasks,
										}),
									}
								);
								if (res2.ok) {
									console.log(
										"Incremented completed tasks for project"
									);
								}
							} catch (e) {
								console.error(e);
							}
						}
					}
				}
			} else if (dataKind === "project") {
				if (previousData) {
					const patchData = { ...editor };
					const res1 = await fetch(
						`/api/project/${previousData.projectId}`,
						{
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(patchData),
						}
					);
					if (res1.ok) {
						try {
							const ticketPatch = {
								project: {
									projectTitle: editor.title,
									projectId: previousData.projectId,
								},
							};
							const res2 = await fetch(
								`/api/ticket/project-edit/${previousData.projectId}`,
								{
									method: "PATCH",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify(ticketPatch),
								}
							);
							if (res2.ok) {
								const updatedCard: Project = {
									...(patchData as ProjectEditor),
									...(init!.unusedPrevData! as Project),
									lastModified: Date.now(),
								};
								setCards((prevCards) =>
									prevCards.map((card) =>
										card.projectId === updatedCard.projectId
											? updatedCard
											: card
									)
								);
								setCardCache &&
									setCardCache((prev) =>
										prev.map((card) =>
											card.projectId ===
											updatedCard.projectId
												? updatedCard
												: card
										)
									);
								setEditor(initTicketEditor);
								setEditing(false);
							}
						} catch (e) {
							console.error(e);
						}
					}
				} else {
					const newCard: Project = {
						...(editor as ProjectEditor),
						timestamp: Date.now(),
						projectId: uuidv4(),
						subtasksCompletedCount: 0,
						subtasksTotalCount: 0,
					};

					const res = await fetch("/api/project", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(newCard),
					});
					if (res.ok) {
						setCards((prevCards) => [newCard, ...prevCards]);
						setEditor(initProjectEditor);
						!isPinned && setExpand(false);
					}
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

	function handleExpand() {
		setExpand(!expand);
		isPinned && setPinned(false);
	}

	function handleReset() {
		setEditor(init?.initState || initTicketEditor);
	}

	function handleEditCancel() {
		if (previousData) {
			setEditing(false);
		}
	}

	return (
		<div
			className={
				"mx-2 sm:mx-0 bg-transparent " +
				(!expand && " hover:cursor-pointer ") +
				(!previousData &&
					"bg-white dark:bg-zinc-900 border-black border-2 rounded-md dark:border-zinc-600")
			}
			onClick={() => !expand && setExpand(true)}
		>
			<form
				className="flex flex-col px-4 py-2 sm:py-4 space-y-2 sm:space-y-4 bg-transparent dark:border-neutral-700"
				onSubmit={handleSubmit}
				onKeyDown={handleKeyDown}
			>
				<div className="flex flex-row justify-between items-baseline">
					{previousData ? (
						<h1 className="font-semibold text-lg sm:text-2xl">
							{init!.editorHeading}
						</h1>
					) : (
						<button
							className="font-semibold text-lg sm:text-2xl"
							onClick={() => {
								setExpand(!expand);
							}}
							type="button"
						>
							{init!.editorHeading}
						</button>
					)}
					{expand && (
						<div className="flex text-xs sm:text-base ">
							<button
								className="dark:hover:bg-zinc-700 rounded-md px-2 py-1"
								type="button"
								onClick={handleReset}
							>
								Reset Form
							</button>
							{!setEditing && (
								<button
									className={
										"dark:hover:bg-zinc-700 rounded-md px-2 py-1 " +
										(isPinned && " bg-zinc-800")
									}
									type="button"
									onClick={() => setPinned(!isPinned)}
								>
									{isPinned
										? "Unpin Editor"
										: "Pin Editor Open"}
								</button>
							)}
							{previousData ? (
								<button
									className="dark:hover:bg-zinc-700 rounded-md px-2 py-1"
									type="button"
									onClick={handleEditCancel}
								>
									Cancel Edit
								</button>
							) : (
								<button
									className="dark:hover:bg-zinc-700 rounded-md px-2 py-1"
									type="button"
									onClick={handleExpand}
								>
									Hide Editor
								</button>
							)}
						</div>
					)}
				</div>
				{expand && dataKind === "ticket" && (
					<TicketForm
						{...{
							editor: editor as EditorData,
							setEditor: setEditor as React.Dispatch<
								React.SetStateAction<EditorData>
							>,
							handleChange,
						}}
					/>
				)}
				{expand && dataKind === "project" && (
					<ProjectForm
						{...{ editor: editor as ProjectEditor, handleChange }}
					/>
				)}
			</form>
		</div>
	);
}
