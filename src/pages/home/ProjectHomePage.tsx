import { useState } from "react";
import CalendarContainer from "../../components/Calendar/CalendarContainer";
import CardContainer from "../../components/Card/CardContainer";
import { LoadingSkeletonCalendar } from "../../components/Nav/Loading";
import { usePageTitle } from "../../hooks/utility/usePageTitle";

export default function ProjectHomePage(props: {
	title: string;
	groupId?: string;
}) {
	usePageTitle(props.title);

	const [cardsLoading, setCardsLoading] = useState(true);

	const cardContainerStyles = "dark:bg-neutral-900";

	return (
		<div className="flex flex-col gap-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col gap-6">
				<h1 className="font-bold text-4xl">Projects Home</h1>
				<div className="flex flex-col container gap-4">
					<CardContainer
						containerTitle="Projects"
						dataKind="project"
						styles={cardContainerStyles}
						setCardsLoading={setCardsLoading}
						groupId={props.groupId}
					/>

					{cardsLoading ? (
						<LoadingSkeletonCalendar />
					) : (
						<CalendarContainer headerText="All Projects" />
					)}
				</div>
			</div>
		</div>
	);
}
