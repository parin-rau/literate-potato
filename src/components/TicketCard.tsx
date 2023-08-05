type Props = {
	title: string;
	details: string;
	priority: string;
	due: string;
};

export default function TicketCard(props: Props) {
	return (
		<div>
			<h1>{props.title}</h1>
		</div>
	);
}
