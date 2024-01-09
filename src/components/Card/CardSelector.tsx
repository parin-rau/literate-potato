import { FetchedTicketData, Project } from "../../types";
import ProjectCard from "./ProjectCard";
import TicketCard from "./TicketCard";
import UncategorizedProjectsCard from "./UncategorizedProjectsCard";

type TicketProps = {
	dataKind: "ticket";
	cards: FetchedTicketData[];
	setCards: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	setCardCache: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
	filters: string[];
	setFilters: React.Dispatch<React.SetStateAction<string[]>>;
	filterCards(_t: string[]): void;
	setProject?: never;
	setCardsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	hideUncategorized?: boolean;
};

type ProjectProps = {
	dataKind: "project";
	cards: Project[];
	setCards: React.Dispatch<React.SetStateAction<Project[]>>;
	setCardCache: React.Dispatch<React.SetStateAction<Project[]>>;
	filters: string[];
	setFilters: React.Dispatch<React.SetStateAction<string[]>>;
	filterCards?: never;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
	setCardsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	hideUncategorized?: boolean;
};

type Props = TicketProps | ProjectProps;
export default function CardSelector(props: Props) {
	const {
		dataKind,
		cards,
		setCards,
		setCardCache,
		filters,
		setFilters,
		setProject,
		setCardsLoading,
		hideUncategorized,
		filterCards,
	} = props;

	switch (dataKind) {
		case "ticket":
			return cards.map((card) => (
				<TicketCard
					key={card.ticketId}
					cardData={{ ...card }}
					setCards={setCards}
					filters={filters}
					setFilters={setFilters}
					filterCards={filterCards}
					setCardCache={setCardCache}
					setProject={setProject}
				/>
			));
		case "project":
			return (
				<>
					{(cards as Project[]).map((card) => (
						<ProjectCard
							key={card.projectId}
							cardData={{ ...card }}
							setCards={setCards}
							setCardCache={setCardCache}
						/>
					))}

					{!hideUncategorized && (
						<UncategorizedProjectsCard
							setCardsLoading={setCardsLoading}
						/>
					)}
				</>
			);
		default:
			return;
	}
}
