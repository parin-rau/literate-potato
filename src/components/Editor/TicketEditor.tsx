//import { useState } from "react";
import {
	//	initProjectEditor,
	//	initTicketEditor,
	//	FetchedTicketData,
	EditorData,
	//	Project,
	ProjectEditor,
} from "../../types";
//import { v4 as uuidv4 } from "uuid";
import ProjectForm from "../Form/ProjectForm";
import TicketForm from "../Form/TicketForm";
//import { arrayExclude, arraysEqual } from "../../utility/arrayComparisons";
//import { useLocation } from "react-router-dom";
//import { useProtectedFetch } from "../../hooks/useProtectedFetch";
import { useCardEditor, Props } from "../../hooks/useCardEditor";

export default function TicketEditor(props: Props) {
	const {
		dataKind,
		//		setCards,
		previousData,
		setEditing,
		//		setCardCache,
		//		resetFilters,
		//		setProject,
	} = props;

	const { handlers, state } = useCardEditor(props);
	const {
		handleSubmit,
		handleExpand,
		handleReset,
		handleEditCancel,
		handleChange,
		handleKeyDown,
	} = handlers;
	const {
		init,
		editor,
		setEditor,
		isPinned,
		setPinned,
		expand,
		setExpand,
		setDeletedSubtaskIds,
	} = state;

	//const init = handleInit(dataKind);
	//const [editor, setEditor] = useState(init!.initState);
	//const [expand, setExpand] = useState(init!.defaultExpand);
	//const [isPinned, setPinned] = useState(false);
	// const [deletedSubtaskIds, setDeletedSubtaskIds] = useState<string[]>([]);
	// const { protectedFetch } = useProtectedFetch();

	// const page = useLocation().pathname;
	// const isProjectPage = page.slice(1, 8) === "project";

	// function handleChange(
	// 	e: React.ChangeEvent<
	// 		HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
	// 	>
	// ) {
	// 	const { value, name } = e.target;
	// 	if (name === "projectId" || name === "projectTitle") {
	// 		setEditor({
	// 			...(editor as EditorData),
	// 			project: { ...(editor as EditorData).project, [name]: value },
	// 		});
	// 	} else {
	// 		setEditor({ ...editor, [name]: value });
	// 	}
	// }

	// function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
	// 	if (e.code === "Enter" && e.ctrlKey === false) {
	// 		e.preventDefault();
	// 	}
	// }

	// async function subtaskIdPatch(
	// 	projectId: string,
	// 	operation: "add" | "delete",
	// 	subtasksCompletedIds: string[],
	// 	subtasksTotalIds: string[],
	// 	tasksCompletedIds?: string[],
	// 	tasksTotalIds?: string[]
	// ) {
	// 	const res = await protectedFetch(`/api/project/${projectId}`, {
	// 		method: "PATCH",
	// 		headers: {
	// 			"Content-Type": "application/json",
	// 		},
	// 		body: JSON.stringify({
	// 			operation,
	// 			subtasksCompletedIds,
	// 			subtasksTotalIds,
	// 			tasksCompletedIds,
	// 			tasksTotalIds,
	// 		}),
	// 	});
	// 	return res;
	// }

	// function handleProjectChange(currentViewProjectId: string) {
	// 	if (isProjectPage && dataKind === "ticket") {
	// 		setCards &&
	// 			setCards((prev) =>
	// 				prev.filter(
	// 					(ticket) =>
	// 						ticket.project.projectId === currentViewProjectId
	// 				)
	// 			);
	// 	}
	// }

	// async function handleSubmit(e: React.FormEvent) {
	// 	e.preventDefault();

	// 	try {
	// 		if (dataKind === "ticket") {
	// 			// Edit existing ticket
	// 			if (previousData) {
	// 				const patchData = {
	// 					...editor!,
	// 				};
	// 				const res1 = await protectedFetch(
	// 					`/api/ticket/${previousData.ticketId}`,
	// 					{
	// 						method: "PATCH",
	// 						headers: { "Content-Type": "application/json" },
	// 						body: JSON.stringify(patchData),
	// 					}
	// 				);
	// 				if (res1.ok) {
	// 					const updatedTicket: FetchedTicketData = {
	// 						...(patchData as EditorData),
	// 						...(init!.unusedPrevData! as FetchedTicketData),
	// 						lastModified: Date.now(),
	// 					};
	// 					setCards &&
	// 						setCards((prevCards) =>
	// 							prevCards.map((card) =>
	// 								card.ticketId === updatedTicket.ticketId
	// 									? updatedTicket
	// 									: card
	// 							)
	// 						);
	// 					setCardCache &&
	// 						setCardCache((prev) =>
	// 							prev.map((card) =>
	// 								card.ticketId === updatedTicket.ticketId
	// 									? updatedTicket
	// 									: card
	// 							)
	// 						);
	// 					setEditor(init?.initState || initTicketEditor);
	// 					setEditing(false);

	// 					// Updating subtask IDs stored on projects

	// 					const previousSubtaskIds = previousData.subtasks?.map(
	// 						(o) => o.subtaskId
	// 					);
	// 					const updatedSubtaskIds = updatedTicket.subtasks?.map(
	// 						(o) => o.subtaskId
	// 					);
	// 					const previousCompletedIds = previousData.subtasks
	// 						.filter((o) => o.completed)
	// 						.map((o) => o.subtaskId);
	// 					const updatedCompletedIds = updatedTicket.subtasks
	// 						.filter((o) => o.completed)
	// 						.map((o) => o.subtaskId);

	// 					if (
	// 						arraysEqual(
	// 							previousSubtaskIds!,
	// 							updatedSubtaskIds!
	// 						) &&
	// 						previousData.project.projectId ===
	// 							updatedTicket.project.projectId
	// 					) {
	// 						console.log("No change to subtasks");
	// 						return;
	// 					} else {
	// 						// Moving ticket between projects
	// 						if (
	// 							previousData.project.projectId &&
	// 							previousData.project.projectId !==
	// 								updatedTicket.project.projectId
	// 						) {
	// 							const res2 = await subtaskIdPatch(
	// 								previousData.project.projectId,
	// 								"delete",
	// 								previousCompletedIds,
	// 								previousSubtaskIds,
	// 								[previousData.ticketId],
	// 								[previousData.ticketId]
	// 							);

	// 							if (res2.ok) {
	// 								handleProjectChange(
	// 									previousData.project.projectId
	// 								);

	// 								setProject &&
	// 									setProject((prev) =>
	// 										prev.map((proj) =>
	// 											proj.projectId ===
	// 											previousData.project.projectId
	// 												? {
	// 														...proj,

	// 														tasksCompletedIds:
	// 															arrayExclude(
	// 																proj.tasksCompletedIds,
	// 																[
	// 																	previousData.ticketId,
	// 																]
	// 															) as string[],

	// 														tasksTotalIds:
	// 															arrayExclude(
	// 																proj.tasksTotalIds,
	// 																[
	// 																	previousData.ticketId,
	// 																]
	// 															) as string[],

	// 														subtasksCompletedIds:
	// 															arrayExclude(
	// 																proj.subtasksCompletedIds,
	// 																previousCompletedIds
	// 															) as string[],

	// 														subtasksTotalIds:
	// 															arrayExclude(
	// 																proj.subtasksTotalIds,
	// 																previousSubtaskIds
	// 															) as string[],
	// 												  }
	// 												: proj
	// 										)
	// 									);
	// 							}
	// 						}

	// 						// Add new tasks to project
	// 						if (updatedTicket.project.projectId) {
	// 							const res3 = await subtaskIdPatch(
	// 								updatedTicket.project.projectId,
	// 								"add",
	// 								updatedCompletedIds,
	// 								updatedSubtaskIds,
	// 								updatedTicket.taskStatus === "Completed"
	// 									? [updatedTicket.ticketId]
	// 									: [],
	// 								[updatedTicket.ticketId]
	// 							);
	// 							if (res3.ok) {
	// 								setProject &&
	// 									setProject((prev) =>
	// 										prev.map((proj) =>
	// 											proj.projectId ===
	// 											updatedTicket.project.projectId
	// 												? {
	// 														...proj,
	// 														subtasksTotalIds: [
	// 															...proj.subtasksTotalIds,
	// 															...(arrayExclude(
	// 																updatedSubtaskIds,
	// 																proj.subtasksTotalIds
	// 															) as string[]),
	// 														],
	// 												  }
	// 												: proj
	// 										)
	// 									);
	// 							}
	// 						}

	// 						// Deleting tasks without moving to different project
	// 						if (deletedSubtaskIds.length) {
	// 							const res4 = await subtaskIdPatch(
	// 								updatedTicket.project.projectId,
	// 								"delete",
	// 								deletedSubtaskIds,
	// 								deletedSubtaskIds
	// 							);

	// 							if (res4.ok) {
	// 								setProject &&
	// 									setProject((prev) =>
	// 										prev.map((proj) =>
	// 											proj.projectId ===
	// 											updatedTicket.project.projectId
	// 												? {
	// 														...proj,
	// 														subtasksCompletedIds:
	// 															arrayExclude(
	// 																proj.subtasksCompletedIds,
	// 																deletedSubtaskIds
	// 															) as string[],
	// 														subtasksTotalIds:
	// 															arrayExclude(
	// 																proj.subtasksTotalIds,
	// 																deletedSubtaskIds
	// 															) as string[],
	// 												  }
	// 												: proj
	// 										)
	// 									);

	// 								setDeletedSubtaskIds([]);
	// 							}
	// 						}
	// 					}
	// 				}
	// 			} else {
	// 				// Create new ticket
	// 				const newTicket = {
	// 					...(editor as EditorData),
	// 					timestamp: Date.now(),
	// 					ticketId: uuidv4(),
	// 					taskStatus: "Not Started",
	// 					comments: [],
	// 				};
	// 				const res1 = await protectedFetch("/api/ticket", {
	// 					method: "POST",
	// 					body: JSON.stringify(newTicket),
	// 				});
	// 				if (res1.ok) {
	// 					const response = await res1.json();
	// 					setCards &&
	// 						setCards((prevCards) => [
	// 							{
	// 								...newTicket,
	// 								ticketNumber: response.ticketNumber,
	// 							},
	// 							...prevCards,
	// 						]);
	// 					if (setCardCache && resetFilters) {
	// 						setCardCache((prevCards) => [
	// 							{
	// 								...newTicket,
	// 								ticketNumber: response.ticketNumber,
	// 							},
	// 							...prevCards,
	// 						]);
	// 						resetFilters();
	// 					}
	// 					setEditor(init?.initState || initTicketEditor);
	// 					!isPinned && setExpand(false);
	// 					if (newTicket.project.projectId) {
	// 						const subtasksTotalIds = newTicket.subtasks.map(
	// 							(o) => o.subtaskId
	// 						);
	// 						const res2 = await protectedFetch(
	// 							`/api/project/${newTicket.project.projectId}`,
	// 							{
	// 								method: "PATCH",
	// 								body: JSON.stringify({
	// 									operation: "add",
	// 									tasksTotalIds: [newTicket.ticketId],
	// 									subtasksTotalIds,
	// 								}),
	// 							}
	// 						);

	// 						if (res2.ok) {
	// 							setProject &&
	// 								setProject((prev) =>
	// 									prev.map((proj) =>
	// 										proj.projectId ===
	// 										newTicket.project.projectId
	// 											? {
	// 													...proj,
	// 													tasksTotalIds: [
	// 														...proj.tasksTotalIds,
	// 														newTicket.ticketId,
	// 													],
	// 													subtasksTotalIds: [
	// 														...proj.subtasksTotalIds,
	// 														...(subtasksTotalIds as string[]),
	// 													],
	// 											  }
	// 											: proj
	// 									)
	// 								);
	// 						}
	// 					}
	// 				}
	// 			}
	// 		} else if (dataKind === "project") {
	// 			// Edit existing project
	// 			if (previousData) {
	// 				try {
	// 					const patchData = {
	// 						operation: "metadata",
	// 						metadata: { ...editor },
	// 					};
	// 					const res1 = await protectedFetch(
	// 						`/api/project/${previousData.projectId}`,
	// 						{
	// 							method: "PATCH",
	// 							headers: { "Content-Type": "application/json" },
	// 							body: JSON.stringify(patchData),
	// 						}
	// 					);
	// 					if (res1.ok) {
	// 						const ticketPatch = {
	// 							project: {
	// 								projectTitle: editor.title,
	// 								projectId: previousData.projectId,
	// 							},
	// 						};
	// 						const res2 = await protectedFetch(
	// 							`/api/ticket/project-edit/${previousData.projectId}`,
	// 							{
	// 								method: "PATCH",
	// 								headers: {
	// 									"Content-Type": "application/json",
	// 								},
	// 								body: JSON.stringify(ticketPatch),
	// 							}
	// 						);
	// 						if (res2.ok) {
	// 							const updatedCard: Project = {
	// 								...(patchData.metadata as ProjectEditor),
	// 								...(init!.unusedPrevData! as Project),
	// 								lastModified: Date.now(),
	// 							};
	// 							setCards((prevCards) =>
	// 								prevCards.map((card) =>
	// 									card.projectId === updatedCard.projectId
	// 										? updatedCard
	// 										: card
	// 								)
	// 							);
	// 							setCardCache &&
	// 								setCardCache((prev) =>
	// 									prev.map((card) =>
	// 										card.projectId ===
	// 										updatedCard.projectId
	// 											? updatedCard
	// 											: card
	// 									)
	// 								);
	// 							setEditor(initTicketEditor);
	// 							setEditing(false);
	// 						}
	// 					}
	// 				} catch (e) {
	// 					console.error(e);
	// 				}
	// 			} else {
	// 				// Create new project
	// 				const newCard: Project = {
	// 					...(editor as ProjectEditor),
	// 					timestamp: Date.now(),
	// 					projectId: uuidv4(),
	// 					tasksCompletedIds: [],
	// 					tasksTotalIds: [],
	// 					subtasksCompletedIds: [],
	// 					subtasksTotalIds: [],
	// 				};

	// 				const res = await protectedFetch("/api/project", {
	// 					method: "POST",
	// 					body: JSON.stringify(newCard),
	// 				});

	// 				if (res.ok) {
	// 					setCards((prevCards) => [newCard, ...prevCards]);
	// 					setEditor(initProjectEditor);
	// 					!isPinned && setExpand(false);
	// 				}
	// 			}
	// 		}
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// }

	// function handleExpand() {
	// 	setExpand(!expand);
	// 	isPinned && setPinned(false);
	// }

	// function handleReset() {
	// 	setEditor(init?.initState || initTicketEditor);
	// }

	// function handleEditCancel() {
	// 	if (previousData) {
	// 		setEditing(false);
	// 	}
	// }

	return (
		<div
			className={
				"mx-2 sm:mx-0 bg-transparent " +
				(!expand &&
					" hover:cursor-pointer hover:bg-slate-50 dark:hover:border-zinc-400 ") +
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
						<h1 className="font-semibold text-lg sm:text-lg md:text-xl">
							{init!.editorHeading}
						</h1>
					) : (
						<button
							className="font-semibold text-lg sm:text-lg md:text-xl"
							onClick={() => {
								setExpand(!expand);
							}}
							type="button"
						>
							{init!.editorHeading}
						</button>
					)}
					{expand && (
						<div className="flex flex-col lg:flex-row items-end text-xs sm:text-base ">
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
									{isPinned ? "Unpin Editor" : "Pin Editor"}
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
							setDeletedSubtaskIds,
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
