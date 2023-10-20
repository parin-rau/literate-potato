import { useCallback, useMemo, useState } from "react";
import { useProtectedFetch } from "../utility/useProtectedFetch";
import { Group } from "../../types";
import { useInitialFetch } from "../utility/useInitialFetch";
import { useAuth } from "../auth/useAuth";

export function useGroup(propGroupId?: string) {
	const { user } = useAuth();
	const { protectedFetch } = useProtectedFetch();
	const [isEditing, setEditing] = useState(false);
	const url = propGroupId
		? `/api/project/group/${propGroupId}`
		: `/api/group`;
	const {
		data: groups,
		setData: setGroups,
		isLoading,
	} = useInitialFetch<Group[]>(url);

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

	const requestGroup = useCallback(
		async (groupId: string, userId: string) => {
			const url = `/api/group/${groupId}/user/${userId}/request`;
			const res = await protectedFetch(url, { method: "PATCH" });

			if (res.ok) {
				const message: string = await res.json();

				!message &&
					setGroups((prev) =>
						prev.map((g) =>
							g.groupId === groupId
								? {
										...g,
										requestUserIds: [
											...g.requestUserIds,
											userId,
										],
								  }
								: g
						)
					);

				if (message) return message;
			}
		},
		[protectedFetch, setGroups]
	);

	const acceptRequest = useCallback(
		async (groupId: string, userId: string) => {
			const url = `/api/group/${groupId}/user/${userId}/join`;
			const res = await protectedFetch(url, { method: "PATCH" });

			if (res.ok) {
				setGroups((prev) =>
					prev.map((g) =>
						g.groupId === groupId
							? {
									...g,
									requestUserIds: g.requestUserIds.filter(
										(i) => i !== userId
									),
									userIds: [...g.userIds, userId],
							  }
							: g
					)
				);
			}
		},
		[protectedFetch, setGroups]
	);

	const denyRequest = useCallback(
		async (groupId: string, userId: string) => {
			const url = `/api/group/${groupId}/user/${userId}/deny`;
			const res = await protectedFetch(url, { method: "PATCH" });
			if (res.ok) {
				setGroups((prev) =>
					prev.map((g) =>
						g.groupId === groupId
							? {
									...g,
									requestUserIds: g.requestUserIds.filter(
										(i) => i !== userId
									),
							  }
							: g
					)
				);
			}
		},
		[protectedFetch, setGroups]
	);

	const leaveGroup = useCallback(
		async (groupId: string, userId: string) => {
			const url = `/api/group/${groupId}/user/${userId}/leave`;
			const res = await protectedFetch(url, { method: "PATCH" });
			if (res.ok) {
				setGroups((prev) => prev.filter((g) => g.groupId !== groupId));
			}
		},
		[protectedFetch, setGroups]
	);

	const managedGroups = useMemo(() => {
		if (groups)
			return groups.filter(
				(g) => g.manager.userId === user.current!.userId
			);
	}, [groups, user]);

	const joinedGroups = useMemo(() => {
		if (groups)
			return groups.filter(
				(g) =>
					g.userIds.includes(user.current!.userId) &&
					g.manager.userId !== user.current!.userId
			);
	}, [groups, user]);

	const requestedGroups = useMemo(() => {
		if (groups)
			return groups.filter((g) =>
				g.requestUserIds.includes(user.current!.userId)
			);
	}, [groups, user]);

	// FOR DEBUGGING
	const otherGroups = useMemo(() => {
		const isUnique = (gr: Group[] | undefined, id: string) => {
			if (!gr) return true;
			return !gr.map((g) => g.groupId).includes(id);
		};

		if (groups)
			return groups.filter(
				(g) =>
					isUnique(managedGroups, g.groupId) &&
					isUnique(joinedGroups, g.groupId) &&
					isUnique(requestedGroups, g.groupId)
			);
	}, [groups, joinedGroups, managedGroups, requestedGroups]);

	return {
		groups,
		state: {
			isLoading,
			isEditing,
		},
		derivedState: {
			managedGroups,
			joinedGroups,
			requestedGroups,
			otherGroups,
		},
		cardSetters: {
			setEditing,
			setGroups,
			editGroup,
		},
		memberSetters: {
			deleteGroup,
			leaveGroup,
			requestGroup,
			denyRequest,
			acceptRequest,
		},
	};
}
