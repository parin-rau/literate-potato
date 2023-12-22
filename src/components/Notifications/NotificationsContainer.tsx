import Notification from "./Notification";
import { useAuth } from "../../hooks/auth/useAuth";
import { useInitialFetch } from "../../hooks/utility/useInitialFetch";
import { Notice } from "../../types";
import { LoadingSkeletonCardGrid } from "../Nav/Loading";

export default function NotificationsContainer() {
	const { user } = useAuth();

	const {
		data: notifications,
		//setData: setNotifications,
		isLoading,
	} = useInitialFetch<Notice[]>(`/api/notification/${user.current?.userId}`);

	return isLoading ? (
		<LoadingSkeletonCardGrid />
	) : (
		notifications.map((n) => <Notification {...{ ...n }} />)
	);
}
