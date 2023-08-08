type Props = {
	subtasks: { description: string; completed: boolean }[];
	deleteSubtask?: (_id: number) => void;
	completeSubtask: (_id: number) => void;
};

export default function SubtaskDisplay(props: Props) {
	const { subtasks, deleteSubtask, completeSubtask } = props;

	return (
		<div className="flex flex-col py-2 space-y-1 justify-start max-w-min">
			{subtasks.map((subtask, index) => (
				<div
					className={
						"text-sm bg-blue-300 rounded-full px-3 py-1 flex flex-row space-x-4 justify-between items-center " +
						(deleteSubtask &&
							"hover:cursor-pointer hover:bg-blue-500 hover:text-white")
					}
					key={index}
				>
					<div onClick={() => completeSubtask(index)}>
						{subtask.completed ? (
							<s>{subtask.description}</s>
						) : (
							<span>{subtask.description}</span>
						)}
					</div>
					<div
						className="rounded-full hover:bg-blue-700 px-2 py-1"
						onClick={deleteSubtask && (() => deleteSubtask(index))}
					>
						<span>X</span>
					</div>
				</div>
			))}
		</div>
	);
}
