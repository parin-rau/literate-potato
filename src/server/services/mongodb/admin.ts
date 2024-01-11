import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { User, UserToken } from "../../../types";

const ticketsColl = process.env.LOCAL_TICKETS ?? "tickets";
const projectsColl = process.env.LOCAL_PROJECTS ?? "projects";
const groupsColl = process.env.LOCAL_GROUPS ?? "groups";
const commentsColl = process.env.LOCAL_COMMENTS ?? "comments";
const usersColl = process.env.LOCAL_USERS ?? "users";

class Result<T> {
	status: number;
	success: boolean;
	data?: T;

	constructor(input?: { status?: number; success?: boolean }) {
		this.status = input?.status ?? 500;
		this.success = input?.success ?? false;
	}
}

const validResources = ["ticket", "project", "group", "user"];

const checkAdmin = async (user: UserToken, activeDB: mongoDB.Db) => {
	const usersDBColl = activeDB.collection<User>(usersColl);
	const isAdmin = await usersDBColl
		.findOne({ userId: user.userId })
		.then((u) => u?.roles.includes(0));

	if (!user.roles.includes(0) || !isAdmin) return false;
	else return true;
};

type GetCount = {
	db: mongoDB.Db;
	coll: string;
	field?: string;
	value?: string;
};
const getCount = async <T extends mongoDB.BSON.Document>({
	db,
	coll,
	field,
	value,
}: GetCount) => {
	const collection = db.collection<T>(coll);
	const query = field && value ? { [field]: value } : {};
	const count = await collection.countDocuments(query);
	return count;
};

type AccessDB = { db: mongoDB.Db; resourceType: string; resourceId?: string };
const getFromDB = async ({ db, resourceType, resourceId }: AccessDB) => {
	const isSingleDocRequest = !!resourceId;
	const coll = `${resourceType}s`;
	const collection = db.collection(coll);
	const query = isSingleDocRequest
		? { [`${resourceType}Id`]: resourceId }
		: {};

	const documents = isSingleDocRequest
		? await collection.findOne(query)
		: await collection.find(query).toArray();
	return documents;
};

const deleteFromDB = async ({
	db,
	resourceType,
	resourceId,
}: Required<AccessDB>) => {
	const coll = `${resourceType}s`;
	const collection = db.collection(coll);
	const query = { [`${resourceType}Id`]: resourceId };
	const result = await collection.deleteOne(query);
	return { isDeleted: result.deletedCount > 0 };
};

export async function getStats(user: UserToken) {
	const res = new Result();

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);

		const isAdmin = await checkAdmin(user, db);
		if (!isAdmin) {
			await client.close();
			res.status = 403;
			return res;
		}

		const count = [
			{
				label: "tickets",
				count: await getCount({ db, coll: ticketsColl }),
			},
			{
				label: "projects",
				count: await getCount({ db, coll: projectsColl }),
			},
			{
				label: "groups",
				count: await getCount({ db, coll: groupsColl }),
			},
			{ label: "users", count: await getCount({ db, coll: usersColl }) },
			{
				label: "comments",
				count: await getCount({ db, coll: commentsColl }),
			},
		];
		await client.close();
		const stats = { count };

		res.status = 200;
		res.data = stats;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function getResource(
	user: UserToken,
	resourceType: string,
	resourceId?: string
) {
	const res = new Result();

	if (!validResources.includes(resourceType)) {
		res.status = 400;
		return res;
	}

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);

		const isAdmin = await checkAdmin(user, db);
		if (!isAdmin) {
			await client.close();
			res.status = 403;
			return res;
		}

		const data = resourceId
			? await getFromDB({ db, resourceType, resourceId })
			: await getFromDB({ db, resourceType });

		await client.close();

		res.status = 200;
		res.data = data;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function deleteResource(
	user: UserToken,
	resourceType: string,
	resourceId: string
) {
	const res = new Result<boolean>();

	if (!validResources.includes(resourceType)) {
		res.status = 400;
		return res;
	}

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);

		const isAdmin = await checkAdmin(user, db);
		if (!isAdmin) {
			await client.close();
			res.status = 403;
			return res;
		}

		const { isDeleted } = await deleteFromDB({
			db,
			resourceType,
			resourceId,
		});

		await client.close();

		res.status = 200;
		res.data = isDeleted;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}
