import ProfileContainer from "../../components/Profile/ProfileContainer";
import { Link } from "react-router-dom";

type Props = {
	isCurrentUser?: boolean;
};

export default function ProfilePage({ isCurrentUser }: Props) {
	return (
		<div>
			<ProfileContainer />
			{isCurrentUser && <Link to={"/settings"}>Edit Profile</Link>}
		</div>
	);
}
