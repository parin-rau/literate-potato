import GroupContainer from "../../components/Group/GroupContainer";
import { usePageTitle } from "../../hooks/utility/usePageTitle";

export default function GroupHomePage() {
	usePageTitle("Groups Home");

	return (
		<div className="container mx-auto">
			<GroupContainer />
		</div>
	);
}
