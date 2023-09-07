import "dotenv/config";
import express from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../server/mongodb";
import { validateRegistrationInfo } from "./userValidation";

const PORT = 4002;

const localUsers = process.env.LOCAL_TICKETS ?? "users";

const app = express();

app.use(express.json());

app.post("/auth/register", async (req, res) => {
	const userForm = await req.body;
	const user = validateRegistrationInfo(userForm);
	console.log(user);

	// try {
	// 	const newUser = await req.body;
	// 	const client: mongoDB.MongoClient = await connectToDatabase();
	// 	const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
	// 	const coll: mongoDB.Collection = db.collection(localUsers);
	// 	const result = await coll.insertOne(newUser);
	// 	await client.close();
	// 	res.status(200).send(result);
	// } catch (e) {
	// 	console.error(e);
	// }
});

app.listen(PORT, () => console.log("Listening on PORT", PORT));
