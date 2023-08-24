import { FetchedTicketData, SortMenu } from "../types";

//type SortArr = FetchedTicketData[];
type OptionsTable = { value: string; sortValue: number }[];
// type LookupResult = { sortValue: number; ticketId: string }[];

export function sortData(
	dataArr: FetchedTicketData[],
	key: keyof FetchedTicketData,
	direction: "asc" | "desc"
) {
	if (key === "timestamp") {
		if (direction === "asc") {
			const sortedData = [...dataArr].sort(
				(a, b) => a.timestamp - b.timestamp
			);
			return { sortedData };
		} else if (direction === "desc") {
			const sortedData = [...dataArr].sort(
				(a, b) => b.timestamp - a.timestamp
			);
			return { sortedData };
		}
	} else if (key === "priority" || key === "taskStatus") {
		//Object.prototype.hasOwnProperty.call(optionLookup, key)
		const lookupProperty = key;
		const lookup = [...dataArr].map((data) => ({
			...data,
			sortValue: parseSortValue(
				data[lookupProperty],
				optionLookup[lookupProperty]
			),
		}));
		if (direction === "asc") {
			const sortedIntermediate = [...lookup].sort(
				(a, b) => a.sortValue - b.sortValue
			);
			const sortedData = sortedIntermediate.map(
				// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
				({ sortValue, ...data }) => data
			);
			const sortCategories = {
				property: lookupProperty,
				categories: optionLookup[lookupProperty].map(
					(item) => item.label
				),
			};

			return { sortedData, sortCategories };
		} else if (direction === "desc") {
			const sortedIntermediate = [...lookup].sort(
				(a, b) => b.sortValue - a.sortValue
			);
			const sortedData = sortedIntermediate.map(
				// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
				({ sortValue, ...data }) => data
			);
			const sortCategories = {
				property: lookupProperty,
				categories: optionLookup[lookupProperty].map(
					(item) => item.label
				),
			};
			return { sortedData, sortCategories };
		}

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

// function sortOrder(
// 	array: FetchedTicketData[],
// 	sortProp: keyof FetchedTicketData[],
// 	direction: "asc" | "desc"
// ) {
// 	if (direction === "asc") {
// 		const sorted = array.sort((a, b) => b[sortProp] - a[sortProp]);
// 		return sorted;
// 	} else if (direction === "desc") {
// 		const sorted = array.sort((a, b) => a[sortProp] - b[sortProp]);
// 		return sorted;
// 	}
// }

export const optionLookup = {
	priority: [
		{
			label: "Select task priority",
			value: "",
			sortValue: 0,
		},
		{ label: "Low", value: "Low", sortValue: 1 },
		{ label: "Medium", value: "Medium", sortValue: 2 },
		{ label: "High", value: "High", sortValue: 3 },
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

export const menuLookup = {
	sortMenu: function menuLookup(
		handleSort: (
			_sortKind: "priority" | "taskStatus" | "timestamp",
			_direction: "asc" | "desc"
		) => void
	) {
		return <SortMenu>[
			{
				name: "Priority",
				arrowDirection: "up",
				fn: () => handleSort("priority", "asc"),
			},
			{
				name: "Priority",
				arrowDirection: "down",
				fn: () => handleSort("priority", "desc"),
			},
			{
				name: "Progress",
				arrowDirection: "up",
				fn: () => handleSort("taskStatus", "asc"),
			},
			{
				name: "Progress",
				arrowDirection: "down",
				fn: () => handleSort("taskStatus", "desc"),
			},
			{
				name: "Recent",
				arrowDirection: "up",
				fn: () => handleSort("timestamp", "asc"),
			},
			{
				name: "Recent",
				arrowDirection: "down",
				fn: () => handleSort("timestamp", "desc"),
			},
		];
	},
};
