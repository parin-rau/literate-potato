import { useParams } from "react-router-dom";
import ProjectHomePage from "../home/ProjectHomePage";

export default function GroupPage() {
	const { id: groupId = "group" } = useParams();

	return (
		// <div className="grid place-items-center h-screen">
		// 	<div>{`Group Page ${groupId}`}</div>
		// </div>
		<ProjectHomePage title={groupId} />
	);
}
