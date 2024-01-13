import { useGroup } from "../../hooks/card/useGroup";
import GroupEditor from "./GroupEditor";
import GroupRequest from "./GroupRequest";
import GroupCategory from "./GroupCategory";

export default function GroupContainer() {
	const { state, derivedState, cardSetters, memberSetters } = useGroup();
	const { managedGroups, joinedGroups, requestedGroups, otherGroups } =
		derivedState;

	return (
		<div className="flex flex-col mt-20 gap-6">
			<h1 className="font-bold text-4xl">Groups Home</h1>
			<div className="@container/cards  flex flex-col p-2 gap-4 rounded-lg dark:bg-neutral-900">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					<GroupEditor
						{...{
							singleGroupSetter: false,
							setGroups: cardSetters.setGroups,
						}}
					/>
					<GroupRequest
						{...{ requestGroup: memberSetters.requestGroup }}
					/>
				</div>

				{managedGroups && managedGroups.length > 0 && (
					<GroupCategory
						{...{
							title: "Managed Groups",
							isLoading: state.isLoading,
							groups: managedGroups,
							cardProps: {
								...cardSetters,
								...memberSetters,
								...state,
							},
						}}
					/>
				)}
				{joinedGroups && joinedGroups.length > 0 && (
					<GroupCategory
						{...{
							title: "Joined Groups",
							isLoading: state.isLoading,
							groups: joinedGroups,
							cardProps: {
								...cardSetters,
								...memberSetters,
								...state,
							},
						}}
					/>
				)}
				{requestedGroups && requestedGroups.length > 0 && (
					<GroupCategory
						{...{
							title: "Requested Groups",
							isLoading: state.isLoading,
							groups: requestedGroups,
							cardProps: {
								...cardSetters,
								...memberSetters,
								...state,
							},
						}}
					/>
				)}
				{otherGroups && otherGroups.length > 0 && (
					<GroupCategory
						{...{
							title: "Available Public Groups",
							isLoading: state.isLoading,
							groups: otherGroups,
							cardProps: {
								...cardSetters,
								...memberSetters,
								...state,
							},
						}}
					/>
				)}
			</div>
		</div>
	);
}
