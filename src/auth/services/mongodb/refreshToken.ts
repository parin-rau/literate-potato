import "dotenv/config";
import { CookieOptions } from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import jwt from "jsonwebtoken";
import { UserDecode } from "../../../types";
import { arraysEqual } from "../../../utility/arrayComparisons";

const localUsers = process.env.LOCAL_USERS ?? "users";

export async function generateToken(cookies: Record<string, string>) {
	const res: {
		status: number;
		success: boolean;
		message?: string;
		accessToken?: string;
		cookie?: { name: string; val: string; options: CookieOptions };
	} = {
		status: 500,
		success: false,
	};

	if (!cookies.refreshToken) {
		res.status = 401;
		return res;
	}

	const refreshToken = cookies.refreshToken;
	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localUsers);

		const foundUser = await coll.findOne({
			$or: [{ refreshToken }, { gracePeriodToken: refreshToken }],
		});

		if (!foundUser) {
			await client.close();
			res.status = 403;
			return res;
		}

		if (!process.env.REFRESH_JWT_SECRET || !process.env.ACCESS_JWT_SECRET) {
			await client.close();
			return res;
		}

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
			res.status = 403;
			return res;
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
			{
				$set: {
					refreshToken: rotatedRefreshToken,
				},
			}
		);

		await client.close();

		if (addRefreshToken.acknowledged) {
			res.status = 201;
			res.success = addRefreshToken.acknowledged;
			res.accessToken = accessToken;
			res.cookie = {
				name: "refreshToken",
				val: rotatedRefreshToken,
				options: {
					httpOnly: true,
					sameSite: "lax",
					secure: process.env.PROD ? true : false,
					maxAge: 24 * 60 * 60 * 1000,
				},
			};
			return res;
		} else {
			res.message = "Something went wrong";
			return res;
		}
	} catch (e) {
		console.error(e);
		res.message = "Something went wrong";
		return res;
	}
}
