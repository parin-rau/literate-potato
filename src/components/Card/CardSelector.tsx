import { FetchedTicketData, Project } from "../../types";
import ProjectCard from "./ProjectCard";
import TicketCard from "./TicketCard";
import UncategorizedProjectsCard from "./UncategorizedProjectsCard";

type Props = {
	dataKind: string;
	cards: FetchedTicketData[] | Project[];
	setCards: React.Dispatch<
		React.SetStateAction<FetchedTicketData[] | Project[]>
	>;
	setCardCache: React.Dispatch<
		React.SetStateAction<FetchedTicketData[] | Project[]>
	>;
	filters: string[];
	setFilters: React.Dispatch<React.SetStateAction<string[]>>;
	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
};

export default function CardSelector(props: Props) {
	const {
		dataKind,
		cards,
		setCards,
		setCardCache,
		filters,
		setFilters,
		setProject,
	} = props;

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
				setProject={setProject}
			/>
		));
	} else if (dataKind === "project") {
		return (
			<>
				{(cards as Project[]).map((card) => (
					<ProjectCard
						key={card.projectId}
						cardData={{ ...card }}
						setCards={
							setCards as React.Dispatch<
								React.SetStateAction<Project[]>
							>
						}
						setCardCache={
							setCardCache as React.Dispatch<
								React.SetStateAction<Project[]>
							>
						}
					/>
				))}

				<UncategorizedProjectsCard />
			</>
		);
	}
}
