import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hash(pass: string) {
	const result = await bcrypt.hash(pass, saltRounds);
	return result;
}

export async function compare(pass: string, hash: string) {
	const result = await bcrypt.compare(pass, hash);
	return result;
}
