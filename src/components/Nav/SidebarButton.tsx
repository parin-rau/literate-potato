import { Link } from "react-router-dom";

type Props = {
	to: string;
	text: string;
};

export default function SidebarButton(props: Props) {
	return (
		<Link
			className="px-4 py-2 text-lg rounded-lg hover:bg-slate-200 dark:hover:bg-neutral-700"
			to={props.to}
		>
			{props.text}
		</Link>
	);
}
