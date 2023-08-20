import { useState } from "react";
import ProjectEditor from "../components/ProjectEditor";
import { FetchedTicketData, Project } from "../types";
import CardContainer from "../components/CardContainer";
import Nav from "../components/Nav";

export default function HomePage() {
	const [projects, setProjects] = useState<Project[]>([]);
	const [tasks, setTasks] = useState<FetchedTicketData[]>([]);

	// useEffect(() => {
	// 	async function getCompletion() {
	// 		try {
	// 			const res = await fetch("", {
	// 				headers: { "Content-Type": "appliction/json" },
	// 			});
	// 		} catch (e) {
	// 			console.error(e);
	// 		}
	// 	}
	// 	getCompletion();
	// }, []);

	// useEffect(() => {
	// 	async function get() {

	// 	}
	// }, [])

	return (
		<div className="flex flex-col space-y-4">
			<Nav />
			<div className="sm:container sm:mx-auto flex flex-col space-y-6">
				<h1 className="text-bold text-4xl">Projects Home</h1>
				<ProjectEditor setCards={setProjects} />

				<div className="grid grid-cols-2 grid-rows-1 sm:container sm:mx-auto place-items-start gap-4">
					{projects.length > 0 && (
						<CardContainer
							setCards={setProjects}
							cards={projects}
							containerTitle="Projects"
							dataKind="project"
						/>
					)}
					{tasks.length > 0 && (
						<CardContainer
							cards={tasks}
							setCards={setTasks}
							containerTitle="Upcoming Tasks"
							dataKind="ticket"
						/>
					)}
				</div>
			</div>
		</div>
	);
}
