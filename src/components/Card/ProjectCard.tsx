import { Link } from "react-router-dom";
import { Project } from "../../types";
import timestampDisplay from "../../utility/timestampDisplay";

type Props = {
	cardData: Project;
};

export default function ProjectCard(props: Props) {
	const { title, description, owner, projectId, timestamp } = props.cardData;

	return (
		<div className="flex flex-col mx-1 my-1 px-4 py-4 space-y-2 border-black border-2 rounded-lg bg-white">
			<Link to={`project/${projectId}`}>
				<h1 className="text-2xl">{title}</h1>
			</Link>
			<h2 className="text-lg">{description}</h2>
			<h3 className="text-lg">{owner}</h3>
			<span>{timestampDisplay(timestamp)}</span>
			<div>View Details Expandable</div>
		</div>
	);
}
