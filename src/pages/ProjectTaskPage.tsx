import { useCallback, useEffect, useState } from "react";
import CardContainer from "../components/Card/CardContainer";
import ProjectCard from "../components/Card/ProjectCard";
import { FetchedTicketData, Project, uncategorizedProject } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { useProtectedFetch } from "../hooks/useProtectedFetch";

export default function ProjectTaskPage() {
	//const [project, setProject] = useState<Project[]>([]);
	//const [initialized, setInitialized] = useState(false);
	//const [projectCard, setProjectCard] = useState<Project | null>(null);

	const projectId = useParams().id || "";
	const navigate = useNavigate();

	if (projectId === "") {
		navigate("/");
		console.error("Project undefined");
	}

	const arrayTransform = useCallback((p: Project) => [p], []);

	const {
		data: project,
		setData: setProject,
		isLoading,
	} = useProtectedFetch<Project[], Project>(
		`/api/project/${projectId}`,
		undefined,
		arrayTransform
	);

	// useEffect(() => {
	// 	setInitialized(false);
	// 	if (!isLoading) {
	// 		//console.log(project);
	// 		//setProjectCard(project[0]);
	// 		setInitialized(true);
	// 	}
	// }, [isLoading]);

	//console.log(project, isLoading);

	// useEffect(() => {
	// 	async function fetchProject() {
	// 		try {
	// 			if (projectId === "uncategorized") {
	// 				setProject([uncategorizedProject]);
	// 				setInitialized(true);
	// 			} else if (projectId) {

	// 				const res = await fetch(`/api/project/${projectId}`, {
	// 					headers: { "Content-Type": "application/json" },
	// 					credentials: "include",
	// 				});
	// 				if (res.ok) {
	// 					const projectData: Project = await res.json();
	// 					setProject([projectData]);
	// 					setInitialized(true);
	// 				}
	// 			}
	// 		} catch (e) {
	// 			console.error(e);
	// 			navigate("/");
	// 		}
	// 	}
	// 	fetchProject();
	// }, [projectId, navigate]);

	// const handleProjectDelete = useCallback(() => {
	// 	if (
	// 		!isLoading &&
	// 		project.length === 0 &&
	// 		projectId !== "uncategorized"
	// 	) {
	// 		navigate("/");
	// 	}
	// }, [isLoading, project.length, navigate, projectId]);

	// useEffect(() => handleProjectDelete(), [handleProjectDelete]);

	return (
		<div className="flex flex-col justify-center items-stretch">
			<div className="flex flex-col space-y-4 pt-20 items-center">
				<div className="container flex flex-col space-y-6">
					{!isLoading && project.length > 0 && (
						<>
							{projectId === "uncategorized" ? (
								<h1 className="font-bold text-4xl mx-2">
									Uncategorized Tasks
								</h1>
							) : (
								<ProjectCard
									isHeader
									cardData={project[0]}
									setCards={setProject}
								/>
							)}
							<CardContainer<FetchedTicketData>
								dataKind="ticket"
								containerTitle="Tasks"
								projectTitle={project[0].title}
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
