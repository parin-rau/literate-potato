import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Project } from "../types";

type Props = {
	setCards: React.Dispatch<React.SetStateAction<Project[]>>;
};

const initEditor = {
	title: "",
	description: "",
	owner: "",
};

export default function ProjectEditor(props: Props) {
	const { setCards } = props;
	const [editor, setEditor] = useState(initEditor);
	const [expand, setExpand] = useState(false);

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) {
		const { value, name } = e.target;
		setEditor({ ...editor, [name]: value });
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLFormElement>) {
		if (e.code === "Enter" && e.shiftKey === false) {
			e.preventDefault();
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		try {
			const newCard = {
				...editor,
				timestamp: Date.now(),
				projectId: uuidv4(),
			};
			console.log(newCard);
			const res = await fetch("/api/project", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(newCard),
			});
			if (res.ok) {
				setCards((prevCards) => [newCard, ...prevCards]);
				setEditor(initEditor);
			}
		} catch (err) {
			console.error(err);
		}
	}

	function handleExpand() {
		setExpand(!expand);
	}

	function handleReset() {
		setEditor(initEditor);
	}

	return (
		<div className="sm:container sm:mx-auto border-black border-2 rounded-lg">
			<form
				className="flex flex-col px-4 py-4 space-y-2"
				onSubmit={handleSubmit}
				onKeyDown={handleKeyDown}
			>
				<div className="flex flex-row justify-between">
					<h1
						className={
							"text-3xl " + (!expand && "hover:cursor-pointer")
						}
						onClick={() => {
							if (!expand) {
								setExpand(true);
							}
						}}
					>
						Create New Project
					</h1>
					{expand && (
						<div className="flex space-x-4">
							<button type="button" onClick={handleReset}>
								Reset Form
							</button>
							<button type="button" onClick={handleExpand}>
								Hide Editor
							</button>
						</div>
					)}
				</div>
				{expand && (
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
							name="owner"
							value={editor.owner}
							onChange={handleChange}
							placeholder="Owner"
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
				)}
			</form>
		</div>
	);
}
