import { Link } from "react-router-dom";
import { Notice } from "../../types";

export const Notification = (
	messageCode: number,
	resource: Notice["resource"],
	secondaryTitle?: string
) => {
	const cardStyling =
		"p-4 rounded-md border-2 dark:border-zinc-600 bg-white dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-900 dark:hover:border-zinc-400 border-black";

	const codes: Record<number, React.ReactNode> = {
		10: (
			<Link
				className={cardStyling}
				to={`/ticket/${resource.id}`}
			>{`You were assigned a new task "${resource.title}"`}</Link>
		),
		11: (
			<Link className={cardStyling} to={`/ticket/${resource.id}`}>
				{secondaryTitle
					? `${secondaryTitle} commented on ${resource.title}`
					: `New comments on task "${resource.title}"`}
			</Link>
		),
		12: (
			<Link className={cardStyling} to={`/ticket/${resource.id}`}>
				{secondaryTitle
					? `${secondaryTitle} reacted to your comment on ${resource.title}`
					: `Someone reacted to your comment on ${resource.title}`}
			</Link>
		),
		50: (
			<Link
				className={cardStyling}
				to={`/group/${resource.id}`}
			>{`User requesting to join your group "${resource.title}"`}</Link>
		),
		51: (
			<Link
				className={cardStyling}
				to={`/group/${resource.id}`}
			>{`Request accepted to join "${resource.title}"`}</Link>
		),
	};

	return codes[messageCode];
};
