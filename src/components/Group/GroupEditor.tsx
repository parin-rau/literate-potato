import { useGroupEditor } from "../../hooks/editor/useGroupEditor";
import { Group } from "../../types";

type Props = {
	setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
	previousData?: Group;
	setEditing?: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GroupEditor(props: Props) {
	const { previousData } = props;
	const {
		form,
		expand,
		handleChange,
		handleReset,
		handleExpand,
		handleSubmit,
		handleClose,
		handlePin,
		handleEditCancel,
	} = useGroupEditor(props);

	return (
		<div
			className={
				"flex flex-col gap-2  rounded-lg " +
				(previousData
					? "  "
					: " border-2 p-4 dark:border-neutral-700 dark:bg-zinc-900 ") +
				(expand ? " " : " cursor-pointer")
			}
			onClick={expand ? () => {} : handleExpand}
		>
			<div className="flex flex-row gap-2 justify-between">
				<h1
					className="z-10 font-semibold text-2xl cursor-pointer"
					onClick={handleExpand}
				>
					{previousData ? "Edit Group Details" : "Create Group"}
				</h1>
				{!previousData && expand && (
					<div className="flex flex-row gap-2">
						<button
							className="hover:bg-neutral-700 px-2 py-1 rounded-md"
							type="button"
							onClick={handleReset}
						>
							Reset
						</button>
						<button
							className="hover:bg-neutral-700 px-2 py-1 rounded-md"
							type="button"
							onClick={handlePin}
						>
							Pin
						</button>
						<button
							className="hover:bg-neutral-700 px-2 py-1 rounded-md"
							type="button"
							onClick={handleClose}
						>
							Close
						</button>
					</div>
				)}
			</div>
			{expand && (
				<form className="flex flex-col gap-2" onSubmit={handleSubmit}>
					<input
						className="rounded px-2 py-1 bg-transparent border border-neutral-700"
						name="title"
						onChange={handleChange}
						value={form.title}
						placeholder="Group Title"
						required
					/>
					<textarea
						className="rounded px-2 py-1 bg-transparent border border-neutral-700"
						name="description"
						onChange={handleChange}
						value={form.description}
						placeholder="Description"
					/>
					<div className="self-end flex flex-row gap-2">
						{previousData && (
							<button
								className="font-semibold px-3 py-1 w-fit text-white rounded-md bg-blue-700 hover:bg-blue-600"
								type="button"
								onClick={handleEditCancel}
							>
								Cancel
							</button>
						)}
						<button
							className="font-semibold px-3 py-1 w-fit text-white rounded-md bg-blue-700 hover:bg-blue-600"
							type="submit"
						>
							Submit
						</button>
					</div>
				</form>
			)}
		</div>
	);
}
