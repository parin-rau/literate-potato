import { Request, Response } from "express";
import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../server/mongodb";
import { formatRegistration, validateLogin } from "../userValidation";
import { Login, UserToken } from "../../types";
import jwt from "jsonwebtoken";

const localUsers = process.env.LOCAL_USERS ?? "users";

export async function createNewUser(req: Request, res: Response) {
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
}

export async function loginUser(req: Request, res: Response) {
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

		if (storedUser) {
			const userVerified = await validateLogin(data, storedUser.password);

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
						expiresIn: "30s",
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
						.cookie("refreshToken", refreshToken, {
							httpOnly: true,
							sameSite: "none",
							secure: true,
							maxAge: 24 * 60 * 60 * 1000,
						})
						.json({ accessToken, user });
				} else {
					return res
						.status(500)
						.send({ message: "Something went wrong" });
				}
			}
		} else {
			await client.close();
			return res
				.status(401)
				.send({ message: "Incorrect username or password" });
		}
	} catch (e) {
		console.error(e);
	}
}

export async function logoutUser(req: Request, res: Response) {
	const cookies = req.cookies;

	if (!cookies.refreshToken) return res.sendStatus(204);
	const refreshToken = cookies.refreshToken;

	const client: mongoDB.MongoClient = await connectToDatabase();
	const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
	const coll: mongoDB.Collection = db.collection(localUsers);
	const foundUser = await coll.findOne({ refreshToken });

	if (!foundUser) {
		await client.close();
		return res
			.clearCookie("refreshToken", {
				httpOnly: true,
				sameSite: "none",
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			})
			.sendStatus(204);
	}

	await coll.updateOne({ refreshToken }, { $unset: { refreshToken: "" } });
	await client.close();

	return res
		.clearCookie("refreshToken", {
			httpOnly: true,
			sameSite: "none",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		})
		.sendStatus(204);
}
