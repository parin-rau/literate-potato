import { Link } from "react-router-dom";

export default function Sidebar() {
	return (
		<div>
			<Link to={"/"}>Projects</Link>
			<Link to={"/profile"}>Profile</Link>
			<Link to={"/todo"}>To-Do</Link>
		</div>
	);
}
