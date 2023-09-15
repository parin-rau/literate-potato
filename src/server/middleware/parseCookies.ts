import { Request, Response, NextFunction } from "express";

export function parseCookies(req: Request, _res: Response, next: NextFunction) {
	if (!req.headers.cookie) return next();

	const cookieObj: Record<string, string> = {};
	const cookie = req.headers.cookie;
	const cookieSplit = cookie?.split("; ");
	const cookieMap = cookieSplit?.map((c) => c.split("="));

	if (!cookieMap) return;
	for (let i = 0; i < cookieMap?.length; i++) {
		const cookieLabel = cookieMap[i][0];
		const cookieValue = cookieMap[i][1];
		cookieObj[cookieLabel] = cookieValue;
	}
	req.cookies = cookieObj;
	next();
}
