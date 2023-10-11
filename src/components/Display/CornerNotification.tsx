export default function CornerNotification(props: {
	count: number;
	overlapParent?: boolean;
}) {
	return (
		<div
			className={
				"absolute grid place-items-center w-5 h-5 rounded-full bg-red-600 text-xs font-semibold text-zinc-100 " +
				(props.overlapParent ? "top-0 right-0" : "-top-1 -right-3")
			}
		>
			{props.count}
		</div>
	);
}
