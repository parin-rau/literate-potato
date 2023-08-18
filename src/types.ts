export interface Project {
	title: string;
	description: string;
	owner: string;
	//timestamp: number;
	//projectId: string;
	[key: string]: string | number;
}

export type EditorData = {
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
};

export type TicketData = {
	ticketId: string;
	title: string;
	description: string;
	priority: "" | "Low" | "Medium" | "High";
	due: string;
	tags: string[];
	subtasks?: {
		subtaskId: string;
		description: string;
		completed: boolean;
	}[];
	comments?: {
		_id: string;
		timestamp: number;
		content: string;
	}[];
	timestamp: number;
	taskStatus: string;
	projectId: string;
	lastModified?: number;
};

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

export type FetchedTicketData = TicketData & {
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
};
