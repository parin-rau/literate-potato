import { useCallback, useMemo } from "react";
import CardContainer from "../../components/Card/CardContainer";
import ProjectCard from "../../components/Card/ProjectCard";
import { FetchedTicketData, Project, uncategorizedProject } from "../../types";
import { useNavigate, useParams } from "react-router-dom";
import { useInitialFetch } from "../../hooks/useInitialFetch";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function ProjectPage() {
	const projectId = useParams().id || "";
	const navigate = useNavigate();

	if (projectId === "") {
		navigate("/");
		console.error("Project undefined");
	}

	const arrayTransform = useCallback((p: Project) => [p], []);
	const uncategorizedProjectTransform = useMemo(
		() => arrayTransform(uncategorizedProject),
		[arrayTransform]
	);

	const {
		data: project,
		setData: setProject,
		isLoading,
	} = useInitialFetch<Project[], Project>(
		`/api/project/${projectId}`,
		undefined,
		arrayTransform,
		uncategorizedProjectTransform
	);

	const pageTitle = isLoading ? document.title : project[0].title;

	usePageTitle(pageTitle);

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
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
