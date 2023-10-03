type Props = {
	className?: string;
	type?: "submit" | "button" | "reset";
	onClick?: () => void;
};

export default function HamburgerToggle(props: Props) {
	const { className, type, onClick } = props;

	return (
		<button
			className={
				"p-2 w-fit rounded-md hover:bg-slate-300 dark:hover:bg-neutral-700 " +
				className
			}
			type={type || "button"}
			onClick={onClick}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				strokeWidth={1.5}
				stroke="currentColor"
				className="w-6 h-6"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
				/>
			</svg>
		</button>
	);
}
