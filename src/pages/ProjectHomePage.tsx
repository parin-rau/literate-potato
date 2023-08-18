import { useState } from "react";
import ProjectEditor from "../components/ProjectEditor";
// import ProjectCard from "../components/ProjectCard";
import { Project } from "../types";
import CardContainer from "../components/CardContainer";

export default function ProjectHomePage() {
	const [projects, setProjects] = useState<Project[]>([]);

	return (
		<div className="flex flex-col">
			<ProjectEditor setCards={setProjects} />
			<h1 className="text-3xl">Projects Home</h1>
			{projects && (
				<>
					<CardContainer
						setCards={setProjects}
						cards={projects}
						containerTitle="Projects"
						dataKind="project"
					/>
					{/* {projects.map((project) => (
						<ProjectCard project={{ ...project }} />
					))} */}
				</>
			)}
		</div>
	);
}
