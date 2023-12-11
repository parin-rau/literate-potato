import { useParams } from "react-router-dom";
import ProjectHomePage from "../home/ProjectHomePage";
import { useSingleGroup } from "../../hooks/card/useGroup";
import GroupCard from "../../components/Group/GroupCard";
import UnjoinedNotice from "../../components/Card/UnjoinedNotice";
import { useEffect } from "react";

const unauthMsg =
	"Must be a member of this group to view associated projects and tasks.";

export default function GroupPage() {
	const { id } = useParams();

	const { group, message, state, cardSetters, memberSetters } =
		useSingleGroup(id!);
	const { setGroup, ...restCardSetters } = cardSetters;
	const { isLoading } = state;

	const noGroupFound =
		!isLoading && message && Object.keys(group).length === 0;

	useEffect(() => console.log({ noGroupFound }), [noGroupFound]);

	return (
		!isLoading &&
		(noGroupFound ? (
			<div className="flex flex-col justify-center items-stretch">
				<div className="flex flex-col gap-4 pt-16 items-center">
					<UnjoinedNotice {...{ message, hideButton: true }} />
				</div>
			</div>
		) : (
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
		))
	);
}
