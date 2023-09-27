import { FetchedTicketData } from "../../types";
import MenuDropdown from "../Nav/MenuDropdown";
import timestampDisplay from "../../utility/timestampDisplay";
import TagsDisplay from "../Display/TagsDisplay";
import SelectDropdown from "../Nav/SelectDropdown";
import SubtaskDisplay from "../Display/SubtaskDisplay";
import { optionLookup } from "../../utility/optionLookup";
import { Link } from "react-router-dom";
import TicketEditor from "../Editor/TicketEditor";
import ProgressBar from "../Display/ProgressBar";
import { countCompletedSubs } from "../../utility/countCompleted";
import { useTicket, Props } from "../../hooks/useTicket";

export default function TicketCard(props: Props) {
	const {
		title,
		description,
		priority,
		due,
		timestamp,
		tags,
		ticketId,
		taskStatus,
		lastModified,
		subtasks,
		project,
		ticketNumber,
		comments,
		creator,
	} = props.cardData;

	const {
		setCards,
		filters,
		setFilters,

		setCardCache,
		setProject,
	} = props;

	const {
		deleteCard,
		editCard,
		changeStatus,
		completeSubtask,
		isEditing,
		setEditing,
		statusColors,
	} = useTicket(props);

	const moreOptions = [
		{ name: "Delete", fn: deleteCard, ticketId },
		{ name: "Edit", fn: editCard, ticketId },
	];

	return (
		<div className="m-1 border-black border-2 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-600">
			{!isEditing && (
				<div className="flex flex-col px-4 py-4 space-y-2 dark:border-neutral-700">
					<div className="flex flex-row flex-grow justify-between items-baseline space-x-2">
						<Link
							to={`/ticket/${ticketId}`}
							className="font-semibold text-2xl sm:text-3xl hover:underline"
						>
							{title}
						</Link>

						<div className="flex flex-row space-x-2 items-center z-0">
							<h2 className="text-lg sm:text-xl pr-2">
								{ticketNumber && `#${ticketNumber}`}
							</h2>
							<SelectDropdown
								name="taskStatus"
								value={taskStatus}
								options={optionLookup.taskStatus}
								handleChange={changeStatus}
								stylesOverride={statusColors}
							/>
							<MenuDropdown
								options={moreOptions}
								cardId={ticketId}
							/>
						</div>
					</div>
					{(priority || due || subtasks!.length > 0) && (
						<div className="flex flex-col space-y-1 rounded-lg border border-inherit shadow-sm p-2">
							{subtasks && subtasks.length > 0 && (
								<>
									<ProgressBar
										progress={countCompletedSubs(subtasks)}
										caption="Subtasks"
									/>
								</>
							)}
							{priority && (
								<p className="">Priority: {priority}</p>
							)}
							{due && (
								<p
									className={
										" " +
										(taskStatus !== "Completed" &&
											Date.now() >
												new Date(due).getTime() &&
											"text-red-500 font-semibold")
									}
								>
									Due: {due}
									{taskStatus !== "Completed" &&
										Date.now() >
											new Date(due).getTime() && (
											<i> Overdue</i>
										)}
								</p>
							)}
						</div>
					)}
					{(description ||
						subtasks!.length > 0 ||
						tags.length > 0) && (
						<div className="border-inherit border rounded-lg shadow-sm p-2 space-y-4">
							{description && (
								<p className="text-lg">{description}</p>
							)}
							{subtasks && subtasks.length > 0 && (
								<div>
									<h4 className="font-semibold">Subtasks</h4>
									<SubtaskDisplay
										subtasks={subtasks}
										completeSubtask={completeSubtask}
									/>
								</div>
							)}
							{tags.length > 0 && (
								<div>
									<h4 className="font-semibold">Tags</h4>
									<TagsDisplay
										{...{
											tags,
											filters,
											setFilters,
										}}
									/>
								</div>
							)}
						</div>
					)}
					{comments && (
						<div className="flex flex-col shadow-sm border border-inherit p-2 rounded-lg">
							<span>
								<Link to={`/ticket/${ticketId}`}>
									{`${comments.length} Comment${
										comments.length !== 1 && "s"
									}`}
								</Link>
							</span>
						</div>
					)}
					<div className="flex flex-col shadow-sm border border-inherit p-2 rounded-lg">
						{creator && <span>Creator: {creator}</span>}
						<span>
							<Link to={`/project/${project.projectId}`}>
								Project:{" "}
								{project.projectId ? (
									<u>{project.projectTitle}</u>
								) : (
									"Unassigned"
								)}
							</Link>
						</span>
						<span>Created: {timestampDisplay(timestamp)}</span>
						{lastModified && (
							<i>
								Last Activity: {timestampDisplay(lastModified)}
							</i>
						)}
					</div>
					{/* <p>ticket: {ticketId}</p>
				<p>project: {projectId}</p> */}
				</div>
			)}
			{isEditing && (
				<TicketEditor
					{...{
						setCards,
						setEditing,
						setProject,
						setCardCache: setCardCache as React.Dispatch<
							React.SetStateAction<FetchedTicketData[]>
						>,
					}}
					dataKind="ticket"
					previousData={{ ...props.cardData }}
				/>
			)}
		</div>
	);
}
