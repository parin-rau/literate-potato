import { useEffect, useState } from "react";
import CardContainer from "../components/CardContainer";
import TicketEditor from "../components/TicketEditor";
import Nav from "../components/Nav";
import { FetchedTicketData, Project } from "../types";
import { useParams } from "react-router-dom";

export default function ProjectTaskPage() {
	const [cards, setCards] = useState<FetchedTicketData[]>([]);
	const [project, setProject] = useState<Project>();
	const projectId = useParams().id || "";

	useEffect(() => {
		async function getProjectTitle() {
			try {
				if (projectId.length > 0) {
					const res = await fetch(`/api/project/${projectId}`, {
						headers: { "Content-Type": "application/json" },
					});
					const projectData = await res.json();
					setProject(projectData);
				}
			} catch (e) {
				console.error(e);
			}
		}
		getProjectTitle();
	}, [projectId]);

	return (
		<>
			<Nav />
			<div className="flex flex-col space-y-4 pt-16">
				<div className="sm:container sm:mx-auto flex flex-col space-y-6">
					<h1 className="text-bold text-4xl">
						{project?.title || "Project"}
					</h1>
					<TicketEditor setCards={setCards} projectId={projectId} />
					<CardContainer
						dataKind="ticket"
						cards={cards}
						setCards={setCards}
						containerTitle="Tasks"
						projectId={projectId}
					/>
				</div>
			</div>
		</>
	);
}
