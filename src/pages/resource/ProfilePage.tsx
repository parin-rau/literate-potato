import { useLocation } from "react-router-dom";
import ProfileContainer from "../../components/Profile/ProfileContainer";

export default function ProfilePage() {
	const { pathname } = useLocation();

	return pathname === "/user" ? (
		<ProfileContainer />
	) : (
		<div className="grid h-screen place-items-center">{`Profile Page ${pathname}`}</div>
	);
}
