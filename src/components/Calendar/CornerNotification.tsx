export default function CornerNotification(props: { count: number }) {
	return (
		<div className="absolute grid place-items-center -top-1 -right-3 w-5 h-5 rounded-full bg-red-600 text-xs font-semibold text-zinc-100">
			{props.count}
		</div>
	);
}
