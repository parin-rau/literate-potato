import { useState } from "react";
import { Group } from "../../types";
import { LoadingSpinner } from "../Nav/Loading";
import ToggleButton from "../Nav/ToggleButton";
import CollapseIcon from "../Svg/CollapseIcon";
import GroupCard from "./GroupCard";

type Props = {
	title: string;
	groups: Group[];
	isLoading: boolean;
	cardProps: {
		isEditing: boolean;
		setEditing: React.Dispatch<React.SetStateAction<boolean>>;
		editGroup: () => void;
		deleteGroup: (_id: string) => void;
		setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
		leaveGroup: (_gId: string, _uId: string) => void;
		requestGroup: (
			_gId: string,
			_uId: string
		) => Promise<string | undefined>;
		denyRequest: (_gId: string, _uId: string) => void;
		acceptRequest: (_gId: string, _uId: string) => void;
	};
};

export default function GroupCategory(props: Props) {
	const { title, groups, isLoading, cardProps } = props;
	const [isHidden, setHidden] = useState(false);

	const collapseContainer = () => {
		setHidden((prev) => !prev);
	};

	return (
		<div className="flex flex-col gap-4">
			<ToggleButton onClick={collapseContainer}>
				<CollapseIcon isCollapsed={isHidden} />
				<h3 className="font-semibold text-2xl">{`${title} (${groups.length})`}</h3>
			</ToggleButton>
			{isLoading && <LoadingSpinner />}
			{!isLoading && !isHidden && groups && (
				<div className="grid grid-cols-1 @3xl/cards:grid-cols-2 @7xl/cards:grid-cols-3 place-items-stretch sm:container mx-auto gap-2">
					{groups.map((g) => (
						<GroupCard
							key={g.groupId}
							{...{
								data: g,
								...cardProps,
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
}
