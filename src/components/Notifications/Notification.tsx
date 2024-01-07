import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Notice } from "../../types";
import timestampDisplay from "../../utility/timestampDisplay";
import { useProtectedFetch } from "../../hooks/utility/useProtectedFetch";

type CardProps = {
	url: string;
	text: string;
	timestamp: number;
	isSeen: boolean;
};

const cardStyling =
	"flex flex-col gap-2 p-4 rounded-md border-2 border-black dark:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 dark:hover:border-zinc-400 ";
const seenCardStyling =
	"flex flex-col gap-2 p-4 rounded-md border-2 border-slate-300 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 dark:hover:border-zinc-400 ";

function NotificationCard({ url, text, timestamp, isSeen }: CardProps) {
	return (
		<Link to={url} className={isSeen ? seenCardStyling : cardStyling}>
			<h5>{timestampDisplay(timestamp)}</h5>
			{isSeen ? (
				<i className="text-slate-600 dark:text-zinc-300">{text}</i>
			) : (
				<p>{text}</p>
			)}
		</Link>
	);
}

export default function Notification(notice: Notice) {
	const {
		messageCode,
		resource,
		secondaryResource,
		timestamp,
		isSeen,
		notificationId,
	} = notice;
	const { protectedFetch } = useProtectedFetch();

	const codes: Record<number, React.ReactNode> = {
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
						? `${secondaryResource.title} commented on "${resource.title}"`
						: `New comment on task "${resource.title}"`
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
						? `${secondaryResource.title} reacted to your comment on "${resource.title}"`
						: `Someone reacted to your comment on "${resource.title}"`
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

	useEffect(() => {
		const seenNotification = async (notificationId: string) => {
			await protectedFetch(`/api/notification/${notificationId}`, {
				method: "PATCH",
				body: JSON.stringify({ isSeen: true }),
			});

			// no state change so viewing a notification the first time won't apply seen styling to card
		};

		if (!isSeen) seenNotification(notificationId);
	}, [isSeen, notificationId, protectedFetch]);

	return codes[messageCode] ?? invalidCode;
}
