import "dotenv/config";
import { Request, Response } from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../server/mongodb";
import jwt from "jsonwebtoken";
import { UserDecode } from "../../types";
import { arraysEqual } from "../../utility/arrayComparisons";

const localUsers = process.env.LOCAL_USERS ?? "users";

export async function handleRefreshToken(req: Request, res: Response) {
	const cookies = req.cookies;
	console.log(cookies);
	if (!cookies?.refreshToken) return res.sendStatus(401);

	const refreshToken: string = cookies.refreshToken;

	const client: mongoDB.MongoClient = await connectToDatabase();
	const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
	const coll: mongoDB.Collection = db.collection(localUsers);
	const foundUser = await coll.findOne({ refreshToken });

	if (!foundUser) {
		await client.close();
		return res.sendStatus(403);
	}

	if (!process.env.REFRESH_JWT_SECRET || !process.env.ACCESS_JWT_SECRET) {
		await client.close();
		return res.sendStatus(500);
	}

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.REFRESH_JWT_SECRET
		) as UserDecode;

		if (
			foundUser.username !== decoded.username ||
			foundUser.userId !== decoded.userId ||
			!arraysEqual(foundUser.roles, decoded.roles)
		) {
			await client.close();
			return res.sendStatus(403);
		}

		const user = {
			username: decoded.username,
			userId: decoded.userId,
			roles: decoded.roles,
		};

		const accessToken = jwt.sign(user, process.env.ACCESS_JWT_SECRET, {
			expiresIn: "15s",
		});

		const rotatedRefreshToken = jwt.sign(
			user,
			process.env.REFRESH_JWT_SECRET,
			{ expiresIn: "1d" }
		);

		const addRefreshToken = await coll.updateOne(
			{ userId: user.userId },
			{ $set: { refreshToken: rotatedRefreshToken } }
		);

		await client.close();

		if (addRefreshToken.acknowledged) {
			return res
				.status(201)
				.cookie("refreshToken", rotatedRefreshToken, {
					httpOnly: true,
					sameSite: "none",
					secure: true,
					maxAge: 24 * 60 * 60 * 1000,
				})
				.json({ accessToken });
		} else {
			return res.status(500).send({ message: "Something went wrong" });
		}
	} catch (e) {
		return res.sendStatus(403);
	}
}
