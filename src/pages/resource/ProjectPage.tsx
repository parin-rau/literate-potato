import { useCallback, useMemo, useEffect, useState } from "react";
import CardContainer from "../../components/Card/CardContainer";
import ProjectCard from "../../components/Card/ProjectCard";
import { Project, uncategorizedProject } from "../../types";
import { useNavigate, useParams } from "react-router-dom";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { usePageTitle } from "../../hooks/utility/usePageTitle";
import UnjoinedNotice from "../../components/Card/UnjoinedNotice";
import CalendarContainer from "../../components/Calendar/CalendarContainer";

export default function ProjectPage() {
	const projectId = useParams().id || "";
	const navigate = useNavigate();
	const [ticketsLoading, setTicketsLoading] = useState(true);

	useEffect(() => {
		const checkUndefinedId = () => {
			if (projectId === "") {
				navigate("/");
				console.error("Project undefined");
			}
		};
		checkUndefinedId();
	}, [navigate, projectId]);

	const arrayTransform = useCallback((p: Project) => [p], []);
	const uncategorizedProjectTransform = useMemo(
		() => arrayTransform(uncategorizedProject),
		[arrayTransform]
	);

	const {
		data: project,
		setData: setProject,
		isLoading,
		message,
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
			<div className="flex flex-col gap-4 pt-16 items-center">
				<div className="container flex flex-col gap-6">
					{!isLoading &&
						project.length > 0 &&
						(!message ? (
							<>
								{projectId === "uncategorized" ? (
									<h1 className="font-bold text-4xl mx-2">
										Uncategorized Tasks
									</h1>
								) : (
									<div className="-m-2 p-2 sticky top-14 z-20 bg-white dark:bg-stone-950">
										<ProjectCard
											isHeader
											cardData={project[0]}
											setCards={setProject}
										/>
									</div>
								)}
								<CardContainer
									dataKind="ticket"
									containerTitle="Tasks"
									projectTitle={project[0].title}
									projectId={projectId}
									setProject={setProject}
									group={project[0].group}
									setCardsLoading={setTicketsLoading}
								/>

								{!ticketsLoading && (
									<CalendarContainer
										headerText={`Project: ${project[0].title}`}
										filterKind="project"
										filterId={projectId}
									/>
								)}
							</>
						) : (
							<UnjoinedNotice
								message={message}
								hideButton={message ? true : false}
							/>
						))}
				</div>
			</div>
		</div>
	);
}
