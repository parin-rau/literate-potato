import { useParams } from "react-router-dom";
import ProjectHomePage from "../home/ProjectHomePage";
import { useGroup } from "../../hooks/card/useGroup";
import GroupCard from "../../components/Group/GroupCard";

export default function GroupPage() {
	const { id } = useParams();
	const { groups, state, cardSetters, memberSetters } = useGroup(id);
	const { isLoading } = state;

	return (
		// <div className="grid place-items-center h-screen">
		// 	<div>{`Group Page ${groupId}`}</div>
		// </div>
		!isLoading && (
			<ProjectHomePage title={groups[0].title ?? "Group"} groupId={id}>
				<GroupCard
					data={groups[0]}
					{...{ ...state, ...cardSetters, ...memberSetters }}
				/>
			</ProjectHomePage>
		)
	);
}
