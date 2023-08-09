type Props = {
	subtasks: { description: string; completed: boolean; subtaskId: string }[];
	deleteSubtask?: (_id: string) => void;
	completeSubtask?: (_id: string) => Promise<void>;
};

export default function SubtaskDisplay(props: Props) {
	const { subtasks, deleteSubtask, completeSubtask } = props;

	return (
		<div className="flex flex-col py-2 space-y-1 justify-start max-w-min">
			{subtasks.map((subtask) => (
				<div
					className={
						"text-sm bg-slate-200 rounded-md px-1 py-1 flex flex-row space-x-4 justify-between items-center " +
						(completeSubtask &&
							" hover:cursor-pointer hover:bg-slate-400 hover:text-white")
					}
					key={subtask.subtaskId}
				>
					<div
						onClick={() =>
							completeSubtask &&
							completeSubtask(subtask.subtaskId)
						}
						className="px-2 py-1"
					>
						{subtask.completed ? (
							<s className="text-base">{subtask.description}</s>
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
