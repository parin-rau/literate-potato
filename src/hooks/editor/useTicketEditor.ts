import { useCallback } from "react";
import { useProtectedFetch } from "../utility/useProtectedFetch";
import {
	EditorData,
	FetchedTicketData,
	Project,
	initTicketEditor,
} from "../../types";
import { arrayExclude, arraysEqual } from "../../utility/arrayComparisons";
import { statusColorsLookup } from "../../utility/optionLookup";

// type CommonProps = {
// 	dataKind: string;
// 	resetFilters?: () => void;
//     isProjectPage: boolean
// };

// type CommonTicketProps = {
// 	dataKind: "ticket";
// 	setCards?: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
// 	setCardCache?: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
//     resetFilters?: () => void;
// };

// type CreatingTicketProps = CommonTicketProps & {
// 	project?: { projectId: string; projectTitle: string };
// 	previousData?: never;
// 	setEditing?: never;
// 	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
// 	setStatusColors?: never;
// };

// type EditingTicketProps = CommonTicketProps & {
// 	project?: never;
// 	previousData: FetchedTicketData;
// 	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
// 	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
// 	setStatusColors: React.Dispatch<React.SetStateAction<string>>;
// };

type Props = {
	dataKind: string;
	resetFilters?: () => void;
	isProjectPage: boolean;
	setCards?: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	setCardCache?: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	project?: { projectId: string; projectTitle: string };
	previousData: FetchedTicketData;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
	setStatusColors: React.Dispatch<React.SetStateAction<string>>;
	editor: EditorData;
	setEditor: React.Dispatch<React.SetStateAction<EditorData>>;
	isPinned: boolean;
	init;
	deletedSubtaskIds: string[];
	setDeletedSubtaskIds: React.Dispatch<React.SetStateAction<string[]>>;
	setExpand: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useTicketEditor(props: Props) {
	const {
		dataKind,
		setCards,
		previousData,
		setEditing,
		setCardCache,
		resetFilters,
		setProject,
		setStatusColors,
		isProjectPage,
		editor,
		setEditor,
		isPinned,
		init,
		setExpand,
		deletedSubtaskIds,
		setDeletedSubtaskIds,
	} = props;

	const { protectedFetch } = useProtectedFetch();

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
					//operation === "add": {
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
					// return { state: [], setterInput: [] };
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
		};
		const res1 = await protectedFetch("/api/ticket", {
			method: "POST",
			body: JSON.stringify(newTicket),
		});
		if (res1.ok) {
			const response = await res1.json();
			setCards &&
				setCards(
					(prevCards) =>
						[
							{
								...newTicket,
								ticketNumber: response.ticketNumber,
							},
							...prevCards,
						] as FetchedTicketData[]
				);
			if (setCardCache && resetFilters) {
				setCardCache(
					(prevCards) =>
						[
							{
								...newTicket,
								ticketNumber: response.ticketNumber,
							},
							...prevCards,
						] as FetchedTicketData[]
				);
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
						setProject(
							(prev) =>
								prev.map((proj) =>
									proj.projectId ===
									newTicket.project.projectId
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
								) as Project[]
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
		setEditor,
		setExpand,
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

				const setUpdatedCompletedTasks = () =>
					updateCompletedTaskIds(
						updatedTicket.taskStatus,
						updatedTicket.project.projectId,
						updatedTicket.ticketId
					);

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
						setUpdatedCompletedTasks();

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

						setUpdatedCompletedTasks();

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
						setUpdatedCompletedTasks();

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
		setDeletedSubtaskIds,
		setEditing,
		setEditor,
		setProject,
		setStatusColors,
		subtaskIdPatch,
		updateCompletedTaskIds,
		updateTaskStatus,
	]);

	return { createTicket, editTicket };
}

function uuidv4() {
	throw new Error("Function not implemented.");
}
