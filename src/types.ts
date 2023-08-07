export type EditorData = {
	title: string;
	description: string;
	priority: "" | "Low" | "Medium" | "High";
	due: string;
	tags: string[];
};

// export type UndefinedEditorData = {
// 	title?: string;
// 	description?: string;
// 	priority?: "" | "Low" | "Medium" | "High";
// 	due?: string;
// 	tags?: string[];
// };

export type TicketData = {
	ticketId: string;
	title: string;
	description: string;
	priority: "" | "Low" | "Medium" | "High";
	due: string;
	tags: string[];
	comments?: {
		_id: string;
		timestamp: number;
		content: string;
	}[];
	timestamp: number;
	taskStatus: number;
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
