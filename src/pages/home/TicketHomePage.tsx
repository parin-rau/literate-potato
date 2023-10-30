import CardContainer from "../../components/Card/CardContainer";

export default function TicketHomePage() {
	return (
		//<div className="grid h-screen place-items-center">Ticket Home Page</div>
		<div className="pt-20 flex flex-col gap-6">
			<h1 className="px-4 font-bold text-4xl">Tasks Home</h1>
			<CardContainer
				{...{ containerTitle: "Tasks", dataKind: "ticket" }}
			/>
		</div>
	);
}
