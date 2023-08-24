import { useState } from "react";
import ProjectEditor from "../components/Editor/ProjectEditor";
import { FetchedTicketData, Project } from "../types";
import CardContainer from "../components/Wrapper/CardContainer";
import Nav from "../components/Nav/NavBar";

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
		<>
			<Nav />
			<div className="flex flex-col space-y-4 pt-16 px-2">
				<div className="sm:container sm:mx-auto flex flex-col space-y-6">
					<h1 className="text-bold text-4xl">Projects Home</h1>
					<ProjectEditor setCards={setProjects} />
					<div className="flex flex-col sm:grid grid-cols-1 lg:grid-cols-2 container sm:place-items-start gap-4">
						<CardContainer
							setCards={setProjects}
							cards={projects}
							containerTitle="Projects"
							dataKind="project"
						/>
						<CardContainer
							cards={tasks}
							setCards={setTasks}
							containerTitle="Upcoming Tasks"
							dataKind="ticket"
						/>
					</div>
				</div>
			</div>
		</>
	);
}
