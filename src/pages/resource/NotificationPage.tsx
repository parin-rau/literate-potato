import NotificationsContainer from "../../components/Notifications/NotificationsContainer";

export default function NotificationPage() {
	return (
		<div className="flex flex-col gap-4 pt-20 px-2">
			<div className="sm:container sm:mx-auto flex flex-col gap-6">
				<h1 className="font-bold text-4xl">Notifications</h1>
				<NotificationsContainer />
			</div>
		</div>

		// <div className="grid h-screen place-items-center">{`Notifications for ${user.current?.username}`}</div>
	);
}
