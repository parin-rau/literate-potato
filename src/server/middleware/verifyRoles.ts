import { Request, Response, NextFunction } from "express";
import { UserToken } from "../../types";

interface UserRequest extends Request {
	user: UserToken;
}

export function verifyRoles(
	req: UserRequest,
	res: Response,
	next: NextFunction
) {
	const { roles } = req.user;

	if (!roles) return res.sendStatus(403);

	// if roles doesn't contain permission needed to view resource, then send 403
	// Consider placing middleware after service layer operates on db data / before layer for creating resources?

	next();
}
