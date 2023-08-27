import { Link } from "react-router-dom";
import { Project } from "../../types";
import timestampDisplay from "../../utility/timestampDisplay";

type Props = {
	cardData: Project;
};

export default function ProjectCard(props: Props) {
	const { title, description, creator, projectId, timestamp, projectNumber } =
		props.cardData;

	return (
		<div className="m-1 border-black border-2 rounded-md bg-white dark:bg-zinc-900 dark:border-zinc-600">
			<div className="flex flex-col px-4 py-4 space-y-2 dark:border-neutral-700">
				<div className="flex flex-row flex-grow justify-between items-baseline space-x-2">
					<div className="flex flex-col sm:flex-row sm:items-baseline space-y-1 sm:space-x-4">
						<Link to={`project/${projectId}`}>
							<h1 className="font-semibold text-2xl sm:text-3xl">
								{title}
							</h1>
						</Link>
						<h2 className="text-lg sm:text-xl">
							{projectNumber && `#${projectNumber}`}
						</h2>
					</div>
				</div>
				<h2 className="text-lg">{description}</h2>
				<h3 className="text-lg">{creator}</h3>
				<span>{timestampDisplay(timestamp)}</span>
				<div>View Details Expandable</div>
			</div>
		</div>
	);
}
