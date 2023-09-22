import { useState, useCallback } from "react";
import {
	FetchedTicketData,
	Project,
	initProjectEditor,
	initTicketEditor,
} from "../types";

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

type Props = CommonProps &
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
	const [submitMeta, setMeta] = useState<SubmitMetadata | null>(null);

	const handleInit = useCallback(
		(dataKind: "ticket" | "project") => {
			const { previousData } = props;

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
			} else {
				console.error("Init undefined");
			}
		},
		[props]
	);

	const submitHelper = useCallback(async (input: SubmitMetadata) => {
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

	return { handleInit, setMeta, submitHelper };
}
