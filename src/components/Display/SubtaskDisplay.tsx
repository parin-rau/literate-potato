type Subtask = { description: string; completed: boolean; subtaskId: string };

type Props = {
	subtasks: Subtask[];
	deleteSubtask?: (_id: string) => void;
	completeSubtask?: (_id: string) => Promise<void>;
	editSubtask?: (_id: string) => void;
};

export default function SubtaskDisplay(props: Props) {
	const { subtasks, deleteSubtask, completeSubtask, editSubtask } = props;

	return (
		<div
			className={
				"flex py-2 flex-col flex-wrap"
				//(completeSubtask ? "flex-col" : "flex-row flex-wrap")
			}
		>
			{subtasks.map((subtask) => (
				<button
					type="button"
					className={
						"transition duration-100 hover:bg-slate-200 dark:hover:bg-zinc-800 text-sm rounded px-1 py-1 flex flex-row space-x-4 m-1 justify-between items-center cursor-pointer text-left " +
						(subtask.completed
							? " bg-transparent outline outline-1 text-slate-400 dark:text-zinc-400 outline-neutral-200 dark:outline-zinc-500 dark:hover:outline-none hover:outline-none"
							: " bg-slate-300 dark:bg-zinc-700")
					}
					title={
						!deleteSubtask && !editSubtask
							? subtask.completed
								? "Mark Uncompleted"
								: "Mark Completed"
							: ""
					}
					onClick={() => {
						completeSubtask && completeSubtask(subtask.subtaskId);
					}}
					key={subtask.subtaskId}
				>
					<div className="px-2 py-1">
						{subtask.completed ? (
							<i className="text-base ">{subtask.description}</i>
						) : (
							<span className="text-base">
								{subtask.description}
							</span>
						)}
					</div>
					{deleteSubtask && editSubtask && (
						<div className="flex flex-row space-x-1 items-center">
							<button
								className="rounded-lg p-1 hover:bg-slate-400 dark:hover:bg-zinc-700"
								title="Edit"
								onClick={() => editSubtask(subtask.subtaskId)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="w-6 h-6"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
									/>
								</svg>
							</button>
							<button
								className="rounded-lg p-1 hover:bg-slate-400 dark:hover:bg-zinc-700"
								title="Delete"
								onClick={() => deleteSubtask(subtask.subtaskId)}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
								</svg>
							</button>
						</div>
					)}
				</button>
			))}
		</div>
	);
}
