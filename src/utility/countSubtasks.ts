import { FetchedTicketData } from "../types";

export function countCompletedSubs(subtasks: FetchedTicketData["subtasks"]) {
	if (subtasks) {
		const totalTasks = subtasks.length;
		const isCompleted: number[] = subtasks.map((subtask) =>
			subtask.completed ? 1 : 0
		);
		const totalCompleted = isCompleted.reduce((a, b) => a + b, 0);
		const percentCompletedNum =
			totalTasks > 0
				? Math.floor((totalCompleted / totalTasks) * 100)
				: 0;
		const percentCompletedString = percentCompletedNum.toString() + "%";
		return {
			totalTasks,
			totalCompleted,
			percentCompletedString,
			percentCompletedNum,
		};
	} else {
		return {
			totalTasks: 0,
			totalCompleted: 0,
			percentCompletedString: "0%",
			percentCompletedNum: 0,
		};
	}
}

export function countTotalSubs(tasks: FetchedTicketData[]) {
	if (!tasks.length) return 0;

	const subtaskCountArr = tasks.map((t) => t.subtasks.length);
	const totalSubtasks = subtaskCountArr.reduce((a, b) => a + b, 0);
	return totalSubtasks;
}
