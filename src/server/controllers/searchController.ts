import "dotenv/config";
import { Request, Response } from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../mongodb";

const localTickets = process.env.LOCAL_TICKETS ?? "tickets";
const localProjects = process.env.LOCAL_PROJECTS ?? "projects";

export async function getSearchResults(req: Request, res: Response) {
	try {
		const results = [];
		const { query } = req.params;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl: mongoDB.Collection = db.collection(localTickets);
		const projectColl: mongoDB.Collection = db.collection(localProjects);
		const foundTickets = await ticketColl
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
		await client.close();
		results.push(foundTickets, foundProjects);
		res.status(200).send(results);
	} catch (e) {
		console.error(e);
	}
}
