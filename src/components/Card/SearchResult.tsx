import { Project } from "../../types";

type Props = {
	//kind: "project" | "ticket"
	data: Project;
};

export default function SearchResult(props: Props) {
	const { data } = props;

	return (
		<div>
			<p>{data.title}</p>
			<p>{data.timestamp}</p>
			<p>{data.projectId}</p>
		</div>
	);
}
