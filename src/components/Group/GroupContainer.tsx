//import GroupCard from "./GroupCard";
import { useGroup } from "../../hooks/card/useGroup";
import GroupEditor from "./GroupEditor";
//import ToggleButton from "../Nav/ToggleButton";
//import CollapseIcon from "../Svg/CollapseIcon";
import GroupRequest from "./GroupRequest";
//import { LoadingSpinner } from "../Nav/Loading";
import GroupCategory from "./GroupCategory";

export default function GroupContainer() {
	const { state, derivedState, cardSetters, memberSetters } = useGroup();
	const { managedGroups, joinedGroups, requestedGroups } = derivedState;

	return (
		<div className="@container/cards flex flex-col mt-16 mx-auto p-2 gap-6">
			<h1 className="font-bold text-4xl">Groups Home</h1>
			<div className="flex flex-col p-2 gap-4 rounded-lg dark:bg-neutral-900">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
					<GroupEditor {...{ setGroups: cardSetters.setGroups }} />
					<GroupRequest
						{...{ requestGroup: memberSetters.requestGroup }}
					/>
				</div>

				{managedGroups && (
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
				{joinedGroups && (
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
				{requestedGroups && (
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

				{/* <div className="flex flex-col gap-4">
					<ToggleButton onClick={collapseContainer}>
						<CollapseIcon isCollapsed={isHidden} />
						<h3 className="font-semibold text-2xl">{`Joined Groups ($)`}</h3>
					</ToggleButton>
					{isLoading && <LoadingSpinner />}
					{!isLoading && !isHidden && groups && managedGroups && (
						<div className="grid grid-cols-1 @3xl/cards:grid-cols-2 @7xl/cards:grid-cols-3 place-items-stretch sm:container mx-auto gap-2">
							{managedGroups.map((g) => (
								<GroupCard
									key={g.groupId}
									{...{
										data: g,
										isEditing,
										setEditing,
										editGroup,
										deleteGroup,
										setGroups,
										leaveGroup,
										requestGroup,
										denyRequest,
										acceptRequest,
									}}
								/>
							))}
						</div>
					)}
				</div> */}
			</div>
		</div>
	);
}
