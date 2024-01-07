import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { UserToken, Notice, NoticeEntry } from "../../../types";
import { v4 as uuidv4 } from "uuid";

const notificationsColl = process.env.LOCAL_NOTIFICATIONS ?? "notifications";

export const setStandardNoticeProps = () => ({
	notificationId: uuidv4(),
	isSeen: false,
	timestamp: Date.now(),
});

const getDatabase = async () => {
	const client = await connectToDatabase();
	const db = client.db(process.env.VITE_LOCAL_DB);
	return { client, db };
};

export async function getNotificationsByUser(
	targetId: string,
	user: UserToken,
	filter?: string
) {
	const res: { status: number; data: number | Notice[] } = {
		status: 500,
		data: filter === "count" ? 0 : [],
	};

	if (user.userId !== targetId) return res;

	const queryNotificationsDb = async (
		coll: mongoDB.Collection<Notice>,
		filter?: string
	) => {
		switch (filter) {
			case "count": {
				return await coll.countDocuments({
					userId: targetId,
					isSeen: false,
				});
			}
			default: {
				return await coll.find({ userId: targetId }).toArray();
			}
		}
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const notifications = db.collection<Notice>(notificationsColl);
		const result = await queryNotificationsDb(notifications, filter);

		await client.close();

		res.status = 200;
		res.data = result;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function createNotification(
	noticeEntry: NoticeEntry,
	currentUser: UserToken,
	getUsersToNotify:
		| ((
				_db: mongoDB.Db,
				_resourceId: string,
				_omitUserIds: string[]
		  ) => Promise<string[]>)
		| string[],
	activeConnection?: { client: mongoDB.MongoClient; db: mongoDB.Db }
) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		// Service called from another service (i.e. active connection) vs. called from notifications controller
		const { client, db } = activeConnection ?? (await getDatabase());
		const notifications = db.collection<Notice>(notificationsColl);

		const usersToNotify: string[] =
			typeof getUsersToNotify !== "function"
				? getUsersToNotify
				: await getUsersToNotify(db, noticeEntry.resource.id, [
						currentUser.userId,
				  ]);
		const newNotices: Notice[] = usersToNotify.map((userId) => ({
			userId,
			...noticeEntry,
			...setStandardNoticeProps(),
		}));

		const result =
			newNotices.length > 0
				? await notifications.insertMany(newNotices)
				: { acknowledged: true };

		!activeConnection && (await client.close());

		res.status = 204;
		res.success = result.acknowledged; //!!result.insertedId
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function patchNotification(
	notificationId: string,
	user: UserToken,
	patch: Partial<Notice>
) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const notifications = db.collection<Notice>(notificationsColl);

		const isValidTarget = await notifications
			.findOne({ notificationId })
			.then((n) => n?.userId === user.userId);
		if (!isValidTarget) {
			await client.close();
			res.status = 404;
			return res;
		}

		const result = await notifications.updateOne(
			{ notificationId },
			{ $set: { ...patch, lastModified: Date.now() } }
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

// Admin use only
export async function deleteNotification(
	notificationId: string | string[],
	user: UserToken
) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	if (!user || !user.roles.includes(0)) return res;

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const notifications = db.collection<Notice>(notificationsColl);
		const result = await notifications.deleteOne(
			Array.isArray(notificationId)
				? { notificationId: { $in: notificationId } }
				: { notificationId }
		);

		await client.close();

		res.status = 204;
		res.success = Array.isArray(notificationId)
			? result.deletedCount > 0
			: result.deletedCount === 1;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}
