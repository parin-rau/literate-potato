import { useCallback, useState } from "react";
import { useProtectedFetch } from "./useProtectedFetch";
import { Group } from "../types";
import { useInitialFetch } from "./useInitialFetch";

export function useGroup() {
	const { protectedFetch } = useProtectedFetch();
	//const [groups, setGroups] = useState<Group[] | null>(null)
	const [isEditing, setEditing] = useState(false);
	const [isHidden, setHidden] = useState(false);

	const {
		data: groups,
		setData: setGroups,
		// isLoading,
	} = useInitialFetch<Group[]>(`/api/group`);

	const editGroup = useCallback(() => {
		setEditing(true);
	}, []);

	const deleteGroup = useCallback(
		async (id: string) => {
			const res = await protectedFetch(`/api/group/${id}`, {
				method: "DELETE",
			});
			if (res.ok) {
				setGroups((prev) => prev.filter((g) => g.groupId !== id));
			}
		},
		[protectedFetch, setGroups]
	);

	const collapseContainer = useCallback(() => {
		setHidden((prev) => !prev);
	}, []);

	return {
		groups,
		isEditing,
		isHidden,
		setEditing,
		setGroups,
		collapseContainer,
		editGroup,
		deleteGroup,
	};
}
