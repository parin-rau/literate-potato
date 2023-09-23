import { useState, useCallback } from "react";
import {
	EditorData,
	FetchedTicketData,
	Project,
	initProjectEditor,
	initTicketEditor,
} from "../types";
import { useProtectedFetch } from "./useProtectedFetch";

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
};

type CreatingTicketProps = CommonTicketProps & {
	project?: { projectId: string; projectTitle: string };
	previousData?: never;
	setEditing?: never;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
};

type EditingProjectProps = CommonProjectProps & {
	project?: never;
	previousData: Project;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
	setProject?: never;
};

type EditingTicketProps = CommonTicketProps & {
	project?: never;
	previousData: FetchedTicketData;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
};

export type Props = CommonProps &
	(
		| (CreatingTicketProps | EditingTicketProps)
		| (CreatingProjectProps | EditingProjectProps)
	);

type SubmitMetadata = {
	dataKind: "ticket" | "project";
	isEdit?: boolean;
	isProjectMove?: boolean;
	isTasksEdit?: boolean;
};

export function useCardEditor(props: Props) {
	const {
		dataKind,
		setCards,
		previousData,
		setEditing,
		setCardCache,
		resetFilters,
		setProject,
	} = props;

	const [isPinned, setPinned] = useState(false);
	const [submitMeta, setMeta] = useState<SubmitMetadata | null>(null);
	const { protectedFetch } = useProtectedFetch();

	// LOCAL HELPERS

	const handleInit = useCallback(
		// REFACTOR TO BE LOCAL ONLY
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

	//EXPORTS

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

	const handleSubmit = useCallback(async (input: SubmitMetadata) => {
		switch (input) {
			case { dataKind: "project", isEdit: true }:
				// Edit project
				break;
			case { dataKind: "project", isEdit: false }:
				// create project
				break;
			case { dataKind: "ticket", isEdit: true }:
				// edit ticket
				break;
			case { dataKind: "ticket", isProjectMove: true }:
				// move ticket to different project
				break;
			case { dataKind: "ticket", isTasksEdit: true }:
				// edit/add/delete tasks from ticket and project
				break;
			case { dataKind: "ticket", isEdit: false }:
				// create ticket
				break;
			default:
				break;
		}
	}, []);

	return {
		handlers: {
			setMeta,
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
		},
	};
}
