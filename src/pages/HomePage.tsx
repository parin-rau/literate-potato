import { useState } from "react";
import CalendarContainer from "../components/Calendar/CalendarContainer";
import CardContainer from "../components/Card/CardContainer";

export default function HomePage() {
	const [cardsLoading, setCardsLoading] = useState(true);

	const cardContainerStyles = "dark:bg-neutral-900";

	return (
		<div className="flex flex-col space-y-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col space-y-6">
				<h1 className="text-bold text-4xl">Projects Home</h1>
				<div className="flex flex-col container gap-4">
					<CardContainer
						containerTitle="Projects"
						dataKind="project"
						styles={cardContainerStyles}
						setCardsLoading={setCardsLoading}
					/>
					{/* <CardContainer
						containerTitle="All Tasks"
						dataKind="ticket"
						styles={cardContainerStyles}
					/> */}
					{!cardsLoading && <CalendarContainer />}
				</div>
			</div>
		</div>
	);
}
