import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import {
	Comment,
	FetchedTicketData,
	Group,
	Project,
	TicketData,
	User,
	UserToken,
} from "../../../types";
import { countPerElement } from "../../../utility/arrayComparisons";

const ticketsColl = process.env.LOCAL_TICKETS ?? "tickets";
const projectsColl = process.env.LOCAL_PROJECTS ?? "projects";
const usersColl = process.env.LOCAL_USERS ?? "users";
const groupsColl = process.env.LOCAL_GROUPS ?? "groups";
const commentsColl = process.env.LOCAL_COMMENTS ?? "comments";

const getPermittedGroups = async (
	userId: string,
	usersCollection: mongoDB.Collection<User>
) => {
	const permittedGroups = await usersCollection
		.findOne({ userId })
		.then((u) => u?.groupIds);
	return permittedGroups;
};

export async function getTicket(id: string, user: UserToken) {
	const res: { status: number; ticket?: unknown } = {
		status: 500,
		ticket: {},
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const tickets = db.collection<FetchedTicketData>(ticketsColl);
		const users = db.collection<User>(usersColl);

		const permittedGroups = await getPermittedGroups(user.userId, users);
		if (!permittedGroups) return res;

		const ticket = await tickets.findOne({
			ticketId: id,
		});
		await client.close();

		if (ticket && !permittedGroups?.includes(ticket.group.groupId)) {
			res.status = 250;
			return res;
		}

		res.status = 200;
		res.ticket = ticket;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getAllTickets(user: UserToken) {
	const res: { status: number; tickets: unknown[] } = {
		status: 500,
		tickets: [],
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection<FetchedTicketData>(ticketsColl);
		const users = db.collection<User>(usersColl);

		const permittedGroups = await getPermittedGroups(user.userId, users);

		const tickets = await coll.find().toArray();
		await client.close();

		if (
			tickets &&
			!tickets.every((t) => permittedGroups?.includes(t.group.groupId))
		) {
			res.status = 250;
			return res;
		}

		res.status = 200;
		res.tickets = tickets;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getTicketsForUser(
	userId: string,
	options?: { limit: number; sort: { field: string; direction: 1 | -1 } }
) {
	const res: { status: number; tickets: unknown[] } = {
		status: 500,
		tickets: [],
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const tickets = db.collection<FetchedTicketData>(ticketsColl);
		const users = db.collection<User>(usersColl);

		const permittedGroups = await getPermittedGroups(userId, users);

		// const foundGroups = await users
		// 	.findOne({ userId })
		// 	.then((u) => u?.groupIds);

		// if (!foundGroups) return res;

		const foundTickets = options
			? await tickets
					.find({ "group.groupId": { $in: permittedGroups } })
					//.sort({ [options.sort.field]: options.sort.direction })
					//.limit(options.limit)
					.toArray()
			: await tickets
					.find({ "group.groupId": { $in: permittedGroups } })
					.sort({ timestamp: 1 })
					.toArray();
		await client.close();

		if (!permittedGroups) {
			res.status = 250;
			return res;
		}

		if (options?.sort.field === "completion") {
			const closestToCompletion = foundTickets
				.map((t) => ({
					ticket: t,
					completion:
						t.subtasks.filter((s) => s.completed).length /
						t.subtasks.length,
				}))
				.filter((t) => t.completion < 1)
				.sort((a, b) =>
					options.sort.direction === -1
						? b.completion - a.completion
						: a.completion - b.completion
				)
				.slice(0, 8)
				.map((t) => t.ticket);

			res.status = 200;
			res.tickets = closestToCompletion;
			return res;
		}

		res.status = 200;
		res.tickets = foundTickets;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getAllTicketsForProject(
	projectId: string,
	user: UserToken
) {
	const res: { status: number; tickets?: unknown } = {
		status: 500,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const tickets = db.collection<FetchedTicketData>(ticketsColl);
		const users = db.collection<User>(usersColl);

		const permittedGroups = await getPermittedGroups(user.userId, users);

		if (projectId === "uncategorized") {
			const foundTickets = await tickets
				.find({ "project.projectId": "" })
				.toArray();
			await client.close();

			if (
				foundTickets &&
				!foundTickets.every(
					(t) => permittedGroups?.includes(t.group.groupId)
				)
			) {
				res.status = 250;
				return res;
			}

			res.status = 200;
			res.tickets = foundTickets;
			return res;
		} else {
			const foundTickets = await tickets
				.find({ "project.projectId": projectId })
				.toArray();
			await client.close();

			if (
				foundTickets &&
				!foundTickets.every(
					(t) => permittedGroups?.includes(t.group.groupId)
				)
			) {
				res.status = 250;
				return res;
			}

			res.status = 200;
			res.tickets = foundTickets;
			return res;
		}
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getUncategorizedForGroup(
	groupId: string,
	user: UserToken
) {
	const res: { status: number; tickets: unknown[] } = {
		status: 500,
		tickets: [],
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl = db.collection<FetchedTicketData>(ticketsColl);
		const users = db.collection<User>(usersColl);

		const permittedGroups = await getPermittedGroups(user.userId, users);

		const tickets = await ticketColl
			.find({ "project.projectId": "", "group.groupId": groupId })
			.toArray();
		await client.close();

		if (!permittedGroups) {
			res.status = 250;
			return res;
		}

		res.status = 200;
		res.tickets = tickets;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function getUncategorizedForUser(userId: string) {
	const res: { status: number; tickets: unknown[] } = {
		status: 500,
		tickets: [],
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const users = db.collection<User>(usersColl);
		const ticketColl = db.collection<FetchedTicketData>(ticketsColl);

		const permittedGroups = await getPermittedGroups(userId, users);

		const groupIds = await users
			.findOne({ userId })
			.then((u) => u?.groupIds.map((g) => g));

		if (!permittedGroups) {
			res.status = 250;
			return res;
		}

		const tickets = await ticketColl
			.find({
				"project.projectId": "",
				"group.groupId": { $in: groupIds },
			})
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
		const foundTickets = await ticketColl
			.find({ due: { $in: dateRange } })
			.toArray();

		await client.close();

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
		const tickets = db.collection<FetchedTicketData>(ticketsColl);
		const groups = db.collection<Group>(groupsColl);

		const ticketNumber = (await tickets.countDocuments({})) + 1;
		const newTicket = { ...partialNewTicket, ticketNumber: ticketNumber };

		const result1 = await tickets.insertOne(newTicket);
		const result2 = await groups.updateOne(
			{ groupId: newTicket.group.groupId },
			{ $addToSet: { ticketIds: newTicket.ticketId } }
		);
		await client.close();

		res.success = result1.acknowledged && result2.acknowledged;
		res.status = 200;
		res.ticketNumber = ticketNumber;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function updateTicket(
	id: string,
	data: Record<string, unknown>,
	meta?: { userId?: string; ticketId?: string; subtaskId?: string }
) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const tickets = db.collection<FetchedTicketData>(ticketsColl);
		const users = db.collection<User>(usersColl);
		const updateTicket = await tickets.updateOne(
			{ ticketId: id },
			{ $set: { ...data, lastModified: Date.now() } }
		);

		if (meta) {
			const { userId, ticketId, subtaskId } = meta;
			const isCompleted = await users
				.findOne({ userId })
				.then(
					(u) =>
						u?.ticketIds.completed.includes(id) ||
						u?.subtaskIds.completed.includes(id)
				);

			if (!isCompleted) {
				if (ticketId && data.taskStatus === "Completed") {
					const addTask = await users.updateOne(
						{ userId },
						{ $addToSet: { "ticketIds.completed": id } }
					);
					res.success = addTask.acknowledged;
				}
				if (subtaskId) {
					const addSubtask = await users.updateOne(
						{ userId },
						{ $addToSet: { "subtaskIds.completed": subtaskId } }
					);
					res.success = addSubtask.acknowledged;
				}
			} else {
				if (ticketId && data.taskStatus !== "Completed") {
					const removeTask = await users.updateOne(
						{ userId },
						{ $pull: { "ticketIds.completed": id } }
					);
					res.success = removeTask.acknowledged;
				}
				if (subtaskId) {
					const removeSubtask = await users.updateOne(
						{ userId },
						{ $pull: { "subtaskIds.completed": subtaskId } }
					);
					res.success = removeSubtask.acknowledged;
				}
			}
		}

		await client.close();

		res.success = updateTicket.acknowledged;
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
		const tickets = db.collection<FetchedTicketData>(ticketsColl);
		const groups = db.collection<Group>(groupsColl);
		const projects = db.collection<Project>(projectsColl);
		const comments = db.collection<Comment>(commentsColl);

		const result1 = await tickets.deleteOne({ ticketId: id });
		const result2 = await groups.updateOne(
			{ ticketIds: id },
			{ $pull: { ticketIds: id } }
		);
		const result3 = await projects.updateOne(
			{ tasksTotalIds: id },
			{
				$pull: {
					tasksCompletedIds: id,
					tasksTotalIds: id,
				},
			}
		);
		const result4 = await comments.deleteMany({ ticketId: id });

		await client.close();

		res.status = 200;
		res.success =
			result1.acknowledged &&
			result2.acknowledged &&
			result3.acknowledged &&
			result4.acknowledged;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}
