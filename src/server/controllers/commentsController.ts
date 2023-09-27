import "dotenv/config";
import { Request, Response } from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../mongodb";

const localTickets = process.env.LOCAL_TICKETS ?? "tickets";

const localComments = process.env.LOCAL_COMMENTS ?? "comments";

export async function getTicketComments(req: Request, res: Response) {
	try {
		const { ticketId } = req.params;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl: mongoDB.Collection = db.collection(localTickets);
		const commentColl: mongoDB.Collection = db.collection(localComments);
		const foundTicket = await ticketColl.findOne({
			ticketId,
		});
		if (!foundTicket) return res.sendStatus(404);

		const commentIds = foundTicket.commentIds;

		const foundComments = await commentColl
			.find({
				commentId: { $in: commentIds },
			})
			.limit(50)
			.toArray();
		await client.close();

		res.status(200).send(foundComments);
	} catch (e) {
		console.error(e);
	}
}

export async function createNewComment(req: Request, res: Response) {
	try {
		const { ticketId } = req.params;
		const {} = req.body;

		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl: mongoDB.Collection = db.collection(localTickets);
		const commentColl: mongoDB.Collection = db.collection(localComments);

		await client.close();

		res.status(200).send(foundComments);
	} catch (e) {
		console.error(e);
	}
}
