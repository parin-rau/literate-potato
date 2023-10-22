import { useParams } from "react-router-dom";
import ProjectHomePage from "../home/ProjectHomePage";
import { useSingleGroup } from "../../hooks/card/useGroup";
import GroupCard from "../../components/Group/GroupCard";

export default function GroupPage() {
	const { id } = useParams();

	const { group, state, cardSetters, memberSetters } = useSingleGroup(id!);
	const { setGroup, ...restCardSetters } = cardSetters;
	const { isLoading } = state;

	return (
		// <div className="grid place-items-center h-screen">
		// 	<div>{`Group Page ${groupId}`}</div>
		// </div>
		!isLoading && (
			<ProjectHomePage title={group.title ?? "Group"} groupId={id}>
				<GroupCard
					data={group}
					{...{
						...state,
						setGroup,
						...restCardSetters,
						...memberSetters,
					}}
				/>
			</ProjectHomePage>
		)
	);
}
