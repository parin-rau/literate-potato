import "dotenv/config";
import { Request, Response } from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../server/mongodb";
import jwt from "jsonwebtoken";
import { UserDecode } from "../../types";

const localUsers = process.env.LOCAL_USERS ?? "users";

export async function handleRefreshToken(req: Request, res: Response) {
	const cookies = req.cookies;
	if (!cookies?.token) return res.sendStatus(401);

	const refreshToken: string = cookies.token;

	const client: mongoDB.MongoClient = await connectToDatabase();
	const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
	const coll: mongoDB.Collection = db.collection(localUsers);
	const foundUser = await coll.findOne({ refreshToken });
	await client.close();

	if (!foundUser) return res.sendStatus(403);

	if (!process.env.REFRESH_JWT_SECRET || !process.env.ACCESS_JWT_SECRET)
		return res.sendStatus(500);

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.REFRESH_JWT_SECRET
		) as UserDecode;
		if (foundUser.username !== decoded?.username)
			return res.sendStatus(403);

		const accessToken = jwt.sign(
			{ username: decoded?.username },
			process.env.ACCESS_JWT_SECRET,
			{ expiresIn: "30s" }
		);
		res.status(201).send({ accessToken });
	} catch (e) {
		return res.sendStatus(403);
	}
}
