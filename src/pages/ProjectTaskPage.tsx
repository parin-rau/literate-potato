import { useState } from "react";
import CardContainer from "../components/CardContainer";
import TicketEditor from "../components/TicketEditor";
import Nav from "../components/Nav";
import { FetchedTicketData } from "../types";

export default function ProjectTaskPage() {
	const [cards, setCards] = useState<FetchedTicketData[]>([]);

	return (
		<div className="flex flex-col space-y-4">
			<Nav />
			<h1 className="text-bold text-4xl px-6 py-2">[Project Name]</h1>
			<TicketEditor setCards={setCards} />
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
