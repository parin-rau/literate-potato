import { Sortable, SortableObj, FetchedTicketData, Project } from "../types";
import { allLowerCase } from "./charCaseFunctions";

export function sortByKey<T extends SortableObj>(
	arr: T[],
	key: string,
	direction?: 1 | -1
) {
	const splitKey = key.split(".");
	const isAscending = !direction || direction === 1;

	if (splitKey.length === 0) {
		return [];
	} else {
		const keys = key.split(".");

		const sorted = [...arr].sort((a: Sortable, b: Sortable) => {
			let i = 0;

			while (i < keys.length) {
				a = typeof a !== "object" ? a : a[keys[i]];
				b = typeof b !== "object" ? b : b[keys[i]];
				i++;
			}

			if (
				(typeof a !== "string" && typeof a !== "number") ||
				(typeof b !== "string" && typeof b !== "number")
			)
				return 0;

			if (allLowerCase(a) > allLowerCase(b)) {
				return isAscending ? 1 : -1;
			} else if (allLowerCase(a) < allLowerCase(b)) {
				return isAscending ? -1 : 1;
			} else {
				return 0;
			}
		});
		return sorted;
	}
}

type SortByCompletionParams = (
	| {
			dataKind: "ticket";
			arr: FetchedTicketData[];
	  }
	| {
			dataKind: "project";
			arr: Project[];
	  }
) & {
	direction: 1 | -1;
	//arr: SortableObj[]
};

//type T = SortByCompletionParams["dataKind"] extends "ticket" ? FetchedTicketData : Project

export function sortByCompletion({
	dataKind,
	arr,
	direction,
}: SortByCompletionParams) {
	const isAscending = !direction || direction === 1;

	// const getSorted = <T extends SortByCompletionParams>(fn: (_o: T["d"]) => number) => [...arr].sort((a, b) => {
	// 	if (fn(a) > fn(b)) return isAscending ? 1 : -1
	// 	else if (fn(a) < fn(b)) return isAscending ? -1 : 1
	// 	else return 0
	// })

	if (dataKind === "ticket") {
		const completion = (t: FetchedTicketData) =>
			t.subtasks.filter((s) => s.completed).length / t.subtasks.length;
		return [...arr].sort((a, b) => {
			if (completion(a) > completion(b)) return isAscending ? 1 : -1;
			else if (completion(a) < completion(b)) return isAscending ? -1 : 1;
			else return 0;
		});
	} else if (dataKind === "project") {
		{
			const completion = (p: Project) =>
				p.tasksCompletedIds.length / p.tasksTotalIds.length;
			return [...arr].sort((a, b) => {
				if (completion(a) > completion(b)) return isAscending ? 1 : -1;
				else if (completion(a) < completion(b))
					return isAscending ? -1 : 1;
				else return 0;
			});
		}
	} else {
		return arr;
	}
}

export function sortByTicketCompletion(
	tickets: FetchedTicketData[],
	direction: 1 | -1 = 1
) {
	const isAscending = !direction || direction === 1;

	const completion = (t: FetchedTicketData) =>
		t.subtasks.filter((s) => s.completed).length / t.subtasks.length;
	return [...tickets].sort((a, b) => {
		if (completion(a) > completion(b)) return isAscending ? 1 : -1;
		else if (completion(a) < completion(b)) return isAscending ? -1 : 1;
		else return 0;
	});
}

export function sortByProjectCompletion(
	projects: Project[],
	direction: 1 | -1 = 1
) {
	const isAscending = !direction || direction === 1;

	const completion = (p: Project) =>
		p.tasksCompletedIds.length / p.tasksTotalIds.length;
	return [...projects].sort((a, b) => {
		if (completion(a) > completion(b)) return isAscending ? 1 : -1;
		else if (completion(a) < completion(b)) return isAscending ? -1 : 1;
		else return 0;
	});
}
