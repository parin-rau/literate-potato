import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import { UserDecode, UserToken } from "../../types";

interface UserRequest extends Request {
	user: UserToken;
}

export function verifyToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"];

	if (!authHeader || !process.env.ACCESS_JWT_SECRET)
		return res.sendStatus(401);

	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403);
		const decodedUser: UserToken = {
			username: (decoded as UserDecode).username,
			userId: (decoded as UserDecode).userId,
			roles: (decoded as UserDecode).roles,
		};

		(req as UserRequest).user = decodedUser;
		next();
	});
}
