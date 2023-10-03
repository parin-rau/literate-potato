import { useState } from "react";
import CalendarContainer from "../../components/Calendar/CalendarContainer";
import CardContainer from "../../components/Card/CardContainer";
import { LoadingSkeletonCalendar } from "../../components/Nav/Loading";

export default function ProjectHomePage() {
	const [cardsLoading, setCardsLoading] = useState(true);

	const cardContainerStyles = "dark:bg-neutral-900";

	return (
		<div className="flex flex-col space-y-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col space-y-6">
				<h1 className="font-bold text-4xl">Projects Home</h1>
				<div className="flex flex-col container gap-4">
					<CardContainer
						containerTitle="Projects"
						dataKind="project"
						styles={cardContainerStyles}
						setCardsLoading={setCardsLoading}
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
