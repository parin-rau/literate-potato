import { useState, useCallback } from "react";
import { useProtectedFetch } from "../utility/useProtectedFetch";
import { v4 as uuidv4 } from "uuid";
import { Group } from "../../types";
import { useAuth } from "../utility/useAuth";

type Props = {
	setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
	previousData?: Group;
	setEditing?: React.Dispatch<React.SetStateAction<boolean>>;
};

const init: Group = {
	title: "",
	description: "",
	manager: { name: "", userId: "" },
	groupId: "",
	userIds: [],
	requestUserIds: [],
	projectIds: [],
	ticketIds: [],
	timestamp: 0,
};

export function useGroupEditor(props: Props) {
	const { setGroups, previousData, setEditing } = props;
	const { protectedFetch } = useProtectedFetch();
	const { user } = useAuth();
	const [form, setForm] = useState<Group>(previousData ? previousData : init);
	const [expand, setExpand] = useState(previousData ? true : false);
	const [pinned, setPinned] = useState(false);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
			const { name, value } = e.target;
			setForm((prev) => ({ ...prev, [name]: value }));
		},
		[]
	);

	const handleReset = useCallback(() => {
		setForm(init);
	}, []);

	const handleExpand = useCallback(() => {
		setExpand((prev) => !prev);
	}, []);

	const handleClose = useCallback(() => {
		setExpand(false);
	}, []);

	const handlePin = useCallback(() => {
		setPinned((prev) => !prev);
	}, []);

	const handleEditCancel = useCallback(() => {
		setPinned(false);
		setExpand(false);
		setEditing && setEditing(false);
	}, [setEditing]);

	const createGroup = useCallback(async () => {
		const newGroup = {
			...form,
			manager: {
				name: user.current!.username,
				userId: user.current!.userId,
			},
			groupId: uuidv4(),
			userIds: [user.current!.userId],
			requestUserIds: [],
			projectIds: [],
			ticketIds: [],
			timestamp: Date.now(),
		};

		const res = await protectedFetch(`/api/group`, {
			method: "POST",
			body: JSON.stringify(newGroup),
		});

		if (res.ok) {
			setGroups((prev) => [...prev, newGroup]);
			setForm(init);
			!pinned && setExpand(false);
			setEditing && setEditing(false);
		}
	}, [form, user, protectedFetch, setGroups, pinned, setEditing]);

	const editGroup = useCallback(
		async (id: string) => {
			const patchData = form;
			const res = await protectedFetch(
				`/api/group/${patchData.groupId}`,
				{ method: "PATCH", body: JSON.stringify(patchData) }
			);
			if (res.ok) {
				setGroups((prev) =>
					prev.map((g) => (g.groupId === id ? { ...g, form } : g))
				);
				setEditing && setEditing(false);
			}
		},
		[form, protectedFetch, setGroups, setEditing]
	);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();

			switch (true) {
				case !previousData:
					console.log("creating group");
					return await createGroup();
				default:
					console.log("editing group");
					return await editGroup(previousData!.groupId);
			}
		},
		[createGroup, editGroup, previousData]
	);

	return {
		form,
		expand,
		handleChange,
		handleReset,
		handleExpand,
		handleSubmit,
		handleClose,
		handlePin,
		handleEditCancel,
	};
}
