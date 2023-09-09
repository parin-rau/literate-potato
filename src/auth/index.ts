import "dotenv/config";
import express from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../server/mongodb";
import { formatRegistration, validateLogin } from "./userValidation";
import { Login, UserToken } from "../types";
import jwt from "jsonwebtoken";

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
		res.status(400).send({ message: "Not a registration request" });
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
			res.status(401).send({ message: "Unable to register new user" });
		}
	} else {
		await client.close();
		res.status(401).send({ message: "Username or email already taken" });
	}
});

app.post("/auth/login", async (req, res) => {
	try {
		const data: { kind: "login"; form: Login } = await req.body;

		if (data.kind !== "login") {
			res.status(400).send({ message: "Not a login request" });
			return;
		}

		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localUsers);

		const storedUser = await coll.findOne({ username: data.form.username });
		console.log(storedUser);

		if (storedUser) {
			const userVerified = await validateLogin(data, storedUser.password);
			console.log(userVerified);

			if (
				userVerified &&
				process.env.ACCESS_JWT_SECRET &&
				process.env.REFRESH_JWT_SECRET
			) {
				const user: UserToken = {
					username: storedUser.username,
					userId: storedUser.userId,
					roles: storedUser.roles,
				};
				const accessToken = jwt.sign(
					user,
					process.env.ACCESS_JWT_SECRET,
					{
						expiresIn: "15s",
					}
				);
				const refreshToken = jwt.sign(
					user,
					process.env.REFRESH_JWT_SECRET,
					{ expiresIn: "1d" }
				);

				const addRefreshToken = await coll.updateOne(
					{ userId: storedUser.userId },
					{ $set: { refreshToken } }
				);

				await client.close();
				if (addRefreshToken.acknowledged) {
					return res
						.status(200)
						.cookie("token", refreshToken, {
							httpOnly: true,
						})
						.json({ accessToken });
				} else {
					return res.sendStatus(500);
				}
			}
		} else {
			await client.close();
			return res
				.status(401)
				.set("Content-Type", "application/json")
				.send({ message: "Incorrect username or password" });
		}
	} catch (e) {
		console.error(e);
	}
});

app.get("/auth/logout", async (req, res) => {
	return res.clearCookie("token").status(200).send("Logging out");
});

app.listen(PORT, () => console.log("Listening on PORT", PORT));
