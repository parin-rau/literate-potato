import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { Comment, FetchedTicketData, User, UserToken } from "../../../types";
import { createNotification } from "./notifications";

type IdObj = { id: string; idKind: "COMMENT" | "TICKET" };

const ticketsColl = process.env.LOCAL_TICKETS ?? "tickets";
const commentsColl = process.env.LOCAL_COMMENTS ?? "comments";
const usersColl = process.env.LOCAL_USERS ?? "users";

const checkPermissions = async (
	db: mongoDB.Db,
	currentUserId: string,
	{ id, idKind }: IdObj
) => {
	const users = db.collection<User>(usersColl);
	const tickets = db.collection<FetchedTicketData>(ticketsColl);
	const comments = db.collection<Comment>(commentsColl);

	const permittedGroupsForUser = await users
		.findOne({ userId: currentUserId })
		.then((u) => u?.groupIds);

	const isPermittedTicket = async (ticketId: string) =>
		!!(await tickets.findOne({
			ticketId,
			"group.groupId": { $in: permittedGroupsForUser },
		}));

	const isPermittedComment = async () => {
		const comment = await comments.findOne({ commentId: id });

		return !!comment && isPermittedTicket(comment.ticketId);
	};

	switch (idKind) {
		case "COMMENT":
			return await isPermittedComment();
		case "TICKET":
			return await isPermittedTicket(id);
		default:
			return false;
	}
};

const getUsersByTicketId = async (
	db: mongoDB.Db,
	ticketId: string,
	omitUserIds: string[]
) => {
	const tickets = db.collection<FetchedTicketData>(ticketsColl);
	const comments = db.collection<Comment>(commentsColl);

	const targetTicketParams = await tickets
		.findOne({ ticketId })
		.then((t) => ({
			commentIds: t?.comments,
			authorId: t?.creator.userId,
			assigneeId: t?.assignee.userId,
		}));
	const usersToNotifyWithDuplicates = (
		await comments
			.find({ commentId: { $in: targetTicketParams.commentIds } })
			.toArray()
	).map((c) => c.userId);

	!!targetTicketParams.authorId &&
		usersToNotifyWithDuplicates.push(targetTicketParams.authorId);
	!!targetTicketParams.assigneeId &&
		usersToNotifyWithDuplicates.push(targetTicketParams.assigneeId);

	const filteredUsersWithDuplicates = usersToNotifyWithDuplicates.filter(
		(u) => !omitUserIds.includes(u)
	);

	const usersToNotify = [...new Set(filteredUsersWithDuplicates)];

	return usersToNotify;
};

export async function getTicketComments(ticketId: string, user: UserToken) {
	const res: { status: number; success: boolean; comments?: Comment[] } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);

		const isPermittedTicket = await checkPermissions(db, user.userId, {
			id: ticketId,
			idKind: "TICKET",
		});
		if (!isPermittedTicket) {
			await client.close();
			res.status = 403;
			return res;
		}

		const commentColl = db.collection<Comment>(commentsColl);
		const foundComments = await commentColl
			.find({ ticketId })
			.sort({ timestamp: 1 })
			.toArray();
		await client.close();

		res.status = 200;
		res.comments = foundComments;

		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function createComment(c: Comment, user: UserToken) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);

		const isPermittedTicket = await checkPermissions(db, user.userId, {
			id: c.ticketId,
			idKind: "TICKET",
		});
		if (!isPermittedTicket) {
			await client.close();
			res.status = 403;
			return res;
		}

		const tickets = db.collection<FetchedTicketData>(ticketsColl);
		const comments = db.collection<Comment>(commentsColl);

		const parentTicket = await tickets.findOne({ ticketId: c.ticketId });

		const result1 = await comments.insertOne(c);
		const result2 = await tickets.updateOne(
			{ ticketId: c.ticketId },
			{ $addToSet: { comments: c.commentId } }
		);

		const noticeCreate =
			!!result1.insertedId && !!result2.modifiedCount
				? await createNotification(
						{
							messageCode: 11,
							resource: {
								kind: "TICKET",
								id: c.ticketId,
								title: parentTicket?.title,
							},
							secondaryResource: {
								kind: "USER",
								id: user.userId,
								title: user.username,
							},
						},
						user,
						getUsersByTicketId
				  )
				: undefined;

		await client.close();

		res.status = 200;
		res.success = noticeCreate
			? result1.acknowledged &&
			  result2.acknowledged &&
			  noticeCreate.success
			: result1.acknowledged && result2.acknowledged;

		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function editComment(
	id: string,
	patchData: Record<string, unknown>,
	user: UserToken
) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);

		const isPermittedComment = await checkPermissions(db, user.userId, {
			id,
			idKind: "COMMENT",
		});
		if (!isPermittedComment) {
			await client.close();
			res.status = 403;
			return res;
		}

		const comments = db.collection<Comment>(commentsColl);

		const result = await comments.updateOne(
			{ commentId: id },
			{ $set: { ...patchData, lastModified: Date.now() } }
		);
		await client.close();

		res.success = result.acknowledged;
		res.status = 200;

		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function reactComment(
	commentId: string,
	userId: string,
	reaction: string,
	user: UserToken
) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	const updateAction = (r: string) => {
		switch (r) {
			case "like":
				return {
					$addToSet: { likes: userId },
					$pull: { dislikes: userId },
				};
			case "dislike":
				return {
					$addToSet: { dislikes: userId },
					$pull: { likes: userId },
				};
			case "reset":
				return {
					$pull: { likes: userId, dislikes: userId },
				};
			default:
				return {};
		}
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);

		const isPermittedComment = await checkPermissions(db, user.userId, {
			id: commentId,
			idKind: "COMMENT",
		});
		if (!isPermittedComment) {
			await client.close();
			res.status = 403;
			return res;
		}

		const tickets = db.collection<FetchedTicketData>(ticketsColl);
		const comments = db.collection<Comment>(commentsColl);

		const result = await comments.updateOne(
			{ commentId },
			updateAction(reaction)
		);

		const targetComment = await comments
			.findOne({ commentId })
			.then((c) => ({ userId: c?.userId, ticketId: c?.ticketId }));

		if (!targetComment.ticketId || !targetComment.userId) {
			await client.close();
			res.status = 404;
			return res;
		}

		const parentTicket = await tickets.findOne({
			ticketId: targetComment.ticketId,
		});

		const notifyUser = await createNotification(
			{
				messageCode: 12,
				resource: {
					kind: "TICKET",
					id: targetComment.ticketId,
					title: parentTicket?.title,
				},
				secondaryResource: {
					kind: "USER",
					id: user.userId,
					title: user.username,
				},
			},
			user,
			async () => [
				await comments
					.findOne({ commentId })
					.then((c) => (c!.userId !== user.userId ? c!.userId : "")),
			]
		);

		res.status = 200;
		res.success = result.acknowledged && notifyUser.success;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function deleteComment(id: string, user: UserToken) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);

		const isPermittedComment = await checkPermissions(db, user.userId, {
			id,
			idKind: "COMMENT",
		});
		if (!isPermittedComment) {
			await client.close();
			res.status = 403;
			return res;
		}

		const comments = db.collection<Comment>(commentsColl);
		const tickets = db.collection<FetchedTicketData>(ticketsColl);

		const result1 = await comments.deleteOne({ commentId: id });
		const result2 = await tickets.updateOne(
			{ comments: id },
			{ $pull: { comments: id } }
		);
		await client.close();

		res.success = result1.acknowledged && result2.acknowledged;
		res.status = 200;

		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}
