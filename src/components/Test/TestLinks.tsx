import { Link } from "react-router-dom";

export default function TestLinks() {
	return (
		<div className="flex flex-col gap-2">
			<Link to={"/ticket/a83581ae-1436-46c2-a6b6-cab5998dba50"}>
				Test unauthorized ticket
			</Link>
			<Link to={"/project/f15e7cef-81d5-48e3-ad21-bdff18710aef"}>
				Test unauthorized project
			</Link>
			<Link to={"/group/4428c1d0-6ec3-4782-949f-4244e7445cf4"}>
				Test unauthorized group
			</Link>

			<Link to={"/ticket/a83581ae-1436-46c2-a6b6-cab5998dba5"}>
				Test non-existent ticket
			</Link>
			<Link to={"/project/f15e7cef-81d5-48e3-ad21-bdff18710ae"}>
				Test non-existent project
			</Link>
			<Link to={"/group/4428c1d0-6ec3-4782-949f-4244e7445cf"}>
				Test non-existent group
			</Link>
		</div>
	);
}
