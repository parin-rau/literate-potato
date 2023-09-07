import { User } from "../types";
import { hash, compare } from "../utility/hash";
import { v4 as uuidv4 } from "uuid";

type Data = {
	kind: "register" | "login";
	username: string;
	email: string;
	password: string;
};

export async function validateRegistrationInfo(data: Data) {
	const { kind, password, ...details } = data;
	if (kind !== "register" && kind !== "login") {
		return;
	} else {
		const hashPass = await hash(password);

		const user: User = {
			...details,
			password: hashPass,
			userId: uuidv4(),
			timestamp: Date.now(),
			roles: [1],
		};

		console.log("registration request received on auth server", user);
		return user;
	}
}

export async function validateLoginInfo(data: Data) {
	const { kind, password } = data;

	if (kind !== "login") {
		return;
	} else {
		const hashPass = ""; // Lookup hash from db and compare against raw input
		const hashCompare = await compare(password, hashPass);

		console.log("log in request received on auth server", hashCompare);
		return hashCompare;
	}
}
