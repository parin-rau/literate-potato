import "dotenv/config";
import express from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "./mongodb";
import { TicketData } from "../types";

const PORT = 3002;

const localTickets = process.env.LOCAL_TICKETS ?? "tickets";
const localProjects = process.env.LOCAL_PROJECTS ?? "projects";

const app = express();

app.use(express.json());

// PROJECTS

app.get("/api/project", async (_req, res) => {
	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);
		const projects = await coll.find().limit(50).toArray();
		await client.close();
		res.status(200).send(projects);
	} catch (err) {
		console.error(err);
	}
});

app.get("/api/project/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);
		const project = await coll.findOne({ projectId: id });
		await client.close();
		res.status(200).send(project);
	} catch (err) {
		console.error(err);
	}
});

app.post("/api/project", async (req, res) => {
	try {
		const newProject = await req.body;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);
		const result = await coll.insertOne(newProject);
		await client.close();
		res.status(200).send(result);
	} catch (err) {
		console.error(err);
	}
});

app.get("/api/project/:id/ticket", async (req, res) => {
	try {
		const id = req.params.id;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localTickets);
		const tickets = await coll.find({ projectId: id }).limit(50).toArray();
		await client.close();
		res.status(200).send(tickets);
	} catch (err) {
		console.error(err);
	}
});

// TICKETS

app.get("/api/ticket", async (_req, res) => {
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
});

app.get("/api/ticket/:id", async (req, res) => {
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
});

app.post("/api/ticket", async (req, res) => {
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
});

app.patch("/api/ticket/:id", async (req, res) => {
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
});

app.delete("/api/ticket/:id", async (req, res) => {
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
});

// USER

// TEST

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
