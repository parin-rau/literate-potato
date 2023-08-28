import { useEffect, useState } from "react";
import CardContainer from "../components/Wrapper/CardContainer";
import { Project } from "../types";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectTaskPage() {
	const [project, setProject] = useState<Project>();
	const projectId = useParams().id || "";
	const navigate = useNavigate();

	if (projectId === "") {
		navigate("/");
		console.log("Project does not exist");
	}

	useEffect(() => {
		async function getProjectTitle() {
			try {
				if (projectId) {
					const res = await fetch(`/api/project/${projectId}`, {
						headers: { "Content-Type": "application/json" },
					});
					const projectData = await res.json();
					setProject(projectData);
				}
			} catch (e) {
				console.error(e);
				navigate("/");
			}
		}
		getProjectTitle();
	}, [projectId, navigate]);

	return (
		<div className="flex flex-col justify-center items-stretch">
			<div className="flex flex-col space-y-4 pt-20 items-center">
				<div className="container flex flex-col space-y-6">
					<h1 className="font-bold text-4xl mx-2">
						{project?.title || "Project"}
					</h1>
					<CardContainer
						dataKind="ticket"
						containerTitle="Tasks"
						projectTitle={project?.title}
						projectId={projectId}
						styles="dark:bg-transparent"
					/>
				</div>
			</div>
		</div>
	);
}
