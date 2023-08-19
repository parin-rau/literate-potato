import { useState } from "react";
import ProjectEditor from "../components/ProjectEditor";
import { Project } from "../types";
import CardContainer from "../components/CardContainer";
import Nav from "../components/Nav";

export default function ProjectHomePage() {
	const [projects, setProjects] = useState<Project[]>([]);

	return (
		<div className="flex flex-col space-y-4">
			<Nav />
			<h1 className="text-bold text-4xl px-6 py-2">Projects Home</h1>
			<ProjectEditor setCards={setProjects} />

			{projects && (
				<CardContainer
					setCards={setProjects}
					cards={projects}
					containerTitle="Projects"
					dataKind="project"
				/>
			)}
		</div>
	);
}
