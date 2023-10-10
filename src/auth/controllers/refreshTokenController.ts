//import "dotenv/config";
import { Request, Response } from "express";
// import * as mongoDB from "mongodb";
// import { connectToDatabase } from "../../db/mongodb";
// import jwt from "jsonwebtoken";
// import { UserDecode } from "../../types";
// import { arraysEqual } from "../../utility/arrayComparisons";
import * as refreshTokenService from "../services/mongodb/refreshToken";

//const localUsers = process.env.LOCAL_USERS ?? "users";

export async function handleRefreshToken(req: Request, res: Response) {
	const cookies = req.cookies;

	const { status, success, message, accessToken, cookie } =
		await refreshTokenService.generateToken(cookies);

	if (!success || !accessToken || !cookie) {
		return res.status(status).send(message);
	} else {
		return res
			.status(status)
			.cookie(cookie.name, cookie.val, cookie.options)
			.json({ accessToken });
	}

	// try {
	// 	const cookies = req.cookies;

	// 	if (!cookies?.refreshToken) return res.sendStatus(401);

	// 	const refreshToken: string = cookies.refreshToken;

	// 	const client: mongoDB.MongoClient = await connectToDatabase();
	// 	const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
	// 	const coll: mongoDB.Collection = db.collection(localUsers);
	// 	const foundUser = await coll.findOne({
	// 		$or: [{ refreshToken }, { gracePeriodToken: refreshToken }],
	// 	});

	// 	if (!foundUser) {
	// 		await client.close();
	// 		return res.sendStatus(403);
	// 	}

	// 	if (!process.env.REFRESH_JWT_SECRET || !process.env.ACCESS_JWT_SECRET) {
	// 		await client.close();
	// 		return res.sendStatus(500);
	// 	}

	// 	const decoded = jwt.verify(
	// 		refreshToken,
	// 		process.env.REFRESH_JWT_SECRET
	// 	) as UserDecode;

	// 	// const decodeToken = () => {
	// 	// 	if (!process.env.REFRESH_JWT_SECRET) return;
	// 	// 	try {
	// 	// 		const decoded = jwt.verify(
	// 	// 			refreshToken,
	// 	// 			process.env.REFRESH_JWT_SECRET
	// 	// 		) as UserDecode;
	// 	// 		return decoded;
	// 	// 	} catch (e1) {
	// 	// 		if (foundUser.gracePeriodEnd - Date.now() <= 0)
	// 	// 			return console.error(e1);

	// 	// 		console.log(foundUser.gracePeriodEnd - Date.now());

	// 	// 		try {
	// 	// 			const gracePeriodDecoded = jwt.verify(
	// 	// 				foundUser.gracePeriodToken,
	// 	// 				process.env.REFRESH_JWT_SECRET
	// 	// 			) as UserDecode;
	// 	// 			return gracePeriodDecoded;
	// 	// 		} catch (e2) {
	// 	// 			return console.error(e2);
	// 	// 		}
	// 	// 	}
	// 	// };

	// 	// const decoded = decodeToken();
	// 	// if (!decoded) return res.sendStatus(403);

	// 	// const decoded = jwt.verify(
	// 	// 	refreshToken,
	// 	// 	process.env.REFRESH_JWT_SECRET,
	// 	// 	(err, originalDecoded) => {
	// 	// 		if (err) {
	// 	// 			if (
	// 	// 				foundUser.gracePeriodEnd - Date.now() > 0 &&
	// 	// 				process.env.REFRESH_JWT_SECRET
	// 	// 			) {
	// 	// 				console.log(foundUser.gracePeriodEnd - Date.now());
	// 	// 				const gracePeriodDecoded = jwt.verify(
	// 	// 					foundUser.gracePeriodToken,
	// 	// 					process.env.REFRESH_JWT_SECRET
	// 	// 				);
	// 	// 				return gracePeriodDecoded;
	// 	// 			}
	// 	// 		}
	// 	// 		return originalDecoded;
	// 	// 	}
	// 	// );

	// 	if (
	// 		foundUser.username !== decoded.username ||
	// 		foundUser.userId !== decoded.userId ||
	// 		!arraysEqual(foundUser.roles, decoded.roles)
	// 	) {
	// 		await client.close();
	// 		return res.sendStatus(403);
	// 	}

	// 	const user = {
	// 		username: decoded.username,
	// 		userId: decoded.userId,
	// 		roles: decoded.roles,
	// 	};

	// 	const accessToken = jwt.sign(user, process.env.ACCESS_JWT_SECRET, {
	// 		expiresIn: "15s",
	// 	});

	// 	const rotatedRefreshToken = jwt.sign(
	// 		user,
	// 		process.env.REFRESH_JWT_SECRET,
	// 		{ expiresIn: "1d" }
	// 	);

	// 	const addRefreshToken = await coll.updateOne(
	// 		{ userId: user.userId },
	// 		{
	// 			$set: {
	// 				refreshToken: rotatedRefreshToken,
	// 				// gracePeriodToken: refreshToken,
	// 				// gracePeriodEnd: Date.now() + 10 * 1000,
	// 			},
	// 		}
	// 	);

	// 	await client.close();

	// 	if (addRefreshToken.acknowledged) {
	// 		return res
	// 			.status(201)
	// 			.cookie("refreshToken", rotatedRefreshToken, {
	// 				httpOnly: true,
	// 				sameSite: "lax",
	// 				secure: process.env.PROD ? true : false,
	// 				maxAge: 24 * 60 * 60 * 1000,
	// 			})
	// 			.json({ accessToken });
	// 	} else {
	// 		return res.status(500).send({ message: "Something went wrong" });
	// 	}
	// } catch (e) {
	// 	console.error(e);
	// 	return res.sendStatus(500);
	// }
}
