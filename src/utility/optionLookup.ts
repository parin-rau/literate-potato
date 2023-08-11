import { FetchedTicketData } from "../types";

//type SortArr = FetchedTicketData[];
type OptionsTable = { value: string; sortValue: number }[];
// type LookupResult = { sortValue: number; ticketId: string }[];

export function sortData(
	dataArr: FetchedTicketData[],
	key: keyof FetchedTicketData
) {
	if (key === "timestamp") {
		const sortedData = dataArr.sort((a, b) => a.timestamp - b.timestamp);
		return sortedData;
	} else if (key === "priority" || key === "taskStatus") {
		const lookupProperty = key;
		const lookup = dataArr.map((data) => ({
			...data,
			sortValue: parseSortValue(
				data[lookupProperty],
				optionLookup[lookupProperty]
			),
		}));
		const sortedIntermediate = lookup.sort(
			(a, b) => a.sortValue - b.sortValue
		);
		const sortedData = sortedIntermediate.map(
			// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
			({ sortValue, ...data }) => data
		); // sortedIntermediate.forEach(data => delete data.sortValue)
		return sortedData;
		// } else if (key === "taskStatus") {
		// 	const lookup = dataArr.map((data) => ({
		// 		...data,
		// 		sortValue: parseSortValue(
		// 			data.taskStatus,
		// 			optionLookup.statusOptions
		// 		),
		// 	}));
		// 	const sortedIntermediate = lookup.sort(
		// 		(a, b) => a.sortValue - b.sortValue
		// 	);
		// 	const sortedData = sortedIntermediate.map(
		// 		// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
		// 		({ sortValue, ...data }) => data
		// 	); // sortedIntermediate.forEach(data => delete data.sortValue)
		// 	return sortedData;
	}
}

function parseSortValue(stringValue: string, lookup: OptionsTable) {
	//if (typeof stringValue === "string") {
	const outValue =
		lookup.find((obj) => obj.value === stringValue)?.sortValue ?? 0;
	return outValue;
}

function sortOrder(array, sortProp, direction: "asc" | "desc") {
	if (direction === "asc") {
		const sorted = array.sort((a, b) => b[sortProp] - a[sortProp]);
		return sorted;
	} else if (direction === "desc") {
		const sorted = array.sort((a, b) => a[sortProp] - b[sortProp]);
		return sorted;
	}
}
// 	} else if (typeof inValue === "number") {
// 		const outValue: string = lookup.find(
// 			(obj) => obj.sortValue === inValue
// 		).value;
// 		return outValue;
// 	}
// }

// function parseStringValue(sortValue: number, lookup: OptionsTable) {
// 	const outValue =
// 		lookup.find((obj) => obj.sortValue === sortValue)?.value ?? "";
// 	return outValue;
// }

export const optionLookup = {
	priority: [
		{
			label: "Select task priority",
			value: "",
			sortValue: 3,
		},
		{ label: "Low", value: "Low", sortValue: 2 },
		{ label: "Medium", value: "Medium", sortValue: 1 },
		{ label: "High", value: "High", sortValue: 0 },
	],
	taskStatus: [
		{
			label: "Not Started",
			value: "Not Started",
			sortValue: 0,
			bgColor: "bg-red-500",
			textColor: "text-white",
		},
		{
			label: "In Progress",
			value: "In Progress",
			sortValue: 1,
			bgColor: "bg-yellow-500",
			textColor: "text-white",
		},
		{
			label: "Completed",
			value: "Completed",
			sortValue: 2,
			bgColor: "bg-green-500",
			textColor: "text-white",
		},
	],
};
