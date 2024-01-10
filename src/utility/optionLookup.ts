import { FetchedTicketData, Project, SortMenu, SortableObj } from "../types";
import {
	sortByKey,
	sortByTicketCompletion,
	sortByProjectCompletion,
} from "./sortData";

//type SortArr = FetchedTicketData[];
//type OptionsTable = { value: string; sortValue: number }[];
// type LookupResult = { sortValue: number; ticketId: string }[];

// export function sortData(
// 	dataArr: FetchedTicketData[],
// 	key: keyof FetchedTicketData,
// 	direction: "asc" | "desc"
// ) {
// 	if (key === "timestamp") {
// 		if (direction === "asc") {
// 			const sortedData = [...dataArr].sort(
// 				(a, b) => a.timestamp - b.timestamp
// 			);
// 			return { sortedData };
// 		} else if (direction === "desc") {
// 			const sortedData = [...dataArr].sort(
// 				(a, b) => b.timestamp - a.timestamp
// 			);
// 			return { sortedData };
// 		}
// 	} else if (key === "priority" || key === "taskStatus") {
// 		//Object.prototype.hasOwnProperty.call(optionLookup, key)
// 		const lookupProperty = key;
// 		const lookup = [...dataArr].map((data) => ({
// 			...data,
// 			sortValue: parseSortValue(
// 				data[lookupProperty],
// 				optionLookup[lookupProperty]
// 			),
// 		}));
// 		if (direction === "asc") {
// 			const sortedIntermediate = [...lookup].sort(
// 				(a, b) => a.sortValue - b.sortValue
// 			);
// 			const sortedData = sortedIntermediate.map(
// 				// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
// 				({ sortValue, ...data }) => data
// 			);
// 			const sortCategories = {
// 				property: lookupProperty,
// 				categories: optionLookup[lookupProperty].map(
// 					(item) => item.label
// 				),
// 			};

// 			return { sortedData, sortCategories };
// 		} else if (direction === "desc") {
// 			const sortedIntermediate = [...lookup].sort(
// 				(a, b) => b.sortValue - a.sortValue
// 			);
// 			const sortedData = sortedIntermediate.map(
// 				// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
// 				({ sortValue, ...data }) => data
// 			);
// 			const sortCategories = {
// 				property: lookupProperty,
// 				categories: optionLookup[lookupProperty].map(
// 					(item) => item.label
// 				),
// 			};
// 			return { sortedData, sortCategories };
// 		}

// 		// } else if (key === "taskStatus") {
// 		// 	const lookup = dataArr.map((data) => ({
// 		// 		...data,
// 		// 		sortValue: parseSortValue(
// 		// 			data.taskStatus,
// 		// 			optionLookup.statusOptions
// 		// 		),
// 		// 	}));
// 		// 	const sortedIntermediate = lookup.sort(
// 		// 		(a, b) => a.sortValue - b.sortValue
// 		// 	);
// 		// 	const sortedData = sortedIntermediate.map(
// 		// 		// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
// 		// 		({ sortValue, ...data }) => data
// 		// 	); // sortedIntermediate.forEach(data => delete data.sortValue)
// 		// 	return sortedData;
// 	}
// }

// function parseSortValue(stringValue: string, lookup: OptionsTable) {
// 	//if (typeof stringValue === "string") {
// 	const outValue =
// 		lookup.find((obj) => obj.value === stringValue)?.sortValue ?? 0;
// 	return outValue;
// }

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
			label: "On Hold",
			value: "On Hold",
			sortValue: -1,
			bgColor: "bg-violet-600 dark:bg-violet-800",
			textColor: "text-white",
		},
		{
			label: "Not Started",
			value: "Not Started",
			sortValue: 0,
			bgColor: "bg-red-500 dark:bg-red-700",
			textColor: "text-white",
		},
		{
			label: "In Progress",
			value: "In Progress",
			sortValue: 1,
			bgColor: "bg-amber-500 dark:bg-amber-600",
			textColor: "text-white",
		},
		{
			label: "Completed",
			value: "Completed",
			sortValue: 2,
			bgColor: "bg-green-500 dark:bg-green-700",
			textColor: "text-white",
		},
	],
	roles: [
		{ label: "admin", value: 0 },
		{ label: "user", value: 1 },
		{ label: "manager", value: 2 },
	],
};

export const statusColorsLookup = (currentStatus: string) => {
	const currentOption = optionLookup.taskStatus.find(
		(option) => option.value === currentStatus
	);
	const optionColors =
		currentOption?.bgColor && currentOption?.textColor
			? `${currentOption.bgColor} ${currentOption.textColor}`
			: "bg-slate-100 text-black";
	return optionColors;
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
				label: "Low Priority",
				//arrowDirection: "up",
				fn: () => handleSort("priority", "asc"),
			},
			{
				label: "High Priority",
				//arrowDirection: "down",
				fn: () => handleSort("priority", "desc"),
			},
			{
				label: "Lowest Progress",
				//arrowDirection: "up",
				fn: () => handleSort("taskStatus", "asc"),
			},
			{
				label: "Highest Progress",
				//arrowDirection: "down",
				fn: () => handleSort("taskStatus", "desc"),
			},
			{
				label: "Oldest",
				//arrowDirection: "up",
				fn: () => handleSort("timestamp", "asc"),
			},
			{
				label: "Recent",
				//arrowDirection: "down",
				fn: () => handleSort("timestamp", "desc"),
			},
		];
	},
};

type Setter = React.Dispatch<React.SetStateAction<SortableObj[]>>;
// type SortItems =
// 	| {
// 			items: SortableObj[];
// 			dataKind?: never;
// 			setItems: Setter;
// 	  }
// 	| (
// 			| {
// 					items: FetchedTicketData[];
// 					dataKind: "ticket";
// 					setItems: Setter;
// 			  }
// 			| { items: Project[]; dataKind: "project"; setItems: Setter }
// 	  );

export const sortItemsOptions = //({ items, dataKind, setItems }: SortItems) => {
	(
		//dataKind: "ticket" | "project",
		items: SortableObj[],
		setItems: Setter
		//arr: FetchedTicketData[] | Project[], setItems: Setter
	): SortMenu => {
		// const fnTemplate = ({
		// 	key,
		// 	dataKind,
		// 	direction = 1,
		// }: {
		// 	key?: string;
		// 	dataKind?: "ticket" | "project",
		// 	direction?: 1 | -1;
		// }) => {
		// 	if (key) {
		// 		return () => {
		// 			const sorted = sortByKey(items, key, direction);
		// 			setItems(sorted);
		// 		};
		// 	} else if (dataKind) {
		// 		return () => {
		// 			const sorted = sortByCompletion({
		// 				dataKind,
		// 				direction,
		// 				arr: items as unknown as dataKind extends "ticket" ? FetchedTicketData[] : Project[],
		// 			});
		// 			setItems(sorted as unknown as SortableObj[]);
		// 		};
		// 	} else return () => {};
		// };

		// type T = ({dataKind: "ticket"; arr: FetchedTicketData[]} | {dataKind: "project"; arr: Project[]}) & {direction: 1 | -1}

		// const temp = (//{dataKind, arr, direction = 1}
		// t: T ) => () => {
		// 	const sorted = sortByCompletion(t);
		// 	setItems(sorted as unknown as SortableObj[]);
		// };

		// const fnTemplate2 =
		// 	<T extends SortableObj>(
		// 		dataKind: "ticket" | "project",
		// 		direction: 1 | -1 = 1
		// 	) =>
		// 	() => {
		// 		const sorted = sortByCompletion({
		// 			dataKind,
		// 			arr: items,
		// 			direction,
		// 		});
		// 		setItems(sorted as T[]);
		// 	};

		// return [
		// 	{
		// 		label: "Title, A -> Z",
		// 		fn: fnTemplate({ key: "title" }),
		// 	},
		// 	{
		// 		label: "Title, Z -> A",
		// 		fn: fnTemplate({ key: "title", direction: -1 }),
		// 	},
		// 	{
		// 		label: "Oldest First",
		// 		fn: fnTemplate({ key: "timestamp" }),
		// 	},
		// 	{
		// 		label: "Newest First",
		// 		fn: fnTemplate({ key: "timestamp", direction: -1 }),
		// 	},
		// 	{
		// 		label: "Lowest Completion First",
		// 		fn: temp({dataKind, arr, }),
		// 	},
		// ];

		return [
			{
				label: "Title, A -> Z",
				fn: () => setItems(sortByKey(items, "title")),
			},
			{
				label: "Title, Z -> A",
				fn: () => setItems(sortByKey(items, "title", -1)),
			},
			{
				label: "Oldest First",
				fn: () => setItems(sortByKey(items, "timestamp")),
			},
			{
				label: "Newest First",
				fn: () => setItems(sortByKey(items, "timestamp", -1)),
			},
			// {
			// 	label: "Lowest Completion First",
			// 	fn: () => sortByCompletion({ dataKind, items }),
			// },
			// {
			// 	label: "Lowest Completion First",
			// 	fn: () => sortByCompletion({ dataKind, items, direction: -1 }),
			// },
		];
	};

type SortTicketOptions = {
	tickets: FetchedTicketData[];
	setItems: React.Dispatch<React.SetStateAction<FetchedTicketData[]>>;
};
export const sortTicketOptions = ({ tickets, setItems }: SortTicketOptions) => [
	{
		label: "Lowest Completion First",
		fn: () => setItems(sortByTicketCompletion(tickets)),
	},
	{
		label: "Lowest Completion First",
		fn: () => setItems(sortByTicketCompletion(tickets, -1)),
	},
];

type SortProjectOptions = {
	projects: Project[];
	setItems: React.Dispatch<React.SetStateAction<Project[]>>;
};
export const sortProjectOptions = ({
	projects,
	setItems,
}: SortProjectOptions) => [
	{
		label: "Lowest Completion First",
		fn: () => setItems(sortByProjectCompletion(projects)),
	},
	{
		label: "Lowest Completion First",
		fn: () => setItems(sortByProjectCompletion(projects, -1)),
	},
];
