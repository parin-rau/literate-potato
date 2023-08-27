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

			<div className="space-x-2">
				<button
					className="text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full max-w-min"
					type="submit"
				>
					Submit
				</button>
				<i className="text-sm">Shift + Enter</i>
			</div>
		</>
	);
}
