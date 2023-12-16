export interface Project {
	title: string;
	description: string;
	creator: { userId: string; username: string };
	timestamp: number;
	projectId: string;
	projectNumber?: number;
	group: { groupId: string; groupTitle: string };
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
	creator: { userId: string; username: string };
	group: { groupId: string; groupTitle: string };
	[key: string]: string | number | { [key: string]: string };
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
	creator: { userId: string; username: string };
	project: {
		projectTitle: string;
		projectId: string;
	};
	group: { groupTitle: string; groupId: string };
	externalResourceURL: string;
	externalResourceText: string;
	assignee: { userId: string; username: string };
};

export interface Comment {
	userId: string;
	username: string;
	ticketId: string;
	commentId: string;
	timestamp: number;
	lastModified?: number;
	content: string;
	likes: string[];
	dislikes: string[];
}

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
	comments?: string[];
	timestamp: number;
	taskStatus: string;
	project: { projectTitle: string; projectId: string };
	group: { groupId: string; groupTitle: string };
	externalResourceURL?: string;
	externalResourceText?: string;
	lastModified?: number;
	ticketNumber?: number;
	creator: { userId: string; username: string };
	assignee: { userId: string; username: string };
}

export interface FetchedTicketData extends TicketData {
	_id?: string;
}

export const initTicketEditor: EditorData = {
	title: "",
	description: "",
	priority: "",
	due: "",
	tags: [],
	subtasks: [],
	creator: { userId: "", username: "" },
	project: { projectTitle: "", projectId: "" },
	group: { groupTitle: "", groupId: "" },
	assignee: { username: "", userId: "" },
	externalResourceURL: "",
	externalResourceText: "",
};

export const initProjectEditor: ProjectEditor = {
	title: "",
	description: "",
	creator: { userId: "", username: "" },
	color: "",
	group: { groupId: "", groupTitle: "" },
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
	group: { groupId: "", groupTitle: "" },
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

export type RegisterData = Omit<Register, "passwordConfirm">;

export interface User {
	userId: string;
	username: string;
	email: string;
	password?: string;
	roles: number[];
	timestamp: number;
	lastModified?: number;
	groupIds: string[];
	managedGroupIds: string[];
	requestGroupIds: string[];
	projectIds: string[];
	ticketIds: { completed: string[] };
	subtaskIds: { completed: string[] };
}

export interface UserToken {
	userId: string;
	username: string;
	roles: number[];
}

export interface UserDecode {
	username: string;
	userId: string;
	roles: number[];

	iat: number;
	exp: number;
}

export type SearchResultProps = {
	data: {
		title: string;
		id: string;
		description?: string;
		timestamp?: number;
	};
	meta: { kind: "ticket" | "project" | "user" | "group" | "subtask" };
};

export interface Calendar {
	currentTime: Date;
	currentView: {
		year: number;
		month: string;
		monthIndex: number;
	};
	dates: { prev: Date[]; current: Date[]; next: Date[] };
	displayDates: { date: Date; styles: string; dueCount: number }[];
}

export const emptyCalendar: Calendar = {
	currentTime: new Date(),
	currentView: {
		year: 0,
		month: "",
		monthIndex: 0,
	},
	dates: { prev: [new Date()], current: [new Date()], next: [new Date()] },
	displayDates: [{ date: new Date(), styles: "", dueCount: 0 }],
};

export interface Group {
	title: string;
	groupId: string;
	isPrivate?: boolean;
	description: string;
	manager: { name: string; userId: string };
	userIds: string[];
	requestUserIds: string[];
	projectIds: string[];
	ticketIds: string[];
	timestamp: number;
}

export interface Notice {
	messageCode: number;
	notificationId: string;
	userId: string;
	resource: { id: string; kind: string; title: string };
	secondaryResource?: { id: string; kind: string; title: string };
	isSeen: boolean;
	timestamp: number;
}

export type NoticeEntry = Omit<
	Notice,
	"notificationId" | "isSeen" | "timestamp"
>;
