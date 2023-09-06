import { ProjectEditor } from "../../types";

type Props = {
	editor: ProjectEditor;
	handleChange: (
		_e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
};

export default function ProjectForm(props: Props) {
	const { editor, handleChange } = props;

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
			<textarea
				className="text-sm sm:text-base rounded-md border px-2 shadow-sm bg-inherit border-inherit"
				name="description"
				rows={2}
				value={editor.description}
				onChange={handleChange}
				placeholder="Description"
			/>
			<div className="flex flex-row gap-2 items-center">
				<h4>Color:</h4>
				<input
					className=""
					name="color"
					type="color"
					value={editor.color}
					onChange={handleChange}
					placeholder="Color"
				/>
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
