import { Link } from "react-router-dom";
import { Project } from "../types";

type Props = {
	cardData: Project;
};

export default function ProjectCard(props: Props) {
	const { title, description, owner, projectId } = props.cardData;

	return (
		<div className="py-10">
			<h1 className="text-2xl">{title}</h1>
			<h2 className="text-lg">{description}</h2>
			<h3 className="text-lg">{owner}</h3>
			<div>View Details Expandable</div>
			<Link to={`project/${projectId}`}>View Tasks</Link>
		</div>
	);
}
