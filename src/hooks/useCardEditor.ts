import { useState, useCallback } from "react";
import {
	EditorData,
	FetchedTicketData,
	Project,
	ProjectEditor,
	initProjectEditor,
	initTicketEditor,
} from "../types";
import { useLocation } from "react-router-dom";
import { useProtectedFetch } from "./useProtectedFetch";
import { v4 as uuidv4 } from "uuid";
import { arrayExclude, arraysEqual } from "../utility/arrayComparisons";
import { statusColorsLookup } from "../utility/optionLookup";

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
	setCards?: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	setCardCache?: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
};

type CreatingProjectProps = CommonProjectProps & {
	project?: never;
	previousData?: never;
	setEditing?: never;
	setProject?: never;
	setStatusColors?: never;
};

type CreatingTicketProps = CommonTicketProps & {
	project?: { projectId: string; projectTitle: string };
	previousData?: never;
	setEditing?: never;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
	setStatusColors?: never;
};

type EditingProjectProps = CommonProjectProps & {
	project?: never;
	previousData: Project;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
	setProject?: never;
	setStatusColors?: never;
};

type EditingTicketProps = CommonTicketProps & {
	project?: never;
	previousData: FetchedTicketData;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
	setStatusColors: React.Dispatch<React.SetStateAction<string>>;
};

export type Props = CommonProps &
	(
		| (CreatingTicketProps | EditingTicketProps)
		| (CreatingProjectProps | EditingProjectProps)
	);

export function useCardEditor(props: Props) {
	const {
		dataKind,
		setCards,
		previousData,
		setEditing,
		setCardCache,
		resetFilters,
		setProject,
		setStatusColors,
	} = props;

	const [deletedSubtaskIds, setDeletedSubtaskIds] = useState<string[]>([]);
	const [isPinned, setPinned] = useState(false);
	const { protectedFetch } = useProtectedFetch();

	const url = useLocation().pathname;
	const isProjectPage = url.slice(1, 8) === "project";

	// INITIALIZER

	const handleInit = useCallback(
		(dataKind: "ticket" | "project") => {
			const { previousData } = props;

			switch (dataKind) {
				case "ticket": {
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
				}
				case "project": {
					if (previousData) {
						const {
							title,
							description,
							creator,
							color,
							...unusedPrevData
						} = previousData as Project;
						return {
							initState: {
								title,
								description,
								creator,
								color,
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
				}
				default: {
					return console.error("Init undefined");
				}
			}
		},
		[props]
	);

	const init = handleInit(dataKind);
	const [editor, setEditor] = useState(init!.initState);
	const [expand, setExpand] = useState(init!.defaultExpand);

	// LOCAL HELPERS

	const subtaskIdPatch = useCallback(
		async (
			projectId: string,
			operation: "add" | "delete",
			subtasksCompletedIds: string[],
			subtasksTotalIds: string[],
			tasksCompletedIds?: string[],
			tasksTotalIds?: string[]
		) => {
			const res = await protectedFetch(`/api/project/${projectId}`, {
				method: "PATCH",
				body: JSON.stringify({
					operation,
					subtasksCompletedIds,
					subtasksTotalIds,
					tasksCompletedIds,
					tasksTotalIds,
				}),
			});
			return res;
		},
		[protectedFetch]
	);

	const handleProjectChange = useCallback(
		(currentViewProjectId: string) => {
			if (isProjectPage && dataKind === "ticket") {
				setCards &&
					setCards((prev) =>
						prev.filter(
							(ticket) =>
								ticket.project.projectId ===
								currentViewProjectId
						)
					);
			}
		},
		[dataKind, setCards, isProjectPage]
	);

	const updateTaskStatus = useCallback(
		(
			prevTaskStatus: string,
			prevCompSubIds: string[],
			prevTotSubIds: string[],
			newCompSubIds: string[],
			newTotSubIds: string[]
		) => {
			const changedCompletedIds = !arraysEqual(
				prevCompSubIds,
				newCompSubIds
			);
			const changedTotalIds = !arraysEqual(prevTotSubIds, newTotSubIds);

			switch (true) {
				case (changedTotalIds || changedCompletedIds) &&
					newCompSubIds.length === 0:
					return "Not Started";
				case (changedTotalIds || changedCompletedIds) &&
					newCompSubIds.length < newTotSubIds.length:
					return "In Progress";
				case (changedTotalIds || changedCompletedIds) &&
					newCompSubIds.length === newTotSubIds.length:
					return "Completed";
				default:
					return prevTaskStatus;
			}
		},
		[]
	);

	const updateCompletedTaskIds = useCallback(
		(
			operation: "add" | "delete",
			newTaskStatus: string,
			ticketId: string,
			completedTaskIds: string[]
		) => {
			const isUnique = !completedTaskIds.includes(ticketId);

			switch (true) {
				case !isUnique && operation === "add":
					console.log("case 1: adding subtask causes incomplete");
					return {
						state: arrayExclude(completedTaskIds, [ticketId]),
						setterInput: completedTaskIds,
					};
				case !isUnique && operation === "delete":
					console.log("case 2: deleting subtask causes incomplete");
					return {
						state: arrayExclude(completedTaskIds, [ticketId]),
						setterInput: completedTaskIds,
					};
				// case isUnique &&
				// 	operation === "add" &&
				// 	newTaskStatus === "Completed":
				// 	console.log("case 3");
				// 	return {state: [...completedTaskIds, ticketId], setterInput: completedTaskIds};
				case isUnique &&
					operation === "delete" &&
					newTaskStatus === "Completed":
					console.log(
						"case 4: deleting incomplete subtasks causes completion"
					);
					return {
						state: [...completedTaskIds, ticketId],
						setterInput: [ticketId],
					};
				case isUnique && operation === "delete":
					console.log(
						"case 5: deleting subtasks from incomplete task and not causing completion"
					);
					return { state: completedTaskIds, setterInput: [] };
				default:
					console.log("default case");
					return { state: [], setterInput: [] };
			}
		},
		[]
	);

	const createTicket = useCallback(async () => {
		if (dataKind !== "ticket") return;

		const newTicket = {
			...(editor as EditorData),
			timestamp: Date.now(),
			ticketId: uuidv4(),
			taskStatus: "Not Started",
			comments: [],
		};
		const res1 = await protectedFetch("/api/ticket", {
			method: "POST",
			body: JSON.stringify(newTicket),
		});
		if (res1.ok) {
			const response = await res1.json();
			setCards &&
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
				const subtasksTotalIds = newTicket.subtasks.map(
					(o) => o.subtaskId
				);
				const res2 = await protectedFetch(
					`/api/project/${newTicket.project.projectId}`,
					{
						method: "PATCH",
						body: JSON.stringify({
							operation: "add",
							tasksTotalIds: [newTicket.ticketId],
							subtasksTotalIds,
						}),
					}
				);

				if (res2.ok) {
					setProject &&
						setProject((prev) =>
							prev.map((proj) =>
								proj.projectId === newTicket.project.projectId
									? {
											...proj,
											tasksTotalIds: [
												...proj.tasksTotalIds,
												newTicket.ticketId,
											],
											subtasksTotalIds: [
												...proj.subtasksTotalIds,
												...(subtasksTotalIds as string[]),
											],
									  }
									: proj
							)
						);
				}
			}
		}
	}, [
		dataKind,
		editor,
		init?.initState,
		isPinned,
		protectedFetch,
		resetFilters,
		setCardCache,
		setCards,
		setProject,
	]);

	const editTicket = useCallback(async () => {
		if (dataKind !== "ticket" || !previousData) return;

		// const patchData = {
		// 	...editor,
		// };

		// const updatedTicket: FetchedTicketData = {
		// 	...(patchData as EditorData),
		// 	...(init!.unusedPrevData as FetchedTicketData),
		// 	lastModified: Date.now(),
		// };

		// Updating subtask IDs stored on projects

		const previousSubtaskIds = previousData.subtasks.map(
			(o) => o.subtaskId
		);
		const updatedSubtaskIds = (editor as EditorData).subtasks.map(
			(o) => o.subtaskId
		);
		const previousCompletedIds = previousData.subtasks
			.filter((o) => o.completed)
			.map((o) => o.subtaskId);
		const updatedCompletedIds = (editor as EditorData).subtasks
			.filter((o) => o.completed)
			.map((o) => o.subtaskId);

		const newTaskStatus = updateTaskStatus(
			previousData.taskStatus,
			previousCompletedIds,
			previousSubtaskIds,
			updatedCompletedIds,
			updatedSubtaskIds
		);

		const patchData = {
			...editor,
			taskStatus: newTaskStatus,
		};

		try {
			const res1 = await protectedFetch(
				`/api/ticket/${previousData.ticketId}`,
				{
					method: "PATCH",
					body: JSON.stringify(patchData),
				}
			);
			if (res1.ok) {
				const updatedTicket: FetchedTicketData = {
					...(init!.unusedPrevData as FetchedTicketData),
					...(patchData as FetchedTicketData),
					lastModified: Date.now(),
				};

				setCards &&
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
				setStatusColors(statusColorsLookup(newTaskStatus));
				setEditor(init?.initState || initTicketEditor);
				setEditing(false);

				// Updating subtask IDs stored on projects

				// const previousSubtaskIds = previousData.subtasks.map(
				// 	(o) => o.subtaskId
				// );
				// const updatedSubtaskIds = updatedTicket.subtasks.map(
				// 	(o) => o.subtaskId
				// );
				// const previousCompletedIds = previousData.subtasks
				// 	.filter((o) => o.completed)
				// 	.map((o) => o.subtaskId);
				// const updatedCompletedIds = updatedTicket.subtasks
				// 	.filter((o) => o.completed)
				// 	.map((o) => o.subtaskId);

				if (
					arraysEqual(previousSubtaskIds, updatedSubtaskIds) &&
					previousData.project.projectId ===
						updatedTicket.project.projectId
				) {
					console.log("No change to subtasks");
					return;
				} else {
					// const newCompleteTaskIds = updateCompletedTaskIds(operation)

					// Moving ticket between projects
					if (
						previousData.project.projectId &&
						previousData.project.projectId !==
							updatedTicket.project.projectId
					) {
						const res2 = await subtaskIdPatch(
							previousData.project.projectId,
							"delete",
							previousCompletedIds,
							previousSubtaskIds,
							[previousData.ticketId],
							[previousData.ticketId]
						);

						if (res2.ok) {
							handleProjectChange(previousData.project.projectId);

							setProject &&
								setProject((prev) =>
									prev.map((proj) =>
										proj.projectId ===
										previousData.project.projectId
											? {
													...proj,

													tasksCompletedIds:
														arrayExclude(
															proj.tasksCompletedIds,
															[
																previousData.ticketId,
															]
														) as string[],

													tasksTotalIds: arrayExclude(
														proj.tasksTotalIds,
														[previousData.ticketId]
													) as string[],

													subtasksCompletedIds:
														arrayExclude(
															proj.subtasksCompletedIds,
															previousCompletedIds
														) as string[],

													subtasksTotalIds:
														arrayExclude(
															proj.subtasksTotalIds,
															previousSubtaskIds
														) as string[],
											  }
											: proj
									)
								);
						}
					}

					// Add new subtasks to project
					if (updatedTicket.project.projectId) {
						console.log("adding new subtasks to project");
						const res3 = await subtaskIdPatch(
							updatedTicket.project.projectId,
							"add",
							updatedCompletedIds,
							updatedSubtaskIds,
							updatedTicket.taskStatus === "Completed"
								? [updatedTicket.ticketId]
								: [],
							[updatedTicket.ticketId]
						);
						if (res3.ok) {
							console.log("res3 ok");

							setProject &&
								setProject((prev) =>
									prev.map((proj) =>
										proj.projectId ===
										updatedTicket.project.projectId
											? {
													...proj,
													subtasksTotalIds: [
														...proj.subtasksTotalIds,
														...(arrayExclude(
															updatedSubtaskIds,
															proj.subtasksTotalIds
														) as string[]),
													],
													tasksCompletedIds:
														updateCompletedTaskIds(
															"add",
															updatedTicket.taskStatus,
															updatedTicket.ticketId,
															proj.tasksCompletedIds
														).state as string[],
													// [
													// 	...(arrayExclude(
													// 		proj.tasksCompletedIds,
													// 		[
													// 			updatedTicket.ticketId,
													// 		]
													// 	) as string[]),
													// ],
											  }
											: proj
									)
								);
						}
					}

					// Deleting subtasks without moving to different project
					if (deletedSubtaskIds.length) {
						const res4 = await subtaskIdPatch(
							updatedTicket.project.projectId,
							"delete",
							deletedSubtaskIds,
							deletedSubtaskIds,
							newTaskStatus === "Completed"
								? []
								: [updatedTicket.ticketId],
							[]
						);

						if (res4.ok) {
							setProject &&
								setProject((prev) =>
									prev.map((proj) =>
										proj.projectId ===
										updatedTicket.project.projectId
											? {
													...proj,
													subtasksCompletedIds:
														arrayExclude(
															proj.subtasksCompletedIds,
															deletedSubtaskIds
														) as string[],
													subtasksTotalIds:
														arrayExclude(
															proj.subtasksTotalIds,
															deletedSubtaskIds
														) as string[],
													tasksCompletedIds:
														updateCompletedTaskIds(
															"delete",
															newTaskStatus,
															updatedTicket.ticketId,
															proj.tasksCompletedIds
														).state as string[],
													// newTaskStatus ===
													// "Completed"
													// 	? [
													// 			...proj.tasksCompletedIds,
													// 	  ]
													// 	: (arrayExclude(
													// 			proj.tasksCompletedIds,
													// 			[
													// 				updatedTicket.ticketId,
													// 			]
													// 	  ) as string[]),
											  }
											: proj
									)
								);

							setDeletedSubtaskIds([]);
						}
					}
				}
			}
		} catch (e) {
			console.error(e);
		}
	}, [
		dataKind,
		deletedSubtaskIds,
		editor,
		handleProjectChange,
		init,
		previousData,
		protectedFetch,
		setCardCache,
		setCards,
		setEditing,
		setProject,
		setStatusColors,
		subtaskIdPatch,
		updateCompletedTaskIds,
		updateTaskStatus,
	]);

	const createProject = useCallback(async () => {
		if (dataKind !== "project") return;

		const newCard: Project = {
			...(editor as ProjectEditor),
			timestamp: Date.now(),
			projectId: uuidv4(),
			tasksCompletedIds: [],
			tasksTotalIds: [],
			subtasksCompletedIds: [],
			subtasksTotalIds: [],
		};

		try {
			const res = await protectedFetch("/api/project", {
				method: "POST",
				body: JSON.stringify(newCard),
			});

			if (res.ok) {
				setCards((prevCards) => [newCard, ...prevCards]);
				setEditor(initProjectEditor);
				!isPinned && setExpand(false);
			}
		} catch (e) {
			console.error(e);
		}
	}, [dataKind, editor, isPinned, protectedFetch, setCards]);

	const editProject = useCallback(async () => {
		if (dataKind !== "project" || !previousData) return;

		try {
			const patchData = {
				operation: "metadata",
				metadata: { ...editor },
			};
			const res1 = await protectedFetch(
				`/api/project/${previousData.projectId}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(patchData),
				}
			);
			if (res1.ok) {
				const ticketPatch = {
					project: {
						projectTitle: editor.title,
						projectId: previousData.projectId,
					},
				};
				const res2 = await protectedFetch(
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
						...(patchData.metadata as ProjectEditor),
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
								card.projectId === updatedCard.projectId
									? updatedCard
									: card
							)
						);
					setEditor(initTicketEditor);
					setEditing(false);
				}
			}
		} catch (e) {
			console.error(e);
		}
	}, [
		dataKind,
		editor,
		init,
		previousData,
		protectedFetch,
		setCardCache,
		setCards,
		setEditing,
	]);

	// EXPOSED FUNCTIONS

	const handleExpand = useCallback(() => {
		setExpand(!expand);
		isPinned && setPinned(false);
	}, [isPinned, expand]);

	const handleReset = useCallback(() => {
		setEditor(init?.initState || initTicketEditor);
	}, [init?.initState]);

	const handleEditCancel = useCallback(() => {
		if (previousData) {
			setEditing(false);
		}
	}, [previousData, setEditing]);

	const handleChange = useCallback(
		(
			e: React.ChangeEvent<
				HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
			>
		) => {
			const { value, name } = e.target;
			if (name === "projectId" || name === "projectTitle") {
				setEditor({
					...(editor as EditorData),
					project: {
						...(editor as EditorData).project,
						[name]: value,
					},
				});
			} else {
				setEditor({ ...editor, [name]: value });
			}
		},
		[editor]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLFormElement>) => {
			if (e.code === "Enter" && e.ctrlKey === false) {
				e.preventDefault();
			}
		},
		[]
	);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			switch (true) {
				case dataKind === "ticket" && !previousData:
					await createTicket();
					return console.log("creating ticket");
				case dataKind === "ticket":
					await editTicket();
					return console.log("editing ticket");
				case dataKind === "project" && !previousData:
					await createProject();
					return console.log("creating project");
				case dataKind === "project":
					await editProject();
					return console.log("editing project");
				default:
					return console.error("Unable to submit editor data");
			}
		},
		[
			createProject,
			createTicket,
			dataKind,
			editProject,
			editTicket,
			previousData,
		]
	);

	return {
		handlers: {
			handleSubmit,
			handleExpand,
			handleReset,
			handleEditCancel,
			handleChange,
			handleKeyDown,
		},
		state: {
			init,
			editor,
			setEditor,
			isPinned,
			setPinned,
			expand,
			setExpand,
			setDeletedSubtaskIds,
		},
	};
}
