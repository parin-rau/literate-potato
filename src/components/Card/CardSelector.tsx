import { Link } from "react-router-dom";
import { FetchedTicketData, Project } from "../../types";
import ProjectCard from "./ProjectCard";
import TicketCard from "./TicketCard";
import { v4 as uuidv4 } from "uuid";

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

				<Link
					className="m-1 border-black border-2 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-600 hover:underline"
					to={`project/uncategorized`}
				>
					<div className="flex flex-col px-4 py-2 space-y-1 dark:border-neutral-700">
						<i className=" text-xl sm:text-2xl ">
							Uncategorized Tasks
						</i>
					</div>
				</Link>
			</>
		);
	}
}
