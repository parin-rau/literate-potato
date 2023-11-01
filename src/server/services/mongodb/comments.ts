import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { Comment, FetchedTicketData } from "../../../types";

const ticketsColl = process.env.LOCAL_TICKETS ?? "tickets";
const commentsColl = process.env.LOCAL_COMMENTS ?? "comments";

export async function getTicketComments(ticketId: string) {
	const res: { status: number; success: boolean; comments?: Comment[] } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const commentColl = db.collection<Comment>(commentsColl);

		const foundComments = await commentColl
			.find({ ticketId })
			.sort({ timestamp: -1 })
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

export async function createComment(c: Comment) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl = db.collection<FetchedTicketData>(ticketsColl);
		const commentColl = db.collection<Comment>(commentsColl);

		const result1 = await commentColl.insertOne(c);
		const result2 = await ticketColl.updateOne(
			{ ticketId: c.ticketId },
			{ $addToSet: { comments: c.commentId } }
		);

		await client.close();

		res.status = 200;
		res.success = result1.acknowledged && result2.acknowledged;

		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function editComment(
	id: string,
	patchData: Record<string, unknown>
) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
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

export async function deleteComment(id: string) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
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
