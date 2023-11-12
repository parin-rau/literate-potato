import "dotenv/config";
import { connectToDatabase } from "../../../db/mongodb";
import { FetchedTicketData, Group, Project, User } from "../../../types";

const groupsColl = process.env.LOCAL_GROUPS ?? "groups";
const projectsColl = process.env.LOCAL_PROJECTS ?? "projects";
const ticketsColl = process.env.LOCAL_TICKETS ?? "tickets";
const usersColl = process.env.LOCAL_USERS ?? "users";

export async function getGroup(id: string) {
	const res: { status: number; success: boolean; group?: unknown } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection(groupsColl);
		const group = await coll.findOne({ groupId: id });
		await client.close();

		res.success = true;
		res.status = 200;
		res.group = group;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function getAllGroups() {
	const res: { status: number; success: boolean; groups?: unknown[] } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection(groupsColl);
		const groups = await coll.find().limit(50).toArray();
		await client.close();

		res.success = true;
		res.status = 200;
		res.groups = groups;

		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function getGroupsByUserId(userId: string) {
	const res: { status: number; success: boolean; groups?: unknown } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection<Group>(groupsColl);
		const groups = await coll
			.find({ userIds: userId })
			.sort({ title: 1 })
			.toArray();
		await client.close();

		res.success = true;
		res.status = 200;
		res.groups = groups;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function createGroup(newGroup: Group) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const groups = db.collection(groupsColl);
		const users = db.collection(usersColl);
		const result1 = await groups.insertOne(newGroup);
		const result2 = await users.updateOne(
			{ userId: newGroup.manager.userId },
			{
				$addToSet: {
					groupIds: newGroup.groupId,
					managedGroupIds: newGroup.groupId,
				},
			}
		);
		await client.close();

		const success = result1.acknowledged && result2.acknowledged;

		res.status = success ? 201 : 500;
		res.success = success;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function updateGroup(
	id: string,
	patchData: Record<string, unknown>
) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	if ("_id" in patchData) delete patchData["_id"];

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const groups = db.collection<Group>(groupsColl);
		const projects = db.collection<Project>(projectsColl);
		const tickets = db.collection<FetchedTicketData>(ticketsColl);

		const isDifferentGroupName = await groups
			.findOne({ groupId: id })
			.then((g) => g?.title !== patchData.title);

		if (isDifferentGroupName) {
			const updateProjects = await projects.updateMany(
				{ "group.groupId": id },
				{ $set: { "group.groupTitle": patchData.title } }
			);
			const updateTickets = await tickets.updateMany(
				{ "group.groupId": id },
				{ $set: { "group.groupTitle": patchData.title } }
			);
			res.success =
				updateProjects.acknowledged && updateTickets.acknowledged;
		}

		const result = await groups.updateOne(
			{ groupId: id },
			{ $set: { ...patchData } }
		);
		await client.close();

		res.status = 200;
		res.success = result.acknowledged;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function joinGroup(
	groupId: string,
	userId: string,
	action: "join" | "leave" | "request" | "deny"
) {
	const res: { status: number; success: boolean; message?: string } = {
		status: 500,
		success: false,
	};

	const updateCollections = async () => {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const groups = db.collection<Group>(groupsColl);
		const users = db.collection<User>(usersColl);

		switch (action) {
			case "join": {
				const result1 = await groups.updateOne(
					{ groupId },
					{
						$addToSet: { userIds: userId },
						$pull: { requestUserIds: userId },
					}
				);
				const result2 = await users.updateOne(
					{ userId },
					{
						$addToSet: { groupIds: groupId },
						$pull: { requestGroupIds: groupId },
					}
				);
				await client.close();

				return {
					success: result1.acknowledged && result2.acknowledged,
					matchedGroups: result1.matchedCount,
					matchedUsers: result2.matchedCount,
				};
			}
			case "leave": {
				const result1 = await groups.updateOne(
					{ groupId },
					{ $pull: { userIds: userId, requestUserIds: userId } }
				);
				const result2 = await users.updateOne(
					{ userId },
					{ $pull: { groupIds: groupId, requestGroupIds: groupId } }
				);
				await client.close();

				return {
					success: result1.acknowledged && result2.acknowledged,
					matchedGroups: result1.matchedCount,
					matchedUsers: result2.matchedCount,
				};
			}
			case "request": {
				const groupExists = await groups.findOne({ groupId });
				if (!groupExists) {
					res.message = "Submitted group ID does not exist.";
					return { success: true, matchedGroups: 0, matchedUsers: 0 };
				}
				if (
					groupExists.userIds.includes(userId) ||
					groupExists.requestUserIds.includes(userId)
				) {
					res.message = `Already joined group "${groupExists.title}"`;
					return { success: true, matchedGroups: 1, matchedUsers: 0 };
				}

				const result1 = await groups.updateOne(
					{ groupId },
					{ $addToSet: { requestUserIds: userId } }
				);
				const result2 = await users.updateOne(
					{ userId },
					{ $addToSet: { requestGroupIds: groupId } }
				);
				await client.close();

				return {
					success: result1.acknowledged && result2.acknowledged,
					matchedGroups: result1.matchedCount,
					matchedUsers: result2.matchedCount,
				};
			}
			case "deny": {
				const result1 = await groups.updateOne(
					{ groupId },
					{
						$pull: { requestUserIds: userId },
					}
				);
				const result2 = await users.updateOne(
					{ userId },
					{ $pull: { requestGroupIds: groupId } }
				);
				await client.close();

				return {
					success: result1.acknowledged && result2.acknowledged,
					matchedGroups: result1.matchedCount,
					matchedUsers: result2.matchedCount,
				};
			}
			default:
				return { success: false, matchedGroups: 0, matchedUsers: 0 };
		}
	};

	try {
		const result = await updateCollections();

		res.status = 200;
		res.success = result.success;

		// if (result.matchedGroups === 0)
		// 	res.message = "Submitted group ID does not exist.";

		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function deleteGroup(id: string) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const groups = db.collection<Group>(groupsColl);
		const users = db.collection<User>(usersColl);
		const result1 = await groups.deleteOne({ groupId: id });
		const result2 = await users.updateMany(
			{ groupIds: id },
			{ $pull: { groupIds: id } }
		);
		await client.close();

		const success = result1.acknowledged && result2.acknowledged;

		res.status = success ? 200 : 500;
		res.success = success;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}
