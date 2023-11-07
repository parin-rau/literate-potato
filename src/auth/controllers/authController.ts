import { Request, Response } from "express";
import { Login, Register } from "../../types";
import * as authService from "../services/mongodb/auth";
import * as refreshTokenService from "../services/mongodb/refreshToken";

export async function createNewUser(req: Request, res: Response) {
	const data: {
		kind: "register";
		form: Register;
	} = await req.body;

	const { status, message } = await authService.registerUser(data);

	return res.status(status).send({ message });
}

export async function loginUser(req: Request, res: Response) {
	const data: { kind: "login"; form: Login } = await req.body;

	const { status, success, message, accessToken, cookie } =
		await authService.loginUser(data);

	if (!success || !accessToken || !cookie) {
		return res.status(status).json({ message });
	} else {
		return res
			.status(status)
			.cookie(cookie.name, cookie.val, cookie.options)
			.json({ accessToken });
	}
}

export async function logoutUser(req: Request, res: Response) {
	const cookies = req.cookies;

	const { status, clearCookie } = await authService.logoutUser(cookies);

	return res
		.clearCookie(clearCookie.name, clearCookie.options)
		.sendStatus(status);
}

export async function changeUsername(req: Request, res: Response) {
	const patch = await req.body;
	const { cookies } = req;
	const { status: authStatus, message: authMessage } =
		await authService.changeUsername(patch);

	if (authStatus !== 200)
		return res.status(authStatus).send({ message: authMessage });

	const { status, success, message, accessToken, cookie } =
		await refreshTokenService.generateToken(cookies, patch.username);

	if (!success || !accessToken || !cookie) {
		return res.status(status).send({ message });
	} else {
		return res
			.status(authStatus)
			.cookie(cookie.name, cookie.val, cookie.options)
			.send({ accessToken, message: authMessage });
	}
}

export async function changePassword(req: Request, res: Response) {
	const patch = await req.body;
	const { cookies } = req;
	const { status: authStatus, message: authMessage } =
		await authService.changePassword(patch);
	if (authStatus !== 200)
		return res.status(authStatus).send({ message: authMessage });

	const { status, success, message, accessToken, cookie } =
		await refreshTokenService.generateToken(cookies);

	if (!success || !accessToken || !cookie) {
		return res.status(status).send({ message });
	} else {
		return res
			.status(authStatus)
			.cookie(cookie.name, cookie.val, cookie.options)
			.send({ accessToken, message: authMessage });
	}
}
