import "dotenv/config";
import { connectToDatabase } from "../../../db/mongodb";
import { Group, User } from "../../../types";

const groupsColl = process.env.LOCAL_GROUPS ?? "groups";
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
			{ $addToSet: { groupIds: newGroup.groupId } }
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
		const coll = db.collection(groupsColl);
		const result = await coll.updateOne(
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
