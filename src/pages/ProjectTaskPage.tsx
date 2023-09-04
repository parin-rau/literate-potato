import { useCallback, useEffect, useState } from "react";
import CardContainer from "../components/Wrapper/CardContainer";
import ProjectCard from "../components/Card/ProjectCard";
import { Project, uncategorizedProject } from "../types";
import { useNavigate, useParams } from "react-router-dom";

export default function ProjectTaskPage() {
	const [project, setProject] = useState<Project[]>([]);
	const [initialized, setInitialized] = useState(false);
	const projectId = useParams().id || "";
	const navigate = useNavigate();

	if (projectId === "") {
		navigate("/");
		console.error("Project undefined");
	}

	const projectCard = project[0];

	useEffect(() => {
		async function fetchProject() {
			try {
				if (projectId === "uncategorized") {
					setProject([uncategorizedProject]);
					setInitialized(true);
				} else if (projectId) {
					const res = await fetch(`/api/project/${projectId}`, {
						headers: { "Content-Type": "application/json" },
					});
					if (res.ok) {
						const projectData: Project = await res.json();
						setProject([projectData]);
						setInitialized(true);
					}
				}
			} catch (e) {
				console.error(e);
				navigate("/");
			}
		}
		fetchProject();
	}, [projectId, navigate]);

	const handleProjectDelete = useCallback(() => {
		if (
			initialized &&
			project.length === 0 &&
			projectId !== "uncategorized"
		) {
			navigate("/");
		}
	}, [initialized, project.length, navigate, projectId]);

	useEffect(() => handleProjectDelete(), [handleProjectDelete]);

	return (
		<div className="flex flex-col justify-center items-stretch">
			<div className="flex flex-col space-y-4 pt-20 items-center">
				<div className="container flex flex-col space-y-6">
					{project.length > 0 && (
						<>
							{projectId === "uncategorized" ? (
								<h1 className="font-bold text-4xl mx-2">
									Uncategorized Tasks
								</h1>
							) : (
								<ProjectCard
									isHeader
									cardData={projectCard}
									setCards={setProject}
								/>
							)}
							<CardContainer
								dataKind="ticket"
								containerTitle="Tasks"
								projectTitle={projectCard.title}
								projectId={projectId}
								setProject={setProject}
								styles="dark:bg-transparent"
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
