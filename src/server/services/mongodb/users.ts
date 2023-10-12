import "dotenv/config";
//import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { User } from "../../../types";
//import { countPerElement } from "../../../utility/arrayComparisons";
import { trimObject } from "../../../utility/trimData";

const usersColl = process.env.LOCAL_USERS ?? "users";
//const projects = process.env.LOCAL_PROJECTS ?? "projects";

const trimFilter = ["password", "refreshToken"];

export async function getUserById(id: string) {
	const res: { status: number; user?: unknown } = {
		status: 500,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection(usersColl);
		const user = await coll.findOne({ userId: id });
		await client.close();

		if (user) trimObject(user, trimFilter);

		res.status = 200;
		res.user = user;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getUsersByGroup(groupId: string) {
	const res: { status: number; users?: unknown } = {
		status: 500,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection(usersColl);
		const users = await coll.find({ groupId }).toArray();
		await client.close();

		if (users) {
			users.map((u) => trimObject(u, trimFilter));
		}

		res.status = 200;
		res.users = users;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function updateUser(id: string, patchData: User) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection(usersColl);
		const result = await coll.updateOne(
			{ userId: id },
			{ $set: { ...patchData, lastModified: Date.now() } }
		);
		await client.close();

		res.status = 200;
		res.success = result.acknowledged;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function deleteUser(id: string) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection(usersColl);
		const result = await coll.deleteOne({ userId: id });
		await client.close();

		res.status = 200;
		res.success = result.acknowledged;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}
