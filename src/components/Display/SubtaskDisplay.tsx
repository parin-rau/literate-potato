type Props = {
	subtasks: { description: string; completed: boolean; subtaskId: string }[];
	deleteSubtask?: (_id: string) => void;
	completeSubtask?: (_id: string) => Promise<void>;
};

export default function SubtaskDisplay(props: Props) {
	const { subtasks, deleteSubtask, completeSubtask } = props;

	return (
		<div
			className={
				"flex py-2 flex-col flex-wrap"
				//(completeSubtask ? "flex-col" : "flex-row flex-wrap")
			}
		>
			{subtasks.map((subtask) => (
				<div
					className={
						"transition duration-100 hover:bg-slate-400 hover:text-white text-sm rounded px-1 py-1 max-w-fit flex flex-row space-x-4 m-1 justify-between items-center " +
						(completeSubtask && " hover:cursor-pointer ") +
						(subtask.completed
							? " bg-transparent outline outline-1 text-slate-400 outline-neutral-200 hover:outline-none"
							: " bg-slate-300")
					}
					onClick={() =>
						completeSubtask && completeSubtask(subtask.subtaskId)
					}
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
					{deleteSubtask && (
						<div
							className="rounded-full px-1 py-1 hover:cursor-pointer hover:bg-slate-400 hover:text-white"
							onClick={() => deleteSubtask(subtask.subtaskId)}
						>
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
									className="w-5 h-5"
								>
									<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
								</svg>
							</span>
						</div>
					)}
				</div>
			))}
		</div>
	);
}
