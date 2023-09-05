type Props = {
	progress: {
		totalTasks: number;
		totalCompleted: number;
		percentCompletedString: string;
		percentCompletedNum: number;
	};
	caption: string;
};

export default function ProgressBar(props: Props) {
	const {
		totalTasks,
		totalCompleted,
		percentCompletedString,
		percentCompletedNum,
	} = props.progress;
	const { caption } = props;

	const colorSelection = (progress: number) => {
		if (progress <= 0 || progress > 100) {
			return "bg-transparent";
		} else if (progress < 30) {
			return "bg-red-500 dark:bg-red-700";
		} else if (progress < 70) {
			return "bg-amber-500 dark:bg-amber-600";
		} else {
			return "bg-green-500 dark:bg-green-700";
		}
	};

	const child = {
		height: "100%",
		width: percentCompletedString,
		backgroundColor: colorSelection(percentCompletedNum),
		borderRadius: "inherit",
	};

	return (
		<div className="flex flex-col">
			<h3>{`${percentCompletedString} - ${totalCompleted}/${totalTasks} ${caption}`}</h3>
			<div className="rounded-full border border-slate-200 bg-slate-200 dark:bg-zinc-700 dark:border-none z-0 ">
				<div
					className={`h-full rounded-full p-1 z-10 ${colorSelection(
						percentCompletedNum
					)}`}
					style={child}
				></div>
			</div>
		</div>
	);
}
