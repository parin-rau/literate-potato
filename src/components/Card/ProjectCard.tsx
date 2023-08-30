import { useState } from "react";
import { Link } from "react-router-dom";
import { Project } from "../../types";
import timestampDisplay from "../../utility/timestampDisplay";
import MenuDropdown from "../Nav/MenuDropdown";
import TicketEditor from "../Editor/TicketEditor";

type Props = {
	isHeader?: boolean;
	cardData: Project;
	setCards: React.Dispatch<React.SetStateAction<Project[]>>;
	setCardCache?: React.Dispatch<React.SetStateAction<Project[]>>;
};

export default function ProjectCard(props: Props) {
	const { title, description, creator, projectId, timestamp, projectNumber } =
		props.cardData;
	const { setCards, setCardCache, isHeader } = props;
	const [isEditing, setEditing] = useState(false);

	const moreOptions = [
		{ name: "Delete", fn: deleteCard, projectId },
		{ name: "Edit", fn: editCard, projectId },
	];

	async function deleteCard(id: string) {
		try {
			const res1 = await fetch(`/api/project/${projectId}`, {
				method: "DELETE",
			});
			if (res1.ok) {
				try {
					const ticketPatch = {
						project: {
							projectId: "",
							projectTitle: "No project assigned",
						},
					};
					const res2 = await fetch(
						`/api/ticket/project-edit/${projectId}`,
						{
							method: "PATCH",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(ticketPatch),
						}
					);
					if (res2.ok) {
						setCards((prevCards) =>
							prevCards.filter((card) => card.projectId !== id)
						);
						setCardCache &&
							setCardCache((prev) =>
								prev.filter((card) => card.projectId !== id)
							);
					}
				} catch (e) {
					console.error(e);
				}
			}
		} catch (err) {
			console.error(err);
		}
	}

	function editCard() {
		setEditing(true);
	}

	return (
		<>
			{isHeader && (
				<div className="flex flex-row space-x-2 items-baseline">
					<h1 className="font-bold text-4xl mx-2">{title}</h1>
					<MenuDropdown options={moreOptions} cardId={projectId} />
				</div>
			)}
			<div className="m-1 border-black border-2 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-600">
				{!isEditing && (
					<div className="flex flex-col px-4 py-3 space-y-1 dark:border-neutral-700">
						{!isHeader && (
							<div className="flex flex-row flex-grow justify-between items-baseline space-x-2">
								<div className="flex flex-col sm:flex-row sm:items-baseline space-y-1 sm:space-x-4">
									<Link to={`project/${projectId}`}>
										<h1 className="font-semibold text-2xl sm:text-3xl">
											{title}
										</h1>
									</Link>
									<h2 className="text-lg sm:text-xl">
										{projectNumber && `#${projectNumber}`}
									</h2>
								</div>
								<MenuDropdown
									options={moreOptions}
									cardId={projectId}
								/>
							</div>
						)}
						{description && (
							<h2 className="text-lg">{description}</h2>
						)}
						{creator && <h3 className="">Creator: {creator}</h3>}
						<span>Created: {timestampDisplay(timestamp)}</span>
						<div>[ View Details ]</div>
					</div>
				)}
				{isEditing && (
					<TicketEditor
						{...{
							setCards,
							setEditing,
							setCardCache: setCardCache as React.Dispatch<
								React.SetStateAction<Project[]>
							>,
						}}
						dataKind="project"
						previousData={{ ...props.cardData }}
					/>
				)}
			</div>
		</>
	);
}
