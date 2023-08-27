import { FetchedTicketData, Project } from "../../types";
import ProjectCard from "./ProjectCard";
import TicketCard from "./TicketCard";

type Props = {
	dataKind: string;
	cards: FetchedTicketData[] | Project[];
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	setCardCache: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	filters: string[];
	setFilters: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function CardSelector(props: Props) {
	const { dataKind, cards, setCards, setCardCache, filters, setFilters } =
		props;

	if (dataKind === "ticket") {
		return (cards as FetchedTicketData[]).map((card) => (
			<TicketCard
				key={card.ticketId}
				cardData={{ ...card }}
				setCards={
					setCards as React.Dispatch<
						React.SetStateAction<FetchedTicketData[]>
					>
				}
				filters={filters}
				setFilters={setFilters}
				setCardCache={
					setCardCache as React.Dispatch<
						React.SetStateAction<FetchedTicketData[]>
					>
				}
			/>
		));
	}
	if (dataKind === "project") {
		return (cards as Project[]).map((card) => (
			<ProjectCard key={card.projectId} cardData={{ ...card }} />
		));
	}
}
