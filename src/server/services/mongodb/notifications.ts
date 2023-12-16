import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { UserToken, Notice, NoticeEntry } from "../../../types";
import { v4 as uuidv4 } from "uuid";

//const usersColl = process.env.LOCAL_USERS ?? "users";
const notificationsColl = process.env.LOCAL_NOTIFICATIONS ?? "notifications";

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
				//return { userId: targetId, isSeen: false };
			}
			default: {
				return await coll.find({ userId: targetId }).toArray();
				//return { userId: targetId };
			}
		}
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		//const users = db.collection<User>(usersColl);
		const notifications = db.collection<Notice>(notificationsColl);

		//const foundNotifications = await notifications.find(query()).toArray();

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

export async function createNotification(notice: NoticeEntry, db?: mongoDB.Db) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	const setStandardProps = () => ({
		notificationId: uuidv4(),
		isSeen: false,
		timestamp: Date.now(),
	});

	try {
		if (!db) {
			// Service called from notifications controller
			const client = await connectToDatabase();
			const db = client.db(process.env.VITE_LOCAL_DB);
			const notifications = db.collection<Notice>(notificationsColl);
			const result = await notifications.insertOne({
				...notice,
				...setStandardProps(),
				// notificationId: uuidv4(),
				// isSeen: false,
				// timestamp: Date.now()
			});

			await client.close();

			res.status = 204;
			res.success = !!result.insertedId;
			return res;
		} else {
			// Call inside other service
			const notifications = db.collection<Notice>(notificationsColl);
			const result = await notifications.insertOne({
				...notice,
				...setStandardProps(),
				// notificationId: uuidv4(),
				// isSeen: false,
				// timestamp: Date.now()
			});

			// Leaving connection open

			res.status = 204;
			res.success = !!result.insertedId;
			return res;
		}
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
		//const users = db.collection<User>(usersColl);
		const notifications = db.collection<Notice>(notificationsColl);

		const isValidTarget = await notifications
			.findOne({ notificationId })
			.then((n) => n?.userId === user.userId);
		if (!isValidTarget) {
			await client.close();
			res.status = 404;
			return res;
		}

		const result = await notifications.updateOne({ notificationId }, patch);

		await client.close();

		res.status = 200;
		res.success = result.acknowledged;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function deleteNotification(
	notificationId: string,
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
		const result = await notifications.deleteOne({
			notificationId,
		});

		await client.close();

		res.status = 204;
		res.success = result.deletedCount > 0;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}
