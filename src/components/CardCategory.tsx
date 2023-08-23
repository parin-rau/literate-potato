import { FetchedTicketData, Project } from "../types";
import TicketCard from "./TicketCard";

type Props =
	| {
			categoryTitle: string;
			cardsSubset: Project[];
			setCards: React.Dispatch<React.SetStateAction<Project[]>>;
	  }
	| {
			categoryTitle: string;
			cardsSubset: FetchedTicketData[];
			setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	  };

export default function CardCategory(props: Props) {
	const { categoryTitle, cardsSubset, setCards } = props;

	return (
		<div>
			<h2>{categoryTitle}</h2>
			{cardsSubset.map((card) => (
				<TicketCard
					key={card.ticketId || card.projectId}
					cardData={{ ...card }}
					setCards={setCards}
				/>
			))}
		</div>
	);
}
