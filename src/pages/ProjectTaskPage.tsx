import { useState } from "react";
import CardContainer from "../components/CardContainer";
import TicketEditor from "../components/TicketEditor";
import Nav from "../components/Nav";
import { FetchedTicketData } from "../types";
import { useParams } from "react-router-dom";

export default function ProjectTaskPage() {
	const [cards, setCards] = useState<FetchedTicketData[]>([]);
	const projectId = useParams().id;

	return (
		<div className="flex flex-col space-y-4">
			<Nav />
			<h1 className="text-bold text-4xl px-6 py-2">{projectId}</h1>
			<TicketEditor setCards={setCards} />
			<CardContainer
				dataKind="ticket"
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
