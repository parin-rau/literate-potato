import { useState, useCallback } from "react";
import {
	EditorData,
	FetchedTicketData,
	Project,
	ProjectEditor,
	initProjectEditor,
	initTicketEditor,
} from "../../types";
import { useLocation, useParams } from "react-router-dom";
import { useProtectedFetch } from "../utility/useProtectedFetch";
import { v4 as uuidv4 } from "uuid";
import { arrayExclude, arraysEqual } from "../../utility/arrayComparisons";
import { statusColorsLookup } from "../../utility/optionLookup";
import { useAuth } from "../auth/useAuth";
//import { useTicketEditor } from "./useTicketEditor";
//import { useProjectEditor } from "./useProjectEditor";

type CommonProps = {
	dataKind: string;
	resetFilters?: () => void;
	group?: { groupId: string; groupTitle: string };
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
	const { user } = useAuth();

	const url = useLocation().pathname;
	const isProjectPage = url.slice(1, 8) === "project";
	const { id: idParam } = useParams();

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
							group,
							assignee,
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
								group,
								assignee,
							},
							unusedPrevData,
							defaultExpand: true,
							editorHeading: "Edit Task",
						};
					} else {
						const { project, group } = props;
						return {
							initState: { ...initTicketEditor, project, group },
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
							group,
							...unusedPrevData
						} = previousData as Project;
						return {
							initState: {
								title,
								description,
								creator,
								color,
								group,
							},
							unusedPrevData,
							defaultExpand: true,
							editorHeading: "Edit Project",
						};
					} else {
						const { group } = props;
						return {
							initState: {
								...initProjectEditor,
								group: group ?? { groupId: "", groupTitle: "" },
							},
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

	//const { createTicket, editTicket} = useTicketEditor({...props, isProjectPage, editor, setEditor, isPinned, init, deletedSubtaskIds, setDeletedSubtaskIds})

	// LOCAL HELPERS

	const subtaskIdPatch = useCallback(
		async (
			projectId: string,
			operation: "add" | "delete",
			newTaskStatus: string,
			subtasksCompletedIds: string[],
			subtasksTotalIds: string[],
			tasksCompletedIds?: string[],
			tasksTotalIds?: string[]
		) => {
			const res = await protectedFetch(`/api/project/${projectId}`, {
				method: "PATCH",
				body: JSON.stringify({
					operation,
					newTaskStatus,
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
			//operation: "add" | "delete",
			newTaskStatus: string,
			projectId: string,
			ticketId: string
			//completedTaskIds: string[]
		) => {
			const isUnique = (completedTasks: string[]) =>
				!completedTasks.includes(ticketId);

			if (!setProject) return;

			switch (true) {
				case newTaskStatus === "Completed": {
					console.log("case 1: completed task");
					setProject((prev) =>
						prev.map((p) =>
							p.projectId === projectId
								? {
										...p,
										tasksCompletedIds: isUnique(
											p.tasksCompletedIds
										)
											? [...p.tasksCompletedIds, ticketId]
											: p.tasksCompletedIds,
								  }
								: p
						)
					);
					return;
				}
				case newTaskStatus !== "Completed": {
					console.log("case 2: incomplete task");

					setProject((prev) =>
						prev.map((p) =>
							p.projectId === projectId
								? {
										...p,
										tasksCompletedIds: isUnique(
											p.tasksCompletedIds
										)
											? p.tasksCompletedIds
											: (arrayExclude(
													p.tasksCompletedIds,
													[ticketId]
											  ) as string[]),
								  }
								: p
						)
					);

					return;
				}

				default: {
					console.log("default case");
					return;
				}
			}
		},
		[setProject]
	);

	const createTicket = useCallback(async () => {
		if (dataKind !== "ticket") return;

		const newTicket = {
			...(editor as EditorData),
			timestamp: Date.now(),
			ticketId: uuidv4(),
			taskStatus: "Not Started",
			comments: [],
			creator: {
				username: user.current!.username,
				userId: user.current!.userId,
			},
			//group: { groupId: "", groupTitle: "" },
		};
		const inCurrentView = newTicket.project.projectId === idParam;

		const res1 = await protectedFetch("/api/ticket", {
			method: "POST",
			body: JSON.stringify(newTicket),
		});
		if (res1.ok) {
			const response = await res1.json();
			inCurrentView &&
				setCards &&
				setCards((prevCards) => [
					{
						...newTicket,
						ticketNumber: response.ticketNumber,
					},
					...prevCards,
				]);
			if (setCardCache && resetFilters) {
				inCurrentView &&
					setCardCache((prevCards) => [
						{
							...newTicket,
							ticketNumber: response.ticketNumber,
						},
						...prevCards,
					]);
				resetFilters();
			}
			setEditor(init?.initState ?? initTicketEditor);
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
					inCurrentView &&
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
		idParam,
		init?.initState,
		isPinned,
		protectedFetch,
		resetFilters,
		setCardCache,
		setCards,
		setProject,
		user,
	]);

	const editTicket = useCallback(async () => {
		if (dataKind !== "ticket" || !previousData) return;

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
				const inCurrentView =
					updatedTicket.project.projectId === idParam;

				inCurrentView &&
					setCards &&
					setCards((prevCards) =>
						prevCards.map((card) =>
							card.ticketId === updatedTicket.ticketId
								? updatedTicket
								: card
						)
					);
				inCurrentView &&
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

				const setUpdatedCompletedTasks = () =>
					updateCompletedTaskIds(
						updatedTicket.taskStatus,
						updatedTicket.project.projectId,
						updatedTicket.ticketId
					);

				// Updating subtask IDs stored on projects

				if (
					arraysEqual(previousSubtaskIds, updatedSubtaskIds) &&
					previousData.project.projectId ===
						updatedTicket.project.projectId
				) {
					console.log("No change to subtasks");
					return;
				} else {
					// Moving ticket between projects
					if (
						previousData.project.projectId &&
						previousData.project.projectId !==
							updatedTicket.project.projectId
					) {
						setUpdatedCompletedTasks();

						const res2 = await subtaskIdPatch(
							previousData.project.projectId,
							"delete",
							newTaskStatus,
							previousCompletedIds,
							previousSubtaskIds,
							[previousData.ticketId],
							[previousData.ticketId]
						);

						if (res2.ok) {
							handleProjectChange(previousData.project.projectId);

							inCurrentView &&
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

						setUpdatedCompletedTasks();

						const res3 = await subtaskIdPatch(
							updatedTicket.project.projectId,
							"add",
							newTaskStatus,
							updatedCompletedIds,
							updatedSubtaskIds,
							[updatedTicket.ticketId],
							[updatedTicket.ticketId]
						);
						if (res3.ok) {
							inCurrentView &&
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
											  }
											: proj
									)
								);
						}
					}

					// Deleting subtasks without moving to different project
					if (deletedSubtaskIds.length) {
						setUpdatedCompletedTasks();

						const res4 = await subtaskIdPatch(
							updatedTicket.project.projectId,
							"delete",
							newTaskStatus,
							deletedSubtaskIds,
							deletedSubtaskIds,
							[updatedTicket.ticketId],
							[]
						);

						if (res4.ok) {
							inCurrentView &&
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
		idParam,
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
			creator: {
				userId: user.current!.userId,
				username: user.current!.username,
			},
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
				newCard.group.groupId === idParam &&
					setCards((prevCards) => [newCard, ...prevCards]);
				setEditor(init!.initState ?? initProjectEditor);
				!isPinned && setExpand(false);
			}
		} catch (e) {
			console.error(e);
		}
	}, [
		dataKind,
		editor,
		user,
		protectedFetch,
		idParam,
		setCards,
		init,
		isPinned,
	]);

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
					const inCurrentView = updatedCard.group.groupId === idParam;
					inCurrentView &&
						setCards((prevCards) =>
							prevCards.map((card) =>
								card.projectId === updatedCard.projectId
									? updatedCard
									: card
							)
						);
					inCurrentView &&
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
		idParam,
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
			} else if (name === "groupId" || name === "groupTitle") {
				setEditor({
					...(editor as EditorData),
					group: {
						...(editor as EditorData).group,
						[name]: value,
					},
				});
			} else if (name === "userId" || name === "username") {
				setEditor({
					...(editor as EditorData),
					assignee: {
						...(editor as EditorData).assignee,
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
