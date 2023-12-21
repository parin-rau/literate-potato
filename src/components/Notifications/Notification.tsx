import { Link } from "react-router-dom";
import { Notice } from "../../types";
import timestampDisplay from "../../utility/timestampDisplay";

// type Props = {
// 	messageCode: number;
// 	resource: Notice["resource"];
// 	secondaryResource?: Notice["secondaryResource"];
// 	//secondaryTitle?: string;
// };

type CardProps = {
	url: string;
	text: string;
	timestamp: number;
	isSeen: boolean;
};

const cardStyling =
	"flex flex-col gap-2 p-4 rounded-md border-2 dark:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-900 dark:hover:border-zinc-400 border-black";

function NotificationCard({ url, text, timestamp, isSeen }: CardProps) {
	return (
		<Link to={url} className={cardStyling}>
			<h5>{timestampDisplay(timestamp)}</h5>
			{isSeen ? <i>{text}</i> : <p>{text}</p>}
		</Link>
	);
}

export default function Notification(
	// messageCode: number,
	// resource: Notice["resource"],
	// secondaryTitle?: string
	notice: Notice
) {
	const { messageCode, resource, secondaryResource, timestamp, isSeen } =
		notice;

	const codes: Record<number, React.ReactNode> = {
		// 10: (
		// 	<Link
		// 		className={cardStyling}
		// 		to={`/ticket/${resource.id}`}
		// 	>{`You were assigned a new task "${resource.title}"`}</Link>
		// ),
		// 11: (
		// 	<Link className={cardStyling} to={`/ticket/${resource.id}`}>
		// 		{secondaryResource
		// 			? `${secondaryResource.title} commented on ${resource.title}`
		// 			: `New comments on task "${resource.title}"`}
		// 	</Link>
		// ),
		// 12: (
		// 	<Link className={cardStyling} to={`/ticket/${resource.id}`}>
		// 		{secondaryResource
		// 			? `${secondaryResource.title} reacted to your comment on ${resource.title}`
		// 			: `Someone reacted to your comment on ${resource.title}`}
		// 	</Link>
		// ),
		// 50: (
		// 	<Link
		// 		className={cardStyling}
		// 		to={`/group/${resource.id}`}
		// 	>{`User requesting to join your group "${resource.title}"`}</Link>
		// ),
		// 51: (
		// 	<Link
		// 		className={cardStyling}
		// 		to={`/group/${resource.id}`}
		// 	>{`Request accepted to join "${resource.title}"`}</Link>
		// ),

		10: (
			<NotificationCard
				url={`/ticket/${resource.id}`}
				text={`You were assigned a new task "${resource.title}"`}
				timestamp={timestamp}
				isSeen={isSeen}
			/>
		),
		11: (
			<NotificationCard
				url={`/ticket/${resource.id}`}
				text={
					secondaryResource
						? `${secondaryResource.title} commented on ${resource.title}`
						: `New comments on task "${resource.title}"`
				}
				timestamp={timestamp}
				isSeen={isSeen}
			/>
		),
		12: (
			<NotificationCard
				url={`/ticket/${resource.id}`}
				text={
					secondaryResource
						? `${secondaryResource.title} reacted to your comment on ${resource.title}`
						: `Someone reacted to your comment on ${resource.title}`
				}
				timestamp={timestamp}
				isSeen={isSeen}
			/>
		),
		50: (
			<NotificationCard
				url={`/group/${resource.id}`}
				text={`User requesting to join your group "${resource.title}"`}
				timestamp={timestamp}
				isSeen={isSeen}
			/>
		),
		51: (
			<NotificationCard
				url={`/group/${resource.id}`}
				text={`Request accepted to join "${resource.title}"`}
				timestamp={timestamp}
				isSeen={isSeen}
			/>
		),
	};

	const invalidCode = (
		<div
			className={cardStyling}
		>{`Invalid message code: ${messageCode}`}</div>
	);

	return codes[messageCode] ?? invalidCode;
}
