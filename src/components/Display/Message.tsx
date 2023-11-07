type Props = {
	header?: string;
	msg: string;
};

export default function Message(props: Props) {
	const { msg, header } = props;

	return (
		<div className="bg-amber-40 bg-emerald-500 text-emerald-900 p-4 rounded-xl">
			{header && <h2 className="font-bold text-xl ">{header}</h2>}
			<p className="font-semibold text-lg">{msg}</p>
		</div>
	);
}
