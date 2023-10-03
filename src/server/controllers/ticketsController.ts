import "dotenv/config";
import { Request, Response } from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../db/mongodb";
import { TicketData } from "../../types";
import { countPerElement } from "../../utility/arrayComparisons";
//import { dateStrToTime } from "../../utility/dateConversion";

const localTickets = process.env.LOCAL_TICKETS ?? "tickets";
const projects = process.env.LOCAL_PROJECTS ?? "projects";

export async function getTicket(req: Request, res: Response) {
	try {
		const id = req.params.id;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localTickets);
		const ticket = await coll.findOne({ ticketId: id });
		await client.close();
		res.status(200).send(ticket);
	} catch (err) {
		console.error(err);
	}
}

export async function getAllTickets(_req: Request, res: Response) {
	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localTickets);
		const tickets = await coll.find().limit(50).toArray();
		await client.close();
		res.status(200).send(tickets);
	} catch (err) {
		console.error(err);
	}
}

export async function getAllTicketsForProject(req: Request, res: Response) {
	try {
		const id = req.params.projectId;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localTickets);

		if (id === "uncategorized") {
			const tickets = await coll
				.find({ "project.projectId": "" })
				.limit(50)
				.toArray();
			await client.close();
			res.status(200).send(tickets);
		} else {
			const tickets = await coll
				.find({ "project.projectId": id })
				.limit(50)
				.toArray();
			await client.close();
			res.status(200).send(tickets);
		}
	} catch (err) {
		console.error(err);
	}
}

export async function getTicketCountsForCalendar(req: Request, res: Response) {
	try {
		const dateRange: string[] = await req.body;

		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl: mongoDB.Collection = db.collection(localTickets);
		const projectColl: mongoDB.Collection = db.collection(projects);

		const foundTickets = await ticketColl
			.find({ due: { $in: dateRange } })
			.toArray();

		const foundTicketsParents: string[] = foundTickets.map(
			(t) => t.project.projectId
		);

		const foundProjects = await projectColl
			.find({
				projectId: { $in: foundTicketsParents },
			})
			.toArray();

		await client.close();

		const colors = foundProjects.map((p) => ({
			color: p.color,
			projectId: p.projectId,
		}));

		const dueDates: string[] = foundTickets.map((t) => t.due);
		const countedDates = countPerElement(dueDates);

		res.status(200).send(countedDates);
	} catch (e) {
		console.error(e);
	}
}

export async function createTicket(req: Request, res: Response) {
	try {
		const partialNewTicket: TicketData = await req.body;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localTickets);
		const ticketNumber = (await coll.countDocuments({})) + 1;
		const newTicket = { ...partialNewTicket, ticketNumber: ticketNumber };
		const result = await coll.insertOne(newTicket);
		await client.close();
		res.status(200).send({ result, ticketNumber });
	} catch (err) {
		console.error(err);
	}
}

export async function updateTicket(req: Request, res: Response) {
	try {
		const id = req.params.id;
		const data = await req.body;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localTickets);
		const tickets = await coll.updateOne(
			{ ticketId: id },
			{ $set: { ...data, lastModified: Date.now() } }
		);
		await client.close();
		res.status(200).send(tickets);
	} catch (err) {
		console.error(err);
	}
}

export async function updateTicketEditProject(req: Request, res: Response) {
	try {
		const projectId = req.params.projectId;
		const data = await req.body;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localTickets);
		const tickets = await coll.updateMany(
			{ "project.projectId": projectId },
			{ $set: { ...data, lastModified: Date.now() } }
		);
		await client.close();
		res.status(200).send(tickets);
	} catch (err) {
		console.error(err);
	}
}

export async function deleteTicket(req: Request, res: Response) {
	try {
		const id = req.params.id;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localTickets);
		const result = await coll.deleteOne({ ticketId: id });
		await client.close();
		res.status(200).send(result);
	} catch (err) {
		console.error(err);
	}
}
