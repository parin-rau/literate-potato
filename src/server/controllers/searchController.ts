import "dotenv/config";
import { Request, Response } from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../mongodb";

const localTickets = process.env.LOCAL_TICKETS ?? "tickets";
const localProjects = process.env.LOCAL_PROJECTS ?? "projects";

export async function getSearchResults(req: Request, res: Response) {
	try {
		//const results = [];
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

		const appendMeta = (
			sourceArray: { [key: string]: string | number }[],
			meta: { [key: string]: string | number }
		) => {
			const appended = sourceArray.map((s) => ({ ...s, meta }));
			return appended;
		};

		const appendedTickets = appendMeta(foundTickets, { kind: "ticket" });
		const appendedProjects = appendMeta(foundProjects, { kind: "project" });
		//results.push(foundTickets, foundProjects);
		res.status(200).send([...appendedTickets, ...appendedProjects]);
	} catch (e) {
		console.error(e);
	}
}
