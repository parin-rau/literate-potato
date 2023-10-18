import { useCallback, useMemo, useState } from "react";
import { useProtectedFetch } from "../utility/useProtectedFetch";
import { Group } from "../../types";
import { useInitialFetch } from "../utility/useInitialFetch";
import { useAuth } from "../utility/useAuth";

export function useGroup() {
	const { user } = useAuth();
	const { protectedFetch } = useProtectedFetch();
	const [isEditing, setEditing] = useState(false);
	const [isHidden, setHidden] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const {
		data: groups,
		setData: setGroups,
		isLoading,
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

	const requestGroup = useCallback(
		async (groupId: string, userId: string) => {
			setError(null);

			const url = `/api/group/${groupId}/user/${userId}/request`;
			const res = await protectedFetch(url, { method: "PATCH" });

			if (res.ok) {
				const message: string = await res.json();

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
			return groups.filter((g) =>
				g.userIds.includes(user.current!.userId)
			);
	}, [groups, user]);

	const requestedGroups = useMemo(() => {
		if (groups)
			return groups.filter((g) =>
				g.requestUserIds.includes(user.current!.userId)
			);
	}, [groups, user]);

	return {
		state: { groups, isLoading, isEditing, isHidden, error },
		derivedState: { managedGroups, joinedGroups, requestedGroups },
		cardSetters: {
			setEditing,
			setGroups,
			collapseContainer,
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
