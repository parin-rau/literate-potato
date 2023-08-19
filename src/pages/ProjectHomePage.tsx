import { useState } from "react";
import ProjectEditor from "../components/ProjectEditor";
// import ProjectCard from "../components/ProjectCard";
import { Project } from "../types";
import CardContainer from "../components/CardContainer";
import Nav from "../components/Nav";

export default function ProjectHomePage() {
	const [projects, setProjects] = useState<Project[]>([]);

	return (
		<div className="flex flex-col">
			<Nav />
			<h1 className="text-3xl">Projects Home</h1>
			<ProjectEditor setCards={setProjects} />

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
