import "dotenv/config";
import { Request, Response } from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../mongodb";
import { titleCap } from "../../utility/charCaseFunctions";

const tickets = process.env.LOCAL_TICKETS ?? "tickets";
const projects = process.env.LOCAL_PROJECTS ?? "projects";
const users = process.env.LOCAL_USERS ?? "users";

export async function getSearchResults(req: Request, res: Response) {
	try {
		const { query } = req.params;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl: mongoDB.Collection = db.collection(tickets);
		const projectColl: mongoDB.Collection = db.collection(projects);
		const userColl: mongoDB.Collection = db.collection(users);
		const foundTickets = await ticketColl
			.find({
				$or: [
					{ title: query },
					{ project: query },
					{ creator: query },
					{ description: query },
					{ tags: titleCap(query) },
				],
			})
			.limit(50)
			.toArray();
		const foundProjects = await projectColl
			.find({
				$or: [
					{ title: query },
					{ project: query },
					{ creator: query },
					{ description: query },
				],
			})
			.limit(50)
			.toArray();
		const foundUsers = await userColl
			.find({ creator: query })
			.limit(50)
			.toArray();
		await client.close();

		const appendMeta = (
			sourceArray: { [key: string]: string | number }[],
			meta: { [key: string]: string | number }
		) => {
			const resultsFormat = (source: {
				[key: string]: string | number;
			}) => {
				const formatted = {
					title: source.title || source.username,
					id: source.ticketId || source.projectId || source.userId,
					description: source.description,
					timestamp: source.timestamp,
				};
				return formatted;
			};

			const appended = sourceArray.map((s) => ({
				data: resultsFormat(s),
				meta,
			}));
			return appended;
		};

		const appendedTickets = appendMeta(foundTickets, { kind: "ticket" });
		const appendedProjects = appendMeta(foundProjects, { kind: "project" });
		const appendedUsers = appendMeta(foundUsers, { kind: "user" });

		res.status(200).send([
			...appendedTickets,
			...appendedProjects,
			...appendedUsers,
		]);
	} catch (e) {
		console.error(e);
	}
}
