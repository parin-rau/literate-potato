import { EditorData } from "../../types";

type Props = {
	editor: EditorData;
	handleChange: (
		_e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
};

export default function ProjectForm(props: Props) {
	const { editor, handleChange } = props;

	return (
		<>
			<input
				className="text-2xl"
				name="title"
				value={editor.title}
				onChange={handleChange}
				placeholder="Title"
				autoFocus
				required
			/>
			<textarea
				className="text-md"
				name="description"
				rows={2}
				value={editor.description}
				onChange={handleChange}
				placeholder="Description"
			/>
			<input
				className="text-md"
				name="creator"
				value={editor.creator}
				onChange={handleChange}
				placeholder="Creator"
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
