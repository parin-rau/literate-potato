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
import { countCompletedSubs } from "../../utility/countSubtasks";
import { useTicket, Props } from "../../hooks/card/useTicket";
import CommentContainer from "../Comments/CommentContainer";
import CountLabel from "../Display/CountLabel";

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
		group,
		ticketNumber,
		comments,
		creator,
		externalResourceURL,
		externalResourceText,
	} = props.cardData;

	const {
		setCards,
		filters,
		setFilters,
		filterCards,
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
		setStatusColors,
		isOverdue,
		isTicketPage,
		hover,
	} = useTicket(props);

	const moreOptions = [
		{ name: "Delete", fn: deleteCard, ticketId },
		{ name: "Edit", fn: editCard, ticketId },
	];

	return (
		<div
			className={
				"m-1 border-black border-2 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-600 " +
				(hover.isHover &&
					!isTicketPage &&
					" dark:hover:border-zinc-400 hover:bg-slate-100")
			}
		>
			{!isEditing && (
				<div className="flex flex-col px-4 py-4 space-y-2 dark:border-neutral-700">
					<div className="flex flex-row flex-grow justify-between items-baseline space-x-2">
						<Link
							to={`/ticket/${ticketId}`}
							className={
								"font-semibold text-2xl sm:text-3xl hover:underline " +
								(isTicketPage && " pointer-events-none")
							}
							onMouseEnter={hover.onMouseEnter}
							onMouseLeave={hover.onMouseLeave}
						>
							{title}
						</Link>

						<div className="flex flex-row space-x-2 items-center z-10">
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
							{due && (
								<p
									className={
										" " +
										(taskStatus !== "Completed" &&
											isOverdue(due) &&
											"text-red-500 font-semibold")
									}
								>
									{isOverdue(due) &&
									taskStatus !== "Completed" ? (
										<i>Due {due}</i>
									) : (
										`Due ${due}`
									)}
								</p>
							)}
						</div>
					)}
					{(description ||
						subtasks!.length > 0 ||
						tags.length > 0 ||
						externalResourceURL) && (
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
											filterCards,
										}}
									/>
								</div>
							)}
							{externalResourceURL && (
								<span>
									External Resource:{" "}
									<a
										className="underline"
										href={externalResourceURL}
										target="_blank"
									>
										{externalResourceText ?? "Link"}
									</a>
								</span>
							)}
						</div>
					)}
					<div className="flex flex-col shadow-sm border border-inherit p-2 rounded-lg">
						<span>
							Creator:{" "}
							<Link
								className="hover:underline"
								to={`/user/${creator.userId}`}
							>
								{creator.username}
							</Link>
						</span>
						<span>
							Project:{" "}
							<Link
								className="hover:underline"
								to={`/project/${project.projectId}`}
							>
								{project.projectId
									? project.projectTitle
									: "Unassigned"}
							</Link>
						</span>
						<span>
							Group:{" "}
							<Link
								className="hover:underline"
								to={`/group/${group.groupId}`}
							>
								{group.groupTitle}
							</Link>
						</span>
						<span>Created {timestampDisplay(timestamp)}</span>
						{lastModified && (
							<i>
								Last Activity {timestampDisplay(lastModified)}
							</i>
						)}
					</div>
					{comments && (
						<div
							className={
								"flex flex-col shadow-sm border border-inherit p-2 rounded-lg pointer-events-none" +
								(!isTicketPage && " dark:hover:bg-zinc-800")
							}
							role={isTicketPage ? "none" : "button"}
							onMouseEnter={hover.onMouseEnter}
							onMouseLeave={hover.onMouseLeave}
						>
							<span>
								{isTicketPage ? (
									<CommentContainer
										numComments={comments.length}
									/>
								) : (
									<Link
										className="pointer-events-auto"
										to={`/ticket/${ticketId}`}
									>
										<CountLabel
											count={comments.length}
											text="Comment"
											showZero
										/>
									</Link>
								)}
							</span>
						</div>
					)}

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
						setStatusColors,
						group,
					}}
					dataKind="ticket"
					previousData={{ ...props.cardData }}
				/>
			)}
		</div>
	);
}
