import { EditorData } from "../../types";
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
};

export default function ProjectForm(props: Props) {
	const { editor, handleChange, setEditor } = props;

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
