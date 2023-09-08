type Props = {
	msg: string;
};

export default function ErrorMsg(props: Props) {
	const { msg } = props;

	return (
		<div className="bg-amber-40 bg-amber-500 text-amber-900 p-4 rounded-xl">
			<h2 className="font-bold text-xl ">Error</h2>
			<p className="font-semibold text-lg">{msg}</p>
		</div>
	);
}
