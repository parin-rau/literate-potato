import { Response, Request } from "express";
import * as notificationsService from "../services/mongodb/notifications";
import { UserRequest } from "../middleware/verifyToken";

export async function getNotificationsByUser(
	req: Request | UserRequest,
	res: Response
) {
	const { userId, filter } = req.params;
	const { user } = req as UserRequest;

	const { status, notifications } =
		await notificationsService.getNotificationsByUser(userId, user, filter);

	res.status(status).send(notifications);
}

export async function patchNotification(
	req: Request | UserRequest,
	res: Response
) {
	const { id } = req.params;
	const { user } = req as UserRequest;
	const { patch } = await req.body;

	const { status } = await notificationsService.patchNotification(
		id,
		user,
		patch
	);

	res.sendStatus(status);
}
