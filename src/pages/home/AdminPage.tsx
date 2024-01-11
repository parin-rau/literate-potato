import { useState } from "react";
import { usePageTitle } from "../../hooks/utility/usePageTitle";
import CardContainer from "../../components/Card/CardContainer";
import { LoadingSkeletonCardGrid } from "../../components/Nav/Loading";
import Statistics from "../../components/Admin/Statistics";

export default function AdminPage() {
	usePageTitle("Admin Dashboard");
	const [ticketsLoading, setTicketsLoading] = useState(true);
	const [projectsLoading, setProjectsLoading] = useState(true);
	const [statsLoading, setStatsLoading] = useState(true);

	/* 
	
	Wrap CardContainers in element to not immediately load data

		<Blocker>
			{children}
		</Blocker>
	
	*/

	return (
		<div className="flex flex-col gap-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col gap-6">
				<h1 className="font-bold text-4xl">Home</h1>
				<Statistics {...{ setStatsLoading }} />
				{!statsLoading ? (
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
				{!ticketsLoading ? (
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
			</div>
		</div>
	);
}
