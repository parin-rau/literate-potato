import { useState } from "react";
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

	setProject?: never;
};

type ProjectProps = {
	dataKind: "project";
	cards: Project[];
	setCards: React.Dispatch<React.SetStateAction<Project[]>>;
	setCardCache: React.Dispatch<React.SetStateAction<Project[]>>;
	filters: string[];
	setFilters: React.Dispatch<React.SetStateAction<string[]>>;

	setProject?: React.Dispatch<React.SetStateAction<Project[]>>;
};

type Props = TicketProps | ProjectProps;
export default function CardSelector(
	// <T extends
	// | (FetchedTicketData & { dataKind: "ticket" })
	// | (Project & { dataKind: "project" })>
	props: Props
) {
	const {
		dataKind,
		cards,
		setCards,
		setCardCache,
		filters,
		setFilters,

		setProject,
	} = props;
	//const [isLoading, setLoading] = useState(true);

	switch (
		dataKind //setLoading(false);
	) {
		case "ticket":
			return (
				//!isLoading &&
				cards.map((card) => (
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
				))
			);
		case "project":
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
					{/* {!isLoading && <UncategorizedProjectsCard />} */}
				</>
			);
	}
}
