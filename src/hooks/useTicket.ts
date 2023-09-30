import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProtectedFetch } from "./useProtectedFetch";
import { optionLookup } from "../utility/optionLookup";
import { FetchedTicketData, Project, TicketData } from "../types";
import { arrayExclude } from "../utility/arrayComparisons";

export type Props = {
	cardData: FetchedTicketData;
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	filters?: string[];
	setFilters?: React.Dispatch<React.SetStateAction<string[]>>;

	setCardCache?: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
};

export function useTicket(props: Props) {
	const { taskStatus, ticketId, project, subtasks } = props.cardData;
	const { setCards, setCardCache, setProject } = props;
	const navigate = useNavigate();

	const statusColorsLookup = useCallback((currentStatus: string) => {
		const currentOption = optionLookup.taskStatus.find(
			(option) => option.value === currentStatus
		);
		const optionColors =
			currentOption?.bgColor && currentOption?.textColor
				? `${currentOption.bgColor} ${currentOption.textColor}`
				: "bg-slate-100 text-black";
		return optionColors;
	}, []);

	const [statusColors, setStatusColors] = useState(
		statusColorsLookup(taskStatus)
	);
	const [isEditing, setEditing] = useState(false);
	const { protectedFetch } = useProtectedFetch();

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
					body: JSON.stringify(patchData),
				});
				return res;
			}

			switch (true) {
				case projectId && updatedTaskStatus === "Completed": {
					const patchData: PatchData = {
						operation: "add",
						tasksCompletedIds: [taskId],
						tasksTotalIds: [taskId],
					};
					const res = await sendPatchData(patchData);
					return res;
				}
				case projectId && updatedTaskStatus === "DELETE": {
					const patchData: PatchData = {
						operation: "delete",
						tasksCompletedIds: [taskId],
						tasksTotalIds: [taskId],
					};
					const res = await sendPatchData(patchData);
					return res;
				}
				case projectId &&
					updatedTaskStatus !== "Completed" &&
					updatedTaskStatus !== "DELETE": {
					const patchData: PatchData = {
						operation: "delete",
						tasksCompletedIds: [taskId],
						tasksTotalIds: [],
					};
					const res = await sendPatchData(patchData);
					return res;
				}
				default:
					return new Response();
			}
		},
		[protectedFetch]
	);

	const changeStatus = useCallback(
		async (e: React.ChangeEvent<HTMLSelectElement>) => {
			const newTaskStatus = e.target.value;
			const newStatusColor = statusColorsLookup(newTaskStatus);
			try {
				const res = await protectedFetch(`/api/ticket/${ticketId}`, {
					method: "PATCH",
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
			statusColorsLookup,
			protectedFetch,
			ticketId,
			handleTaskChange,
			project.projectId,
			setCards,
			setProject,
		]
	);

	const deleteCard = useCallback(
		async (id: string) => {
			try {
				const subtasksCompletedIds = subtasks
					?.filter((o) => o.completed)
					.map((o) => o.subtaskId);
				const subtasksTotalIds = subtasks?.map((o) => o.subtaskId);
				const res1 = await protectedFetch(`/api/ticket/${ticketId}`, {
					method: "DELETE",
				});
				if (res1.ok) {
					const res2 = await protectedFetch(
						`/api/project/${project.projectId}`,
						{
							method: "PATCH",
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
						if (!setProject) return navigate("/");

						setCards((prevCards) =>
							prevCards.filter((card) => card.ticketId !== id)
						);
						setCardCache &&
							setCardCache((prev) =>
								prev.filter((card) => card.ticketId !== id)
							);

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

						//console.log("Deleted subtasks from project");
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
			navigate,
		]
	);

	const editCard = useCallback(() => {
		setEditing(true);
	}, []);

	const getNewTaskStatus = useCallback(
		(
			completedSubtasksCount: number,
			totalSubtasksCount: number,
			currentTaskStatus: string
		) => {
			const newTaskStatus = (
				completed: number,
				total: number,
				fallbackStatus: string
			) => {
				switch (true) {
					case total > 0 && completed === total:
						return "Completed";
					case total > 0 && completed > 0 && completed < total:
						return "In Progress";
					case total > 0 && completed === 0:
						return "Not Started";
					default:
						return fallbackStatus;
				}
			};

			const updatedTaskStatus = newTaskStatus(
				completedSubtasksCount,
				totalSubtasksCount,
				currentTaskStatus
			);

			if (updatedTaskStatus === currentTaskStatus) {
				return currentTaskStatus;
			} else {
				setStatusColors(statusColorsLookup(updatedTaskStatus));
				return updatedTaskStatus;
			}
		},
		[statusColorsLookup]
	);

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

				const completedSubtasksCount = updatedSubtasks
					.map((s) => (s.completed ? 1 : 0))
					.reduce((a: number, c) => a + c, 0);

				const updatedTaskStatus = getNewTaskStatus(
					completedSubtasksCount,
					subtasks.length,
					taskStatus
				);

				try {
					const res1 = await protectedFetch(
						`/api/ticket/${ticketId}`,
						{
							method: "PATCH",
							body: JSON.stringify({
								subtasks: updatedSubtasks,
								taskStatus: updatedTaskStatus,
							}),
						}
					);
					if (res1.ok) {
						setCards((prevCards) =>
							prevCards.map((card) =>
								card.ticketId === ticketId
									? {
											...card,
											subtasks: updatedSubtasks,
											taskStatus: updatedTaskStatus,
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
													tasksCompletedIds:
														updatedTaskStatus ===
														"Completed"
															? [
																	...proj.tasksCompletedIds,
																	ticketId,
															  ]
															: proj.tasksCompletedIds.filter(
																	(i) =>
																		i !==
																		ticketId
															  ),
											  }
											: proj
									)
								);

							const taskIdPatchData = () => {
								switch (true) {
									case operation === "add" &&
										updatedTaskStatus === "Completed":
										return [ticketId];
									case operation === "delete":
										return [ticketId];
									default:
										return [];
								}
							};

							const projectPatchData = {
								operation,
								subtasksCompletedIds,
								subtasksTotalIds,
								tasksCompletedIds: taskIdPatchData(),
								tasksTotalIds: [],
							};

							await protectedFetch(
								`/api/project/${project.projectId}`,
								{
									method: "PATCH",
									body: JSON.stringify(projectPatchData),
								}
							);

							// 	console.log(
							// 		"Incremented completed tasks for project"
							// 	);
						}
					}
				} catch (e) {
					console.error(e);
				}
			}
		},
		[
			getNewTaskStatus,
			project.projectId,
			protectedFetch,
			setCards,
			setProject,
			subtasks,
			ticketId,
			taskStatus,
		]
	);

	const isOverdue = useCallback((dateStr: string) => {
		const currentTime = new Date();
		currentTime.setHours(0, 0, 0, 0);

		const s = dateStr.split("-").map((n) => Number(n));
		const dueDate = new Date(s[0], s[1] - 1, s[2]);

		if (currentTime.getTime() > dueDate.getTime()) {
			return true;
		} else {
			return false;
		}
	}, []);

	return {
		deleteCard,
		editCard,
		changeStatus,
		completeSubtask,
		isEditing,
		setEditing,
		statusColors,
		isOverdue,
	};
}
