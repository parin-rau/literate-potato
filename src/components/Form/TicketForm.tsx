import { useState, useEffect, useCallback } from "react";
import { EditorData, Group, Project, User } from "../../types";
import TagsEditor from "../Editor/TagsEditor";
import SubtaskEditor from "../Editor/SubtaskEditor";
import SelectDropdown from "../Nav/SelectDropdown";
import { optionLookup } from "../../utility/optionLookup";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";

type Props = {
	editor: EditorData;
	handleChange: (
		_e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => void;
	setEditor: React.Dispatch<React.SetStateAction<EditorData>>;
	setDeletedSubtaskIds: React.Dispatch<React.SetStateAction<string[]>>;
};

type DropdownItem = {
	label: string;
	value: string;
};

export default function TicketForm(props: Props) {
	const { editor, handleChange, setEditor, setDeletedSubtaskIds } = props;
	const [groupList, setGroupList] = useState<DropdownItem[]>([]);
	const [projectList, setProjectList] = useState<DropdownItem[]>([
		{ value: "", label: "Select a group first" },
	]);
	const [userList, setUserList] = useState<DropdownItem[]>([
		{ value: "", label: "Select a group first" },
	]);
	const [error, setError] = useState("");
	const { projectId } = editor.project;
	const { protectedFetch } = useProtectedFetch();

	useEffect(() => {
		const abortController = new AbortController();

		async function getDropdownData() {
			const defaultGroup = { value: "", label: "No group assigned" };
			try {
				const res1 = await protectedFetch("/api/group", {
					signal: abortController.signal,
				});
				if (res1.ok) {
					const fetchedGroups: Group[] = await res1.json();
					const fetchedGroupNames = fetchedGroups.map((g) => ({
						value: g.groupId,
						label: g.title,
					}));
					setGroupList([defaultGroup, ...fetchedGroupNames]);

					const res2 = await protectedFetch(
						`/api/project/group/${editor.group.groupId}`,
						{
							signal: abortController.signal,
						}
					);
					if (res2.ok) {
						const defaultProject = {
							value: "",
							label: "No project assigned",
						};

						const fetchedProjects: Project[] = await res2.json();
						const fetchedProjectNames = fetchedProjects.map(
							(project) => ({
								value: project.projectId,
								label: project.title,
							})
						);

						fetchedProjects.length
							? setError("")
							: setError(
									"No projects available to assign to task. Create a project in this group first before creating a task."
							  );

						setProjectList([
							defaultProject,
							...fetchedProjectNames,
						]);

						const defaultUser = {
							value: "",
							label: "No user assigned",
						};

						const res3 = await protectedFetch(
							`/api/user/group/${editor.group.groupId}`,
							{
								signal: abortController.signal,
							}
						);
						if (res3.ok) {
							const fetchedGroups: User[] = await res3.json();
							const fetchedGroupNames = fetchedGroups.map(
								(u) => ({
									value: u.userId,
									label: u.username,
								})
							);
							setUserList([defaultUser, ...fetchedGroupNames]);
						}
					}
				}
			} catch (e) {
				console.error(e);
			}
		}

		getDropdownData();

		return () => {
			abortController.abort();
		};
	}, [editor.group.groupId, protectedFetch]);

	const updateProjectTitle = useCallback(() => {
		const updatedTitle =
			projectList.find((p) => p.value === projectId)?.label || "";
		setEditor((prev) => ({
			...prev,
			project: { ...prev.project, projectTitle: updatedTitle },
		}));
	}, [projectId, projectList, setEditor]);

	useEffect(() => {
		updateProjectTitle();
	}, [updateProjectTitle]);

	return (
		<>
			<input
				className="text-lg sm:text-xl border rounded-md px-2 shadow-sm bg-inherit border-inherit"
				name="title"
				value={editor.title}
				onChange={handleChange}
				placeholder="Title"
				required
			/>

			{/* <input
				className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
				name="creator"
				value={editor.creator.userId}
				onChange={handleChange}
				placeholder="Creator"
			/> */}

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

			<div className="flex flex-col sm:border sm:rounded-md shadow-none sm:shadow-sm p-2 space-y-2 border-inherit">
				<h4 className="px-1">Project</h4>
				<SelectDropdown
					name="projectId"
					value={editor.project.projectId}
					options={projectList}
					handleChange={handleChange}
					stylesOverride="bg-slate-100 dark:bg-zinc-800 h-8"
					required
				/>
				{error && <span className="text-red-500">{error}</span>}
			</div>

			<div className="flex flex-col sm:border sm:rounded-md shadow-none sm:shadow-sm p-2 space-y-2 border-inherit">
				<h4 className="px-1">Assignee</h4>
				<SelectDropdown
					name="userId"
					value={editor.assignee.userId}
					options={userList}
					handleChange={handleChange}
					stylesOverride="bg-slate-100 dark:bg-zinc-800 h-8"
				/>
			</div>

			<textarea
				className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
				name="description"
				rows={2}
				value={editor.description}
				onChange={handleChange}
				placeholder="Description"
			/>

			<div className="flex flex-col sm:border sm:rounded-md shadow-none sm:shadow-sm p-2 space-y-2 border-inherit">
				<h2>External Resource</h2>
				<input
					className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
					name="externalResourceURL"
					value={editor.externalResourceURL}
					onChange={handleChange}
					placeholder="Resource URL"
				/>
				<input
					className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
					name="externalResourceText"
					value={editor.externalResourceText}
					onChange={handleChange}
					placeholder="Link display text"
				/>
			</div>

			<SubtaskEditor {...{ editor, setEditor, setDeletedSubtaskIds }} />
			<TagsEditor {...{ editor, setEditor }} />
			<div className="grid grid-cols-2 place-items-stretch gap-2 sm:gap-4 rounded-md shadow-none border-inherit">
				<div className="flex flex-col sm:border sm:rounded-md shadow-none sm:shadow-sm p-2 space-y-2 border-inherit">
					<h4 className="px-1">Due Date</h4>
					<input
						className="text-base px-1 rounded-md bg-slate-100 dark:bg-zinc-800 h-8  "
						name="due"
						type="date"
						value={editor.due}
						onChange={handleChange}
					/>
				</div>
				<div className="flex flex-col sm:border sm:rounded-md shadow-none sm:shadow-sm p-2 space-y-2 border-inherit">
					<h4 className="px-1">Priority</h4>
					<SelectDropdown
						name="priority"
						value={editor.priority}
						options={optionLookup.priority}
						handleChange={handleChange}
						stylesOverride="bg-slate-100 dark:bg-zinc-800 h-8"
					/>
				</div>
			</div>
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
