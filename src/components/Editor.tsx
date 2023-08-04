import { useState } from "react";
import SelectDropdown from "./SelectDropdown";
// import TagsEditor from "./TagsEditor";

type EditorText = {
	title: string;
	details: string;
	priority: "" | "low" | "medium" | "high";
	due: Date | null;
	tags: string[];
};

const initData: EditorText = {
	title: "",
	details: "",
	priority: "",
	due: null,
	tags: [],
};

export default function Editor() {
	const [data, setData] = useState(initData);
	const selectOptions = [
		{
			label: "Select task priority",
			value: "",
		},
		{ label: "Low", value: "low" },
		{ label: "Medium", value: "medium" },
		{ label: "High", value: "high" },
	];

	function handleChange(
		e:
			| React.ChangeEvent<HTMLInputElement>
			| React.ChangeEvent<HTMLTextAreaElement>
			| React.ChangeEvent<HTMLSelectElement>
	) {
		const { value, name } = e.target;
		setData({ ...data, [name]: value });
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (data.priority === "") {
			console.log("select a priority");
		} else {
			try {
				const res = await fetch("/api/ticket", {
					method: "POST",
					headers: { "Content-Type": "application" },
					body: JSON.stringify(data),
				}).then((resp) => resp.json());
				console.log(res);
				if (res.ok) {
					setData(initData);
				}
			} catch (err) {
				console.error(err);
			}
		}
	}

	return (
		<div className="sm:container sm:mx-auto border-black border-2 rounded-lg">
			<form className="flex flex-col px-4 space-y-2">
				<h1 className="text-3xl">Create New Task</h1>
				<input
					className="text-2xl"
					name="title"
					value={data.title}
					onChange={(e) => handleChange(e)}
					placeholder="Title"
					autoFocus
					required
				/>
				{/* <TagsEditor /> */}
				<textarea
					className="text-md"
					name="details"
					rows={4}
					value={data.details}
					onChange={(e) => handleChange(e)}
					placeholder="Details"
					required
				/>
				<SelectDropdown
					name="priority"
					options={selectOptions}
					handleChange={handleChange}
				/>
				<input
					className="text-lg max-w-xs"
					name="due"
					type="date"
					onChange={(e) => handleChange(e)}
				/>
				<button
					className="text-md text-white font-bold bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded-full max-w-min"
					onClick={(e) => handleSubmit(e)}
					type="submit"
				>
					Submit
				</button>
			</form>
		</div>
	);
}
