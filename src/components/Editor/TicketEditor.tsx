import { EditorData, ProjectEditor } from "../../types";
import ProjectForm from "../Form/ProjectForm";
import TicketForm from "../Form/TicketForm";
import { useCardEditor, Props } from "../../hooks/editor/useCardEditor";

export default function TicketEditor(props: Props) {
	const { dataKind, previousData, setEditing } = props;

	const { handlers, state } = useCardEditor(props);
	const {
		handleSubmit,
		handleExpand,
		handleReset,
		handleEditCancel,
		handleChange,
		handleKeyDown,
	} = handlers;

	const {
		init,
		editor,
		setEditor,
		isPinned,
		setPinned,
		expand,
		setExpand,
		setDeletedSubtaskIds,
	} = state;

	return (
		<div
			className={
				"mx-2 sm:mx-0 bg-transparent " +
				(!expand &&
					" hover:cursor-pointer hover:bg-slate-50 dark:hover:border-zinc-400 ") +
				(!previousData &&
					"bg-white dark:bg-zinc-900 border-black border-2 rounded-md dark:border-zinc-600")
			}
			onClick={() => !expand && setExpand(true)}
		>
			<form
				className="flex flex-col px-4 py-2 sm:py-4 space-y-2 sm:space-y-4 bg-transparent dark:border-neutral-700"
				onSubmit={handleSubmit}
				onKeyDown={handleKeyDown}
			>
				<div className="flex flex-row justify-between items-baseline">
					{previousData ? (
						<h1 className="font-semibold text-lg sm:text-lg md:text-xl">
							{init!.editorHeading}
						</h1>
					) : (
						<button
							className="font-semibold text-lg sm:text-lg md:text-xl"
							onClick={() => {
								setExpand(!expand);
							}}
							type="button"
						>
							{init!.editorHeading}
						</button>
					)}
					{expand && (
						<div className="flex flex-col lg:flex-row items-end text-xs sm:text-base ">
							<button
								className="dark:hover:bg-zinc-700 rounded-md px-2 py-1"
								type="button"
								onClick={handleReset}
							>
								Reset Form
							</button>
							{!setEditing && (
								<button
									className={
										"dark:hover:bg-zinc-700 rounded-md px-2 py-1 " +
										(isPinned && " bg-zinc-800")
									}
									type="button"
									onClick={() => setPinned(!isPinned)}
								>
									{isPinned ? "Unpin Editor" : "Pin Editor"}
								</button>
							)}
							{previousData ? (
								<button
									className="dark:hover:bg-zinc-700 rounded-md px-2 py-1"
									type="button"
									onClick={handleEditCancel}
								>
									Cancel Edit
								</button>
							) : (
								<button
									className="dark:hover:bg-zinc-700 rounded-md px-2 py-1"
									type="button"
									onClick={handleExpand}
								>
									Hide Editor
								</button>
							)}
						</div>
					)}
				</div>
				{expand && dataKind === "ticket" && (
					<TicketForm
						{...{
							editor: editor as EditorData,
							setEditor: setEditor as React.Dispatch<
								React.SetStateAction<EditorData>
							>,
							handleChange,
							setDeletedSubtaskIds,
						}}
					/>
				)}
				{expand && dataKind === "project" && (
					<ProjectForm
						{...{ editor: editor as ProjectEditor, handleChange }}
					/>
				)}
			</form>
		</div>
	);
}
