import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { FetchedTicketData, TicketData, User } from "../../../types";
import { countPerElement } from "../../../utility/arrayComparisons";

const ticketsColl = process.env.LOCAL_TICKETS ?? "tickets";
//const projectsColl = process.env.LOCAL_PROJECTS ?? "projects";
const usersColl = process.env.LOCAL_USERS ?? "users";

export async function getTicket(id: string) {
	const res: { status: number; ticket?: unknown } = {
		status: 500,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(ticketsColl);
		const ticket = await coll.findOne({ ticketId: id });
		await client.close();

		res.status = 200;
		res.ticket = ticket;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getAllTickets() {
	const res: { status: number; tickets?: unknown } = {
		status: 500,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(ticketsColl);
		const tickets = await coll.find().limit(50).toArray();
		await client.close();

		res.status = 200;
		res.tickets = tickets;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getAllTicketsForProject(projectId: string) {
	const res: { status: number; tickets?: unknown } = {
		status: 500,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const tickets = db.collection<FetchedTicketData>(ticketsColl);

		if (projectId === "uncategorized") {
			const foundTickets = await tickets
				.find({ "project.projectId": "" })
				.limit(50)
				.toArray();
			await client.close();

			res.status = 200;
			res.tickets = foundTickets;
			return res;
		} else {
			const foundTickets = await tickets
				.find({ "project.projectId": projectId })
				.limit(50)
				.toArray();
			await client.close();

			res.status = 200;
			res.tickets = foundTickets;
			return res;
		}
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getUncategorizedForGroup(groupId: string) {
	const res: { status: number; tickets?: unknown } = {
		status: 500,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl = db.collection<FetchedTicketData>(ticketsColl);
		const tickets = await ticketColl
			.find({ "project.projectId": "", groupId })
			.toArray();
		await client.close();

		res.status = 200;
		res.tickets = tickets;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function getUncategorizedForUser(userId: string) {
	const res: { status: number; tickets?: unknown } = {
		status: 500,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const users = db.collection<User>(usersColl);
		const ticketColl = db.collection<FetchedTicketData>(ticketsColl);

		const groupIds = await users
			.findOne({ userId })
			.then((u) => u?.groupIds.map((g) => g));
		console.log(groupIds);

		const tickets = await ticketColl
			.find({ "project.projectId": "", groupId: { $in: groupIds } })
			.toArray();

		res.status = 200;
		res.tickets = tickets;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function getTicketCountsForCalendar(dateRange: string[]) {
	const res: { status: number; countedDates: Record<string, number> } = {
		status: 500,
		countedDates: {},
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl: mongoDB.Collection = db.collection(ticketsColl);
		// const projectColl: mongoDB.Collection = db.collection(projects);

		const foundTickets = await ticketColl
			.find({ due: { $in: dateRange } })
			.toArray();

		// const foundTicketsParents: string[] = foundTickets.map(
		// 	(t) => t.project.projectId
		// );

		// const foundProjects = await projectColl
		// 	.find({
		// 		projectId: { $in: foundTicketsParents },
		// 	})
		// 	.toArray();

		await client.close();

		// const colors = foundProjects.map((p) => ({
		// 	color: p.color,
		// 	projectId: p.projectId,
		// }));

		const dueDates: string[] = foundTickets.map((t) => t.due);
		const countedDates = countPerElement(dueDates);

		res.status = 200;
		res.countedDates = countedDates;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function createTicket(partialNewTicket: TicketData) {
	const res: { status: number; success: boolean; ticketNumber?: number } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(ticketsColl);
		const ticketNumber = (await coll.countDocuments({})) + 1;
		const newTicket = { ...partialNewTicket, ticketNumber: ticketNumber };
		const result = await coll.insertOne(newTicket);
		await client.close();

		res.success = result.acknowledged;
		res.status = 200;
		res.ticketNumber = ticketNumber;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function updateTicket(id: string, data: Record<string, unknown>) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(ticketsColl);
		const result = await coll.updateOne(
			{ ticketId: id },
			{ $set: { ...data, lastModified: Date.now() } }
		);
		await client.close();

		res.success = result.acknowledged;
		res.status = 200;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function updateTicketEditProject(
	projectId: string,
	data: Record<string, unknown>
) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(ticketsColl);
		const result = await coll.updateMany(
			{ "project.projectId": projectId },
			{ $set: { ...data, lastModified: Date.now() } }
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

export async function deleteTicket(id: string) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(ticketsColl);
		const result = await coll.deleteOne({ ticketId: id });
		await client.close();

		res.status = 200;
		res.success = result.acknowledged;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}
