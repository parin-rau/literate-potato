import { useState } from "react";
import {
	LoadingSkeletonCalendar,
	LoadingSkeletonCardGrid,
} from "../../components/Nav/Loading";
import { usePageTitle } from "../../hooks/utility/usePageTitle";
// import ProjectHomePage from "./ProjectHomePage";
// import TicketHomePage from "./TicketHomePage";
import CalendarContainer from "../../components/Calendar/CalendarContainer";
import CardContainer from "../../components/Card/CardContainer";

type Props = { title: string };

// function LoadingPlaceholder() {
// 	return (
// 		<div className="flex flex-col gap-4">
// 			<LoadingSkeletonCardGrid />
// 			<LoadingSkeletonCalendar />
// 		</div>
// 	);
// }

export default function HomePage(props: Props) {
	usePageTitle(props.title);
	const [ticketsLoading, setTicketsLoading] = useState(true);
	const [projectsLoading, setProjectsLoading] = useState(true);

	return (
		<div className="flex flex-col gap-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col gap-6">
				<h1 className="font-bold text-4xl">Home</h1>
				<CardContainer
					{...{
						dataKind: "ticket",
						containerTitle: "In Progress Tasks",
						setCardsLoading: setTicketsLoading,
						isSummary: true,
						hideEditor: true,
					}}
				/>
				{!ticketsLoading && projectsLoading ? (
					<CardContainer
						{...{
							dataKind: "project",
							containerTitle: "In Progress Projects",
							setCardsLoading: setProjectsLoading,
							isSummary: true,
							hideEditor: true,
							hideUncategorized: true,
						}}
					/>
				) : (
					<LoadingSkeletonCardGrid />
				)}
				{!ticketsLoading && !projectsLoading ? (
					<CalendarContainer headerText="All tasks" />
				) : (
					<LoadingSkeletonCalendar />
				)}
			</div>
		</div>
	);

	// <div className="grid h-screen place-items-center">
	// 	<p>Home Page</p>
	// 	<LoadingSkeletonCardGrid />
	// 	<LoadingSkeletonCalendar />
	// </div>
}
