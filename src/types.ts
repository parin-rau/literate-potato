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

export interface TicketData {
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
	ticketNumber?: number;
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
