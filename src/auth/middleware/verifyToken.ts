import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

interface UserReq extends Request {
	username: string;
}

export function verifyToken(req: UserReq, res: Response, next: NextFunction) {
	console.log(req.headers);
	const authHeader = req.headers["authorization"];
	if (!authHeader) return res.sendStatus(401);
	console.log(authHeader);

	if (!process.env.ACCESS_JWT_SECRET) {
		return res.sendStatus(401);
	}

	const token = authHeader.split(" ")[1];
	jwt.verify(token, process.env.ACCESS_JWT_SECRET, (err, decoded) => {
		if (err) return res.sendStatus(403);
		req.username = decoded?.username;
		next();
	});
}
