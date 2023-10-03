import { Link, useLocation } from "react-router-dom";

type Props = {
	to: string;
	text?: string;
	toggleSidebar?: (_v?: boolean) => void;
	children?: React.ReactNode;
};

export default function SidebarButton(props: Props) {
	const { to, text, toggleSidebar, children } = props;
	const { pathname } = useLocation();

	const currentPageStyles =
		to === pathname
			? "bg-slate-300 dark:bg-neutral-700 hover:bg-slate-400 hover:text-white dark:hover:bg-neutral-500"
			: "hover:bg-slate-300 dark:hover:bg-neutral-700";

	const handleClick = () => {
		toggleSidebar ? toggleSidebar(false) : null;
	};

	return (
		<Link
			className={"px-4 py-2 text-lg rounded-lg " + currentPageStyles}
			to={to}
			onClick={handleClick}
		>
			{text && text}
			{children && children}
		</Link>
	);
}
