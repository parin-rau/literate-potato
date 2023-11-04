import { Request, Response } from "express";
import * as refreshTokenService from "../services/mongodb/refreshToken";

export async function handleRefreshToken(req: Request, res: Response) {
	const cookies = req.cookies;

	const { status, success, message, accessToken, cookie } =
		await refreshTokenService.generateToken(cookies);

	if (!success || !accessToken || !cookie) {
		return res.status(status).send({ message });
	} else {
		return res
			.status(status)
			.cookie(cookie.name, cookie.val, cookie.options)
			.json({ accessToken });
	}
}
