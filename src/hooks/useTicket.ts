import { useCallback, useState } from "react";
import { useProtectedFetch } from "./useProtectedFetch";
import { optionLookup } from "../utility/optionLookup";
import { FetchedTicketData, Project, TicketData } from "../types";
import { arrayExclude } from "../utility/arrayComparisons";

export function useTicket(
	taskStatus: string,
	ticketId: string,
	project: { projectTitle: string; projectId: string },
	subtasks: {
		subtaskId: string;
		description: string;
		completed: boolean;
	}[],
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>,
	setCardCache?: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>,
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>
) {
	const [statusColors, setStatusColors] = useState(
		statusColorsLookup(taskStatus)
	);
	const [isEditing, setEditing] = useState(false);
	const { protectedFetch } = useProtectedFetch();

	function statusColorsLookup(currentStatus: string) {
		const currentOption = optionLookup.taskStatus.find(
			(option) => option.value === currentStatus
		);
		const optionColors =
			currentOption?.bgColor && currentOption?.textColor
				? `${currentOption.bgColor} ${currentOption.textColor}`
				: "bg-slate-100 text-black";
		return optionColors;
	}

	const handleTaskChange = useCallback(
		async (
			projectId: string,
			taskId: string,
			updatedTaskStatus: string
		) => {
			type PatchData = {
				operation: "add" | "delete";
				tasksCompletedIds: string[];
				tasksTotalIds: string[];
			};

			async function sendPatchData(patchData: PatchData) {
				const res = await protectedFetch(`/api/project/${projectId}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(patchData),
				});
				return res;
			}

			if (projectId && updatedTaskStatus === "Completed") {
				const patchData: PatchData = {
					operation: "add",
					tasksCompletedIds: [taskId],
					tasksTotalIds: [taskId],
				};
				const res = await sendPatchData(patchData);
				if (res.ok) {
					console.log("complete task");
				}
				return res;
			} else if (projectId && updatedTaskStatus === "DELETE") {
				const patchData: PatchData = {
					operation: "delete",
					tasksCompletedIds: [taskId],
					tasksTotalIds: [taskId],
				};
				const res = await sendPatchData(patchData);
				if (res.ok) {
					console.log("deleted task");
				}
				return res;
			} else if (
				projectId &&
				updatedTaskStatus !== "Completed" &&
				updatedTaskStatus !== "DELETE"
			) {
				const patchData: PatchData = {
					operation: "delete",
					tasksCompletedIds: [taskId],
					tasksTotalIds: [],
				};
				const res = await sendPatchData(patchData);
				if (res.ok) {
					console.log("incomplete task");
				}
				return res;
			}
		},
		[protectedFetch]
	);

	const changeStatus = useCallback(
		async (
			e: React.ChangeEvent<HTMLSelectElement>
			//project: Project,
			//ticketId: string
			//setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>,
			//setStatusColors: React.Dispatch<React.SetStateAction<string>>,
			//setProject: React.Dispatch<React.SetStateAction<Project[]>>
		) => {
			const newTaskStatus = e.target.value;
			const newStatusColor = statusColorsLookup(newTaskStatus);
			try {
				const res = await protectedFetch(`/api/ticket/${ticketId}`, {
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ taskStatus: newTaskStatus }),
				});
				if (res.ok) {
					const res2 = await handleTaskChange(
						project.projectId,
						ticketId,
						newTaskStatus
					);
					if (res2?.ok) {
						setCards((prevCards) =>
							prevCards.map((card: TicketData) =>
								card.ticketId === ticketId
									? { ...card, taskStatus: newTaskStatus }
									: card
							)
						);
						setStatusColors(newStatusColor);

						setProject &&
							setProject((prev) =>
								prev.map((proj) =>
									proj.projectId === project.projectId
										? {
												...proj,
												tasksCompletedIds:
													newTaskStatus ===
													"Completed"
														? [
																...proj.tasksCompletedIds,
																ticketId,
														  ]
														: (arrayExclude(
																proj.tasksCompletedIds,
																[ticketId]
														  ) as string[]),
										  }
										: proj
								)
							);
					}
				}
			} catch (err) {
				console.error(err);
			}
		},
		[
			handleTaskChange,
			protectedFetch,
			setCards,
			setProject,
			project,
			ticketId,
		]
	);

	const deleteCard = useCallback(
		async (
			id: string
			// subtasks: {
			// 	subtaskId: string;
			// 	description: string;
			// 	completed: boolean;
			// }[]
		) => {
			try {
				const subtasksCompletedIds = subtasks
					?.filter((o) => o.completed)
					.map((o) => o.subtaskId);
				const subtasksTotalIds = subtasks?.map((o) => o.subtaskId);
				const res1 = await protectedFetch(`/api/ticket/${ticketId}`, {
					method: "DELETE",
				});
				if (res1.ok) {
					setCards((prevCards) =>
						prevCards.filter((card) => card.ticketId !== id)
					);
					setCardCache &&
						setCardCache((prev) =>
							prev.filter((card) => card.ticketId !== id)
						);

					const res2 = await protectedFetch(
						`/api/project/${project.projectId}`,
						{
							method: "PATCH",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({
								operation: "delete",
								tasksCompletedIds: [ticketId],
								tasksTotalIds: [ticketId],
								subtasksCompletedIds,
								subtasksTotalIds,
							}),
						}
					);

					if (res2.ok) {
						setProject &&
							setProject((prev) =>
								prev.map((proj) =>
									proj.projectId === project.projectId
										? {
												...proj,
												tasksCompletedIds: arrayExclude(
													proj.tasksCompletedIds,
													[ticketId]
												) as string[],
												tasksTotalIds: arrayExclude(
													proj.tasksTotalIds,
													[ticketId]
												) as string[],
												subtasksCompletedIds:
													arrayExclude(
														proj.subtasksCompletedIds,
														subtasksCompletedIds
													) as string[],
												subtasksTotalIds: arrayExclude(
													proj.subtasksTotalIds,
													subtasksTotalIds
												) as string[],
										  }
										: proj
								)
							);
						console.log("Deleted subtasks from project");
					}
				}
			} catch (err) {
				console.error(err);
			}
		},
		[
			protectedFetch,
			setCards,
			setCardCache,
			setProject,
			ticketId,
			project,
			subtasks,
		]
	);

	const editCard = useCallback(() => {
		setEditing(true);
	}, []);

	const completeSubtask = useCallback(
		async (id: string) => {
			if (subtasks) {
				const targetSubtask = subtasks.find(
					(subtask) => subtask.subtaskId === id
				);
				const updatedCompletion = !targetSubtask?.completed;
				const updatedSubtasks = subtasks.map((subtask) =>
					subtask.subtaskId === id
						? { ...subtask, completed: updatedCompletion }
						: subtask
				);

				const subtasksCompletedIds = [targetSubtask!.subtaskId];
				const subtasksTotalIds: string[] = [];

				try {
					const res1 = await protectedFetch(
						`/api/ticket/${ticketId}`,
						{
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify({ subtasks: updatedSubtasks }),
						}
					);
					if (res1.ok) {
						setCards((prevCards) =>
							prevCards.map((card) =>
								card.ticketId === ticketId
									? {
											...card,
											subtasks: updatedSubtasks,
											lastModified: Date.now(),
									  }
									: card
							)
						);
						if (project.projectId) {
							const operation = updatedCompletion
								? "add"
								: "delete";

							setProject &&
								setProject((prev) =>
									prev.map((proj) =>
										proj.projectId === project.projectId
											? {
													...proj,
													subtasksCompletedIds:
														operation === "add"
															? [
																	...proj.subtasksCompletedIds,
																	...(subtasksCompletedIds as string[]),
															  ]
															: (arrayExclude(
																	proj.subtasksCompletedIds,
																	subtasksCompletedIds
															  ) as string[]),
											  }
											: proj
									)
								);

							const res2 = await protectedFetch(
								`/api/project/${project.projectId}`,
								{
									method: "PATCH",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										operation,
										subtasksCompletedIds,
										subtasksTotalIds,
									}),
								}
							);
							if (res2.ok) {
								console.log(
									"Incremented completed tasks for project"
								);
							}
						}
					}
				} catch (e) {
					console.error(e);
				}
			}
		},
		[
			project.projectId,
			protectedFetch,
			setCards,
			setProject,
			subtasks,
			ticketId,
		]
	);

	return {
		deleteCard,
		editCard,
		changeStatus,
		completeSubtask,
		isEditing,
		setEditing,
		statusColors,
	};
}
