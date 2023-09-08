import "dotenv/config";
import express from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../server/mongodb";
import { formatRegistration, validateLogin } from "./userValidation";
import { Login } from "../types";

const PORT = 4002;

const localUsers = process.env.LOCAL_USERS ?? "users";

const app = express();

app.use(express.json());

app.post("/auth/register", async (req, res) => {
	const data: {
		kind: "register";
		form: { username: string; email: string; password: string };
	} = await req.body;

	if (data.kind !== "register") {
		res.status(400).send("Not a registration request");
		return;
	}

	const client: mongoDB.MongoClient = await connectToDatabase();
	const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
	const coll: mongoDB.Collection = db.collection(localUsers);
	const isNewUser =
		(await coll.countDocuments({
			$or: [{ username: data.form.username }, { email: data.form.email }],
		})) === 0;

	const newUserData = await formatRegistration(data);

	if (isNewUser && newUserData) {
		try {
			const result = await coll.insertOne(newUserData);
			await client.close();
			res.status(200).send(result);
		} catch (e) {
			console.error(e);
		}
	} else {
		await client.close();
		res.status(400).send("Unable to register new user");
	}
});

app.post("/auth/login", async (req, res) => {
	try {
		const data: { kind: "login"; form: Login } = await req.body;

		if (data.kind !== "login") {
			res.status(400).send("Not a login request");
			return;
		}

		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localUsers);

		const storedUser = await coll.findOne({ username: data.form.username });
		await client.close();

		if (storedUser) {
			const result = await validateLogin(data, storedUser.password);
			console.log(result);
			res.status(200).send(result);
		}
	} catch (e) {
		console.error(e);
	}
});

app.listen(PORT, () => console.log("Listening on PORT", PORT));
