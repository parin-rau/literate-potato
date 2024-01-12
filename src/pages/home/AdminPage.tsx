import { useState } from "react";
import { usePageTitle } from "../../hooks/utility/usePageTitle";
import CardContainer from "../../components/Card/CardContainer";
import { LoadingSkeletonCardGrid } from "../../components/Nav/Loading";
import Statistics from "../../components/Admin/Statistics";
import Blocker from "../../components/Card/Blocker";

export default function AdminPage() {
	usePageTitle("Admin Dashboard");
	const [ticketsLoading, setTicketsLoading] = useState(false);
	const [projectsLoading, setProjectsLoading] = useState(false);

	return (
		<div className="flex flex-col gap-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col gap-6">
				<h1 className="font-bold text-4xl">Admin Dashboard</h1>
				<Statistics />
				<Blocker text="Load all tasks">
					{!ticketsLoading ? (
						<CardContainer
							{...{
								dataKind: "ticket",
								containerTitle: "All Tasks",
								setCardsLoading: setTicketsLoading,
								hideEditor: true,
								dataUrl: "/api/admin/ticket",
							}}
						/>
					) : (
						<LoadingSkeletonCardGrid />
					)}
				</Blocker>
				<Blocker text="Load all projects">
					{!projectsLoading ? (
						<CardContainer
							{...{
								dataKind: "project",
								containerTitle: "All Projects",
								setCardsLoading: setProjectsLoading,
								hideEditor: true,
								dataUrl: "/api/admin/project",
							}}
						/>
					) : (
						<LoadingSkeletonCardGrid />
					)}
				</Blocker>
			</div>
		</div>
	);
}
