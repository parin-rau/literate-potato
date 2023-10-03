import { useLocation } from "react-router-dom";

export default function GroupPage() {
	const url = useLocation().pathname;
	const groupId = url.slice(7);

	return (
		<div className="grid place-items-center h-screen">
			<div>{`Group Page ${groupId}`}</div>
		</div>
	);
}
