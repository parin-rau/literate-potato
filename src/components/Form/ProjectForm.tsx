import { useState, useEffect } from "react";
import { Group, ProjectEditor } from "../../types";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";
import SelectDropdown from "../Nav/SelectDropdown";

type Props = {
	editor: ProjectEditor;
	handleChange: (
		_e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => void;
};

type DropdownItem = {
	label: string;
	value: string;
};

export default function ProjectForm(props: Props) {
	const { editor, handleChange } = props;
	const [groupList, setGroupList] = useState<DropdownItem[]>([]);
	const { protectedFetch } = useProtectedFetch();

	useEffect(() => {
		const abortController = new AbortController();

		const getDropdownData = async () => {
			const defaultGroup = { value: "", label: "No group assigned" };
			const res = await protectedFetch("/api/group", {
				signal: abortController.signal,
			});
			if (res.ok) {
				const fetchedGroups: Group[] = await res.json();
				const fetchedGroupNames = fetchedGroups.map((g) => ({
					value: g.groupId,
					label: g.title,
				}));
				setGroupList([defaultGroup, ...fetchedGroupNames]);
			}
		};
		getDropdownData();

		return () => abortController.abort();
	}, [protectedFetch]);

	return (
		<>
			<input
				className="text-lg sm:text-xl border rounded-md px-2 shadow-sm bg-inherit border-inherit"
				name="title"
				value={editor.title}
				onChange={handleChange}
				placeholder="Title"
				autoFocus
				required
			/>

			<div className="flex flex-col sm:border sm:rounded-md shadow-none sm:shadow-sm p-2 space-y-2 border-inherit">
				<h4 className="px-1">Group</h4>
				<SelectDropdown
					name="groupId"
					value={editor.group.groupId}
					options={groupList}
					handleChange={handleChange}
					stylesOverride="bg-slate-100 dark:bg-zinc-800 h-8"
					required
				/>
			</div>

			{/* <input
				className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
				name="creator"
				value={editor.creator}
				onChange={handleChange}
				placeholder="Creator"
			/> */}
			<textarea
				className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
				name="description"
				rows={2}
				value={editor.description}
				onChange={handleChange}
				placeholder="Description"
			/>
			{/* <div className="flex flex-row gap-2 items-center">
				<h4>Color:</h4>
				<input
					className=""
					name="color"
					type="color"
					value={editor.color}
					onChange={handleChange}
					placeholder="Color"
				/>
			</div> */}

			<div className="space-x-2">
				<button
					className="transition duration-200 mt-2 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 py-2 px-4 rounded-md max-w-min"
					type="submit"
				>
					Submit
				</button>
				<i className="text-sm">Shift + Enter</i>
			</div>
		</>
	);
}
