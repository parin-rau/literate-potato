export interface Project {
	title: string;
	description: string;
	creator: string;
	timestamp: number;
	projectId: string;
	projectNumber?: number;
	lastModified?: number;
	tasksCompletedIds: string[];
	tasksTotalIds: string[];
	subtasksCompletedIds: string[];
	subtasksTotalIds: string[];
	color?: string;
	//[key: string]: string | number;
}

export type ProjectEditor = {
	title: string;
	description: string;
	creator: string;
	[key: string]: string | number;
};

export type EditorData = {
	title: string;
	description: string;
	priority: "" | "Low" | "Medium" | "High";
	due: string;
	tags: string[];
	timestamp?: number;
	subtasks: {
		subtaskId: string;
		description: string;
		completed: boolean;
	}[];
	creator: string;
	project: {
		projectTitle: string;
		projectId: string;
	};
};

export interface TicketData {
	ticketId: string;
	title: string;
	description: string;
	priority: "" | "Low" | "Medium" | "High";
	due: string;
	tags: string[];
	subtasks: {
		subtaskId: string;
		description: string;
		completed: boolean;
	}[];
	comments?: {
		commentId: string;
		timestamp: number;
		content: string;
	}[];
	timestamp: number;
	taskStatus: string;
	project: { projectTitle: string; projectId: string };
	lastModified?: number;
	ticketNumber?: number;
	creator?: string;
}

// export type TicketData = EditorData & {
// 	_id?: string;
// 	ticketId: string;
// 	comments?: {
// 		_id: string;
// 		timestamp: number;
// 		content: string;
// 	};
// 	timestamp: number;
// };

export interface FetchedTicketData extends TicketData {
	_id?: string;
	// ticketId: string;
	// title: string;
	// description?: string;
	// priority?: "Low" | "Medium" | "High";
	// due?: string;
	// tags?: string[];
	// comments?: {
	// 	_id: string;
	// 	timestamp: number;
	// 	content: string;
	// }[];
	// timestamp: number;
}

export const initTicketEditor: EditorData = {
	title: "",
	description: "",
	priority: "",
	due: "",
	tags: [],
	subtasks: [],
	creator: "",
	project: { projectTitle: "", projectId: "" },
};

export const initProjectEditor: ProjectEditor = {
	title: "",
	description: "",
	creator: "",
	color: "",
};

export const uncategorizedProject: Project = {
	...initProjectEditor,
	title: "Uncategorized",
	timestamp: 0,
	projectId: "",
	tasksCompletedIds: [],
	tasksTotalIds: [],
	subtasksCompletedIds: [],
	subtasksTotalIds: [],
};

export type SortMenu = {
	name: string;
	arrowDirection: "up" | "down";
	fn: () => void;
}[];

export function isFilterable(
	arr: FetchedTicketData[] | Project[]
): arr is FetchedTicketData[] {
	return typeof (arr[0] as FetchedTicketData).tags[0] === "string";
}

export interface Login {
	username: string;
	password: string;
}

export interface Register extends Login {
	email: string;
	passwordConfirm: string;
}

export interface User {
	userId: string;
	username: string;
	email: string;
	password: string;
	roles: number[];
	timestamp: number;
	lastModified?: number;
}

export interface UserToken {
	userId: string;
	username: string;
	roles: number[];
}
