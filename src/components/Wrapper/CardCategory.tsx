import { FetchedTicketData, Project } from "../../types";
import TicketCard from "../Card/TicketCard";
import CardSelector from "./CardContainer";

type Props = {
	dataKind: string;
	categoryTitle: string;
	filters: string[];
	setFilters: React.Dispatch<React.SetStateAction<string[]>>;
} & (
	| {
			cardsSubset: Project[];
			setCards: React.Dispatch<React.SetStateAction<Project[]>>;
			setCardCache: React.Dispatch<React.SetStateAction<Project[]>>;
	  }
	| {
			cardsSubset: FetchedTicketData[];
			setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
			setCardCache: React.Dispatch<
				React.SetStateAction<FetchedTicketData[]>
			>;
	  }
);

export default function CardCategory(props: Props) {
	const {
		dataKind,
		categoryTitle,
		cardsSubset,
		setCards,
		filters,
		setFilters,
		setCardCache,
	} = props;

	return (
		<div>
			<h2>{categoryTitle}</h2>
			{cardsSubset.map((card) => (
				<>
					<CardSelector
						{...{
							dataKind,
							setCards,
							filters,
							setFilters,
							setCardCache,
						}}
					/>
					<TicketCard
						key={card.ticketId || card.projectId}
						cardData={{ ...card }}
						setCards={setCards}
					/>
				</>
			))}
		</div>
	);
}
