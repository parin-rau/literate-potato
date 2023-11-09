type Props = {
	children?: React.ReactNode;
	className?: string;
	type?: "submit" | "reset" | "button";
	onClick?:
		| (() => void)
		| ((_e: React.MouseEvent<HTMLButtonElement>) => void);
};

export default function ToggleButton(props: Props) {
	const { type, children, onClick, className } = props;

	return (
		<button
			className={
				"relative p-2 w-fit rounded-md flex flex-row gap-2 items-center hover:bg-slate-300 dark:hover:bg-neutral-700 " +
				className
			}
			type={type ?? "button"}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
