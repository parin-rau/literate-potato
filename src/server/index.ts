import express from "express";
//import { connectToDB } from "../utility/mongodb";

const PORT = 3002;

const app = express();

app.use(express.json());

/* app.get("/api/ticket", async (_req, res) => {
	try {
		const client = await connectToDB();
		const db = client.db(import.meta.env.VITE_LOCAL_DB);
		const coll = db.collection(import.meta.env.VITE_LOCAL_POSTS);
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
		const db = client.db(import.meta.env.VITE_LOCAL_DB);
		const coll = db.collection(import.meta.env.VITE_LOCAL_POSTS);
		const tickets = await coll.insertOne(newTicket);
		await client.close();
		res.send(tickets).status(200);
	} catch (err) {
		console.error(err);
	}
}); */

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
		res.send().status(200);
	} catch (err) {
		console.error(err);
	}
});

app.listen(PORT, () => console.log("Listening on PORT", PORT));
