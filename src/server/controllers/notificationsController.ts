import { Response, Request } from "express";
import * as notificationsService from "../services/mongodb/notifications";
import { UserRequest } from "../middleware/verifyToken";
import { NoticeEntry } from "../../types";

export async function getNotificationsByUser(
	req: Request | UserRequest,
	res: Response
) {
	const { userId, filter } = req.params;
	const { user } = req as UserRequest;

	const { status, data } = await notificationsService.getNotificationsByUser(
		userId,
		user,
		filter
	);

	res.status(status).send(data);
}

export async function createNotification(
	req: Request | UserRequest,
	res: Response
) {
	const notice: NoticeEntry = await req.body;
	const { user } = req as UserRequest;

	const { status } = await notificationsService.createNotification(
		notice,
		user
	);

	res.sendStatus(status);
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

export async function deleteNotification(
	req: Request | UserRequest,
	res: Response
) {
	// Admin permission only

	const { id } = req.params;
	const { user } = req as UserRequest;

	const { status } = await notificationsService.deleteNotification(id, user);

	res.sendStatus(status);
}
