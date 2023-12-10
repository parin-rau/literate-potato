import { useState } from "react";
import {
	LoadingSkeletonCalendar,
	LoadingSkeletonCardGrid,
} from "../../components/Nav/Loading";
import { usePageTitle } from "../../hooks/utility/usePageTitle";
import ProjectHomePage from "./ProjectHomePage";
import TicketHomePage from "./TicketHomePage";
import CalendarContainer from "../../components/Calendar/CalendarContainer";
import CardContainer from "../../components/Card/CardContainer";

type Props = { title: string };

function LoadingPlaceholder() {
	return (
		<div className="flex flex-col gap-4">
			<LoadingSkeletonCardGrid />
			<LoadingSkeletonCalendar />
		</div>
	);
}

export default function HomePage(props: Props) {
	usePageTitle(props.title);
	const [ticketsLoading, setTicketsLoading] = useState(true);
	const [projectsLoading, setProjectsLoading] = useState(true);
	//const isLoading = ticketsLoading || projectsLoading;

	return (
		<div className="flex flex-col gap-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col gap-6">
				{/* {ticketsLoading ? (
					<LoadingPlaceholder />
				) :  */}
				<div className="flex flex-col gap-4">
					<h1>Home</h1>
					{/* <TicketHomePage /> */}
					<CardContainer
						{...{
							dataKind: "ticket",
							containerTitle: "Almost completed tasks",
							setCardsLoading: setTicketsLoading,
							isSummary: true,
							hideEditor: true,
						}}
					/>
					{ticketsLoading ? (
						<LoadingSkeletonCardGrid />
					) : (
						<ProjectHomePage {...{ title: "Projects" }} />
					)}
					{!ticketsLoading && !projectsLoading ? (
						<CalendarContainer headerText="All tasks" />
					) : (
						<LoadingSkeletonCalendar />
					)}
				</div>
			</div>
		</div>
	);

	// <div className="grid h-screen place-items-center">
	// 	<p>Home Page</p>
	// 	<LoadingSkeletonCardGrid />
	// 	<LoadingSkeletonCalendar />
	// </div>
}
