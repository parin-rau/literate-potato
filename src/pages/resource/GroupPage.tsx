import { useParams } from "react-router-dom";
import ProjectHomePage from "../home/ProjectHomePage";
import { useSingleGroup } from "../../hooks/card/useGroup";
import GroupCard from "../../components/Group/GroupCard";

const unauthMsg =
	"Must be a member of this group to view associated projects and tasks.";

export default function GroupPage() {
	const { id } = useParams();

	const { group, state, cardSetters, memberSetters } = useSingleGroup(id!);
	const { setGroup, ...restCardSetters } = cardSetters;
	const { isLoading } = state;

	return (
		!isLoading && (
			<ProjectHomePage
				hideTitle
				title={group.title ?? "Group"}
				group={{ groupId: group.groupId, groupTitle: group.title }}
				err={{ message: unauthMsg, hideButton: true }}
			>
				<GroupCard
					{...{
						data: group,
						...state,
						setGroup,
						...restCardSetters,
						...memberSetters,
					}}
				/>
			</ProjectHomePage>
		)
	);
}
