import { useState, useEffect } from "react";
import { EditorData, Project } from "../../types";
import TagsEditor from "../Editor/TagsEditor";
import SubtaskEditor from "../Editor/SubtaskEditor";
import SelectDropdown from "../Nav/SelectDropdown";
import { optionLookup } from "../../utility/optionLookup";

type Props = {
	editor: EditorData;
	handleChange: (
		_e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => void;
	setEditor: React.Dispatch<React.SetStateAction<EditorData>>;
	// handleProjectIdChange: (
	// 	_searchId: string,
	// 	_project: { projectId: string; projectTitle: string }
	// ) => void;
};

type ProjectList = {
	label: string;
	value: string;
};

export default function ProjectForm(props: Props) {
	const { editor, handleChange, setEditor } = props;
	const [projectList, setProjectList] = useState<ProjectList[]>([]);
	//const [projectTitle, setProjectTitle] = useState<string>("");

	useEffect(() => {
		async function getProjectTitles() {
			const defaultProject = { value: "", label: "No project assigned" };
			try {
				const res = await fetch("/api/project", {
					headers: { "Content-Type": "application/json" },
				});
				if (res.ok) {
					const fetchedProjects: Project[] = await res.json();
					const fetchedProjectNames = fetchedProjects.map(
						(project) => ({
							value: project.projectId,
							label: project.title,
						})
					);
					setProjectList([defaultProject, ...fetchedProjectNames]);
				}
			} catch (e) {
				console.error(e);
			}
		}
		getProjectTitles();
	}, []);

	useEffect(() => {
		function updateProjectTitle() {
			const id = editor.projectId;
			const updatedTitle =
				projectList.find((p) => p.value === id)?.label || "";
			const updatedEditor = { ...editor, projectTitle: updatedTitle };
			setEditor(updatedEditor);
		}
		updateProjectTitle();
	}, [editor.projectId]);

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

			<input
				className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
				name="creator"
				value={editor.creator}
				onChange={handleChange}
				placeholder="Creator"
			/>
			<SelectDropdown
				name="projectId"
				value={editor.projectId}
				options={projectList}
				handleChange={handleChange}
				stylesOverride="bg-slate-100 dark:bg-zinc-800 h-8"
			/>
			{/* <input
				type="hidden"
				name="projectTitle"
				value={projectTitle}
				onChange={handleChange}
			/> */}

			<textarea
				className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
				name="description"
				rows={2}
				value={editor.description}
				onChange={handleChange}
				placeholder="Description"
			/>
			<SubtaskEditor {...{ editor, setEditor }} />
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
					className="transition duration-200 mt-2 text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-md max-w-min"
					type="submit"
				>
					Submit
				</button>
				<i className="text-sm">Shift + Enter</i>
			</div>
		</>
	);
}
