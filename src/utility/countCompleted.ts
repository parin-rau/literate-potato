import { FetchedTicketData } from "../types";

export function countCompletedSubs(tasks: FetchedTicketData["subtasks"]) {
	if (tasks) {
		const totalTasks = tasks.length;
		const isCompleted: number[] = tasks.map((task) =>
			task.completed ? 1 : 0
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
