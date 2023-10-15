import { useAuth } from "../../hooks/utility/useAuth";

export default function NotificationPage() {
	const { user } = useAuth();

	return (
		<div className="grid h-screen place-items-center">{`Notifications for ${user.current?.username}`}</div>
	);
}
