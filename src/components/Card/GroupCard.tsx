import { Link } from "react-router-dom";
import { Group } from "../../types";
import MenuDropdown from "../Nav/MenuDropdown";
import GroupEditor from "../Editor/GroupEditor";
import CountLabel from "../Display/CountLabel";

type Props = {
	data: Group;
	deleteGroup: (_id: string) => void;
	editGroup: (_id: string) => void;
	setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
	isEditing: boolean;
	setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function GroupCard(props: Props) {
	const { data, isEditing, setEditing, editGroup, deleteGroup, setGroups } =
		props;
	const moreOptions = [
		{ name: "Delete", fn: deleteGroup },
		{ name: "Edit", fn: editGroup },
	];

	return (
		<div className="flex flex-col gap-2 p-4 rounded-lg border-2 dark:border-neutral-700 dark:bg-zinc-900">
			{!isEditing ? (
				<>
					<div className="flex flex-row justify-between">
						<h2 className="font-semibold text-2xl">{data.title}</h2>
						<MenuDropdown
							options={moreOptions}
							cardId={data.groupId}
						/>
					</div>
					<p>Group ID: {data.groupId}</p>
					<p>
						{"Manager: "}
						<Link
							className="underline"
							to={`/user/${data.manager.userId}`}
						>
							{data.manager.name}
						</Link>
					</p>
					<CountLabel count={data.userIds.length} text="Member" />
					<CountLabel
						count={data.projectIds.length}
						text="Project"
						showZero
					/>
					<CountLabel
						count={data.ticketIds.length}
						text="Task"
						showZero
					/>
				</>
			) : (
				<GroupEditor
					{...{ setEditing, setGroups, previousData: data }}
				/>
			)}
		</div>
	);
}
