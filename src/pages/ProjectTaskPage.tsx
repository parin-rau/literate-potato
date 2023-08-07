import { useState } from "react";
import CardContainer from "../components/CardContainer";
import Editor from "../components/Editor";
import Nav from "../components/Nav";
import { FetchedTicketData, EditorData } from "../types";

// export type EditorData = {
// 	title: string;
// 	description: string;
// 	priority: "" | "Low" | "Medium" | "High";
// 	due: string;
// 	tags: string[];
// };

type InitData = {
	title: "";
	description: "";
	priority: "";
	due: "";
	tags: [];
};

const initEditor: InitData = {
	title: "",
	description: "",
	priority: "",
	due: "",
	tags: [],
};

export default function ProjectTaskPage() {
	const [editor, setEditor] = useState<EditorData>(initEditor);
	const [cards, setCards] = useState<FetchedTicketData[]>([]);

	return (
		<div className="flex flex-col space-y-4">
			<Nav />
			<h1 className="text-bold text-4xl px-6 py-2">[Project Name]</h1>
			<Editor
				editor={editor}
				setEditor={setEditor}
				initEditor={initEditor}
				setCards={setCards}
			/>
			<CardContainer
				cards={cards}
				setCards={setCards}
				containerTitle="Tasks"
			/>
			{/* <CardContainer
				cards={cards}
				setCards={setCards}
				containerTitle="In Progress"
			/>
			<CardContainer
				cards={cards}
				setCards={setCards}
				containerTitle="Completed"
			/> */}
		</div>
	);
}
