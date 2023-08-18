import { useState } from "react";
import { Link } from "react-router-dom";
import ProjectEditor from "../components/ProjectEditor";
import { Project } from "../types";

export default function ProjectHomePage() {
	const [projects, setProjects] = useState<Project[]>([]);

	return (
		<div className="flex flex-col">
			<ProjectEditor setCards={setProjects} />
			<h1 className="text-3xl">Projects Home</h1>
			{projects &&
				projects.map((project) => (
					<div>
						<h1 className="text-2xl">{project.title}</h1>
						<h2 className="text-lg">{project.description}</h2>
						<h3 className="text-lg">{project.owner}</h3>
						<div>View Details Expandable</div>
						<Link to={"/"}>View Tasks</Link>
					</div>
				))}
		</div>
	);
}
