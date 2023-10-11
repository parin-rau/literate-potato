import GroupCard from "./GroupCard";
import { useGroup } from "../../hooks/useGroup";
import GroupEditor from "../Editor/GroupEditor";
import ToggleButton from "../Nav/ToggleButton";
import CollapseIcon from "../Svg/CollapseIcon";

export default function GroupContainer() {
	const {
		groups,
		isEditing,
		isHidden,
		setEditing,
		setGroups,
		collapseContainer,
		editGroup,
		deleteGroup,
	} = useGroup();

	return (
		<div className="flex flex-col mt-16 mx-2 p-2 gap-6">
			<h1 className="font-bold text-4xl">Groups Home</h1>
			<div className="flex flex-col p-2 gap-6 rounded-lg dark:bg-neutral-900">
				<GroupEditor {...{ setGroups }} />

				<ToggleButton onClick={collapseContainer}>
					<CollapseIcon isCollapsed={isHidden} />
					<h3 className="font-semibold text-2xl">Groups</h3>
				</ToggleButton>

				{!isHidden && groups && (
					<div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
						{groups.map((g) => (
							<GroupCard
								key={g.groupId}
								{...{
									data: g,
									isEditing,
									setEditing,
									editGroup,
									deleteGroup,
									setGroups,
								}}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
