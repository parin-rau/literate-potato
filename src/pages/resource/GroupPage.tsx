import { useParams } from "react-router-dom";
import ProjectHomePage from "../home/ProjectHomePage";
import { useGroup } from "../../hooks/card/useGroup";

export default function GroupPage() {
	const { id } = useParams();
	const { groups, state } = useGroup(id);
	const { isLoading } = state;

	!isLoading && console.log(groups);

	return (
		// <div className="grid place-items-center h-screen">
		// 	<div>{`Group Page ${groupId}`}</div>
		// </div>
		!isLoading && (
			<ProjectHomePage title={groups.title ?? "Group"} groupId={id} />
		)
	);
}
