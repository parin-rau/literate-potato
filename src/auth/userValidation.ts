import { Login, Register, User } from "../types";
import { hash, compare } from "bcrypt";
import { v4 as uuidv4 } from "uuid";

type RegisterData = {
	kind: "register";
	form: Omit<Register, "passwordConfirm">;
};
type LoginData = {
	kind: "login";
	form: Login;
};

const saltRounds = 10;

export async function formatRegistration(data: RegisterData) {
	const { kind } = data;
	if (kind === "register") {
		const { form } = data;
		const { username, email, password } = form;
		const hashPass = await hash(password, saltRounds);

		const user: User = {
			username,
			email,
			password: hashPass,
			userId: uuidv4(),
			timestamp: Date.now(),
			roles: [1],
		};

		return user;
	}
}

export async function validateLogin(data: LoginData, hashPass: string) {
	const { kind, form } = data;
	if (kind === "login") {
		const hashCompare = await compare(form.password, hashPass);
		return hashCompare;
	}
}
