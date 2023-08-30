import { useCallback, useEffect, useState } from "react";
import CardContainer from "../components/Wrapper/CardContainer";
import ProjectCard from "../components/Card/ProjectCard";
import { Project } from "../types";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectTaskPage() {
	const [project, setProject] = useState<Project[]>([]);
	const [initialized, setInitialized] = useState(false);
	const projectId = useParams().id || "";
	const navigate = useNavigate();

	if (projectId === "") {
		navigate("/");
		console.error("Project does not exist");
	}

	const projectCard = project[0];

	useEffect(() => {
		async function getProjectTitle() {
			try {
				if (projectId) {
					const res = await fetch(`/api/project/${projectId}`, {
						headers: { "Content-Type": "application/json" },
					});
					const projectData: Project = await res.json();
					setProject([projectData]);
					setInitialized(true);
				}
			} catch (e) {
				console.error(e);
				navigate("/");
			}
		}
		getProjectTitle();
	}, [projectId, navigate]);

	const handleProjectDelete = useCallback(() => {
		if (initialized && project.length === 0) {
			navigate("/");
		}
	}, [initialized, project.length, navigate]);

	useEffect(() => handleProjectDelete(), [handleProjectDelete]);

	return (
		<div className="flex flex-col justify-center items-stretch">
			<div className="flex flex-col space-y-4 pt-20 items-center">
				<div className="container flex flex-col space-y-6">
					{/* <h1 className="font-bold text-4xl mx-2">
						{project.length ? projectCard.title : "Project"}
					</h1> */}
					{project.length > 0 && (
						<>
							<ProjectCard
								isHeader
								cardData={projectCard}
								setCards={setProject}
							/>
							<CardContainer
								dataKind="ticket"
								containerTitle="Tasks"
								projectTitle={projectCard.title}
								projectId={projectId}
								styles="dark:bg-transparent"
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
