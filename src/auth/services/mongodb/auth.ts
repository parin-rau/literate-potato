import { CookieOptions } from "express";
import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import {
	formatRegistration,
	hashPassword,
	validateLogin,
	validatePassword,
} from "../../userValidation";
import { Login, UserToken, Register, User } from "../../../types";
import jwt from "jsonwebtoken";
import * as EmailValidator from "email-validator";

const localUsers = process.env.LOCAL_USERS ?? "users";

export async function registerUser(data: { kind: "register"; form: Register }) {
	const res: { status: number; success: boolean; message?: string } = {
		status: 500,
		success: false,
	};

	if (data.kind !== "register") {
		res.status = 400;
		res.message = "Not a registration request";
		return res;
	}

	const isValidEmail = EmailValidator.validate(data.form.email);
	if (!isValidEmail) {
		res.status = 401;
		res.message = "Invalid email address format";
		return res;
	}

	if (data.form.password !== data.form.passwordConfirm) {
		res.status = 401;
		res.message = "Passwords do not match";
		return res;
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

			res.status = 201;
			res.message = "Registered new user";
			res.success = result.acknowledged;
			return res;
		} catch (e) {
			console.error(e);
			res.status = 401;
			res.message = "Unable to register new user";
			return res;
		}
	} else {
		await client.close();
		res.status = 401;
		res.message = "Username or email already registered";
		return res;
	}
}

export async function loginUser(data: { kind: "login"; form: Login }) {
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

	try {
		if (data.kind !== "login") {
			res.status = 400;
			res.message = "Not a login request";
			return res;
		}

		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localUsers);

		const storedUser = await coll.findOne({ username: data.form.username });

		if (!storedUser) {
			await client.close();

			res.status = 401;
			res.message = "Incorrect username or password";
			return res;
		}

		const userVerified = await validateLogin(data, storedUser.password);

		if (!userVerified) {
			res.status = 401;
			res.message = "Incorrect username or password";
			return res;
		}

		if (!process.env.ACCESS_JWT_SECRET || !process.env.REFRESH_JWT_SECRET) {
			res.status = 500;
			res.message = "Missing secrets";
			return res;
		}

		const user: UserToken = {
			username: storedUser.username,
			userId: storedUser.userId,
			roles: storedUser.roles,
		};
		const accessToken = jwt.sign(user, process.env.ACCESS_JWT_SECRET, {
			expiresIn: "15s",
		});
		const refreshToken = jwt.sign(user, process.env.REFRESH_JWT_SECRET, {
			expiresIn: "1d",
		});

		const addRefreshToken = await coll.updateOne(
			{ userId: storedUser.userId },
			{ $set: { refreshToken } }
		);

		await client.close();

		if (addRefreshToken.acknowledged) {
			res.status = 200;
			res.success = addRefreshToken.acknowledged;
			res.accessToken = accessToken;
			res.cookie = {
				name: "refreshToken",
				val: refreshToken,
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
		return res;
	}
}

export async function logoutUser(cookies: Record<string, unknown>) {
	const res: {
		status: number;
		success: boolean;
		clearCookie: { name: string; options: CookieOptions };
	} = {
		status: 500,
		success: false,
		clearCookie: {
			name: "refreshToken",
			options: {
				httpOnly: true,
				sameSite: "lax",
				secure: process.env.PROD ? true : false,
				maxAge: 24 * 60 * 60 * 1000,
			},
		},
	};

	if (!cookies) {
		res.status = 204;
		res.success = true;
		return res;
	}

	if (!("refreshToken" in cookies) || !cookies.refreshToken) {
		res.status = 204;
		res.success = true;
		return res;
	}

	const refreshToken = cookies.refreshToken;

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localUsers);
		const foundUser = await coll.findOne({ refreshToken });

		if (!foundUser) {
			await client.close();

			res.status = 204;
			return res;
		}

		const updateUser = await coll.updateOne(
			{ refreshToken },
			{
				$unset: {
					refreshToken: "",
					gracePeriodToken: "",
					gracePeriodEnd: "",
				},
			}
		);
		await client.close();

		res.status = 204;
		res.success = updateUser.acknowledged;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function changeUsername(data: {
	username: string;
	userId: string;
}) {
	const res: { status: number; success: boolean; message: string } = {
		status: 500,
		success: false,
		message: "Something went wrong",
	};
	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection<User>(localUsers);

		const isExistingUsername =
			(await coll.countDocuments({ username: data.username })) > 0;
		if (isExistingUsername) {
			res.status = 403;
			res.message = "Username already taken";
			return res;
		}

		const updateUser = await coll.updateOne(
			{ userId: data.userId },
			{ $set: { username: data.username } }
		);

		res.status = 200;
		res.success = updateUser.acknowledged;
		res.message = `Username updated to "${data.username}"`;
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}

export async function changePassword({
	userId,
	currentPassword,
	newPassword,
	confirmPassword,
}: {
	userId: string;
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
}) {
	const res: { status: number; success: boolean; message: string } = {
		status: 500,
		success: false,
		message: "Something went wrong",
	};

	if (newPassword !== confirmPassword) {
		res.status = 403;
		res.message = "Both new password fields must match";
		return res;
	}

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection<User>(localUsers);

		const passwordMatch = await coll
			.findOne({ userId })
			.then((u) => validatePassword(currentPassword, u?.password));

		if (!passwordMatch) {
			res.status = 403;
			res.message = "Incorrect current password";
			return res;
		}

		const hashed = await hashPassword(newPassword);
		const updateUser = await coll.updateOne(
			{ userId },
			{ $set: { password: hashed } }
		);

		res.status = 200;
		res.success = updateUser.acknowledged;
		res.message = "Password updated successfully";
		return res;
	} catch (e) {
		console.error(e);
		return res;
	}
}
