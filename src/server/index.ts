import express from "express";
import { connectToDB } from "../utility/mongodb";

const app = express();

app.get("/api/ticket", async (req, res) => {
	try {
		const client = await connectToDB();
		const db = client.db(import.meta.env.LOCAL_DB);
		const coll = db.collection(import.meta.env.LOCAL_POSTS);
		const tickets = await coll.find().toArray();
		await client.close();
		res.send(tickets).status(200);
	} catch (err) {
		console.error(err);
	}
});

app.post("/api/ticket", async (req, res) => {
	try {
		const newTicket = await req.body;
		console.log("newTicket2:", newTicket);
		const client = await connectToDB();
		const db = client.db(import.meta.env.LOCAL_DB);
		const coll = db.collection(import.meta.env.LOCAL_POSTS);
		const tickets = await coll.insertOne(newTicket);
		await client.close();
		res.send(tickets).status(200);
	} catch (err) {
		console.error(err);
	}
});

app.listen(3002, () => console.log("started"));
