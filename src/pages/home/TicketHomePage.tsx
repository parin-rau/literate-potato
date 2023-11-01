import CalendarContainer from "../../components/Calendar/CalendarContainer";
import CardContainer from "../../components/Card/CardContainer";

export default function TicketHomePage() {
	return (
		<div className="pt-20 flex flex-col gap-4 px-2">
			<div className="sm:container sm:mx-auto flex flex-col gap-6">
				<h1 className="px-4 font-bold text-4xl">Tasks Home</h1>
				<CardContainer
					{...{ containerTitle: "Tasks", dataKind: "ticket" }}
				/>
				<CalendarContainer headerText="All Tasks" />
			</div>
		</div>
	);
}
