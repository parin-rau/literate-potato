import { Request, Response } from "express";
import * as commentsService from "../services/mongodb/comments";
import { UserRequest } from "../middleware/verifyToken";

export async function getTicketComments(
	req: Request | UserRequest,
	res: Response
) {
	const { ticketId } = req.params;
	const { user } = req as UserRequest;
	const { status, comments } = await commentsService.getTicketComments(
		ticketId,
		user
	);
	res.status(status).send(comments);
}

export async function createComment(req: Request, res: Response) {
	const comment = await req.body;
	const { user } = req as UserRequest;

	const { status } = await commentsService.createComment(comment, user);
	res.sendStatus(status);
}

export async function editComment(req: Request | UserRequest, res: Response) {
	const { id } = req.params;
	const patchData = await req.body;
	const { user } = req as UserRequest;

	const { status } = await commentsService.editComment(id, patchData, user);

	res.sendStatus(status);
}

export async function reactComment(req: Request | UserRequest, res: Response) {
	const { id: commentId, userId, action } = req.params;
	const { user } = req as UserRequest;

	const { status } = await commentsService.reactComment(
		commentId,
		userId,
		action,
		user
	);
	res.sendStatus(status);
}

export async function deleteComment(req: Request | UserRequest, res: Response) {
	const { id } = req.params;
	const { user } = req as UserRequest;

	const { status } = await commentsService.deleteComment(id, user);
	res.sendStatus(status);
}
