// import { useCallback } from "react";
// import { useProtectedFetch } from "../utility/useProtectedFetch";
// import {
// 	Project,
// 	ProjectEditor,
// 	initProjectEditor,
// 	initTicketEditor,
// } from "../../types";

// type Props = {
// 	editor: ProjectEditor;
// 	setEditor: React.Dispatch<React.SetStateAction<ProjectEditor>>;
// 	dataKind: string;
// 	setCards: React.Dispatch<React.SetStateAction<Project[]>>;
// 	setCardCache: React.Dispatch<React.SetStateAction<Project[]>>;
// 	isPinned: boolean;
// 	setExpand: React.Dispatch<React.SetStateAction<boolean>>;
// 	previousData: Project;
// 	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
// 	init;
// };

// export function useProjectEditor(props: Props) {
// 	const {
// 		editor,
// 		setEditor,
// 		dataKind,
// 		setCards,
// 		isPinned,
// 		setExpand,
// 		previousData,
// 		setCardCache,
// 		setEditing,
// 		init,
// 	} = props;
// 	const { protectedFetch } = useProtectedFetch();

// 	const createProject = useCallback(async () => {
// 		if (dataKind !== "project") return;

// 		const newCard: Project = {
// 			...(editor as ProjectEditor),
// 			timestamp: Date.now(),
// 			projectId: uuidv4(),
// 			tasksCompletedIds: [],
// 			tasksTotalIds: [],
// 			subtasksCompletedIds: [],
// 			subtasksTotalIds: [],
// 		};

// 		try {
// 			const res = await protectedFetch("/api/project", {
// 				method: "POST",
// 				body: JSON.stringify(newCard),
// 			});

// 			if (res.ok) {
// 				setCards((prevCards) => [newCard, ...prevCards]);
// 				setEditor(initProjectEditor);
// 				!isPinned && setExpand(false);
// 			}
// 		} catch (e) {
// 			console.error(e);
// 		}
// 	}, [
// 		dataKind,
// 		editor,
// 		isPinned,
// 		protectedFetch,
// 		setCards,
// 		setEditor,
// 		setExpand,
// 	]);

// 	const editProject = useCallback(async () => {
// 		if (dataKind !== "project" || !previousData) return;

// 		try {
// 			const patchData = {
// 				operation: "metadata",
// 				metadata: { ...editor },
// 			};
// 			const res1 = await protectedFetch(
// 				`/api/project/${previousData.projectId}`,
// 				{
// 					method: "PATCH",
// 					headers: { "Content-Type": "application/json" },
// 					body: JSON.stringify(patchData),
// 				}
// 			);
// 			if (res1.ok) {
// 				const ticketPatch = {
// 					project: {
// 						projectTitle: editor.title,
// 						projectId: previousData.projectId,
// 					},
// 				};
// 				const res2 = await protectedFetch(
// 					`/api/ticket/project-edit/${previousData.projectId}`,
// 					{
// 						method: "PATCH",
// 						headers: {
// 							"Content-Type": "application/json",
// 						},
// 						body: JSON.stringify(ticketPatch),
// 					}
// 				);
// 				if (res2.ok) {
// 					const updatedCard: Project = {
// 						...(patchData.metadata as ProjectEditor),
// 						...(init!.unusedPrevData! as Project),
// 						lastModified: Date.now(),
// 					};
// 					setCards((prevCards) =>
// 						prevCards.map((card) =>
// 							card.projectId === updatedCard.projectId
// 								? updatedCard
// 								: card
// 						)
// 					);
// 					setCardCache &&
// 						setCardCache((prev) =>
// 							prev.map((card) =>
// 								card.projectId === updatedCard.projectId
// 									? updatedCard
// 									: card
// 							)
// 						);
// 					setEditor(initTicketEditor);
// 					setEditing(false);
// 				}
// 			}
// 		} catch (e) {
// 			console.error(e);
// 		}
// 	}, [
// 		dataKind,
// 		editor,
// 		init,
// 		previousData,
// 		protectedFetch,
// 		setCardCache,
// 		setCards,
// 		setEditing,
// 		setEditor,
// 	]);

// 	return { createProject, editProject };
// }

// function uuidv4(): string {
// 	throw new Error("Function not implemented.");
// }
