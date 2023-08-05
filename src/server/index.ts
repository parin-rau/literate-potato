import "dotenv/config";
import express from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "./mongodb";

export type TicketData = {
	title: string;
	description: string;
	priority: "" | "low" | "medium" | "high";
	due?: string;
	tags?: string[];
	comments?: {
		_id: string;
		timestamp: number;
		content: string;
	}[];
	timestamp: number;
};

export type FetchedTicketData = {
	title: string;
	description: string;
	priority: "" | "low" | "medium" | "high";
	due?: string;
	tags?: string[];
	comments?: {
		_id: string;
		timestamp: number;
		content: string;
	}[];
	timestamp: number;
	_id: string;
};

const PORT = 3002;

// const localPosts: string = process.env.VITE_LOCAL_POSTS;

const app = express();

app.use(express.json());

app.get("/api/ticket", async (_req, res) => {
	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection("posts");
		const tickets = await coll.find().limit(50).toArray();
		await client.close();
		res.status(200).send(tickets);
	} catch (err) {
		console.error(err);
	}
});

app.post("/api/ticket", async (req, res) => {
	try {
		const data: TicketData = await req.body;
		const { title, description, priority, due, tags, comments } = data;
		const newTicket: TicketData = {
			title,
			description,
			priority,
			due,
			tags,
			comments,
			timestamp: Date.now(),
		};
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection("posts");
		const tickets = await coll.insertOne(newTicket);
		await client.close();
		res.status(200).send(tickets);
	} catch (err) {
		console.error(err);
	}
});

app.get("/api/test", (_req, res) => {
	try {
		res.send({ bongo: "bingo" });
	} catch (err) {
		console.error(err);
	}
});

app.post("/api/test", async (req, res) => {
	try {
		const data = req.body;
		console.log("data: ", data);
		res.status(200).send();
	} catch (err) {
		console.error(err);
	}
});

app.listen(PORT, () => console.log("Listening on PORT", PORT));
