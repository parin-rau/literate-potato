import { Link } from "react-router-dom";

type Props = {
	resource: string;
};

export default function UnjoinedNotice({ resource }: Props) {
	return (
		<div className="flex flex-col gap-2 items-center px-10 py-6 place-self-center rounded-xl bg-slate-100 dark:bg-zinc-900 w-fit">
			<p className="p-1">Create or join a group to view {resource}s</p>
			<Link
				className="font-semibold px-3 py-2 w-fit text-white rounded-md dark:bg-blue-700 dark:hover:bg-blue-600 bg-blue-600 hover:bg-blue-500"
				to={"/group"}
			>
				Go to groups page
			</Link>
		</div>
	);
}
