import { Request, Response } from "express";
import * as commentsService from "../services/mongodb/comments";

export async function getTicketComments(req: Request, res: Response) {
	const { ticketId } = req.params;
	const { status, comments } =
		await commentsService.getTicketComments(ticketId);
	res.status(status).send(comments);
}

export async function createComment(req: Request, res: Response) {
	const comment = await req.body;
	const { status } = await commentsService.createComment(comment);
	res.sendStatus(status);
}

export async function editComment(req: Request, res: Response) {
	const { id } = req.params;
	const patchData = await req.body;

	const { status } = await commentsService.editComment(id, patchData);

	res.sendStatus(status);
}

export async function reactComment(req: Request, res: Response) {
	const { id: commentId, userId, action } = req.params;
	const { status } = await commentsService.reactComment(
		commentId,
		userId,
		action
	);
	res.sendStatus(status);
}

export async function deleteComment(req: Request, res: Response) {
	const { id } = req.params;
	const { status } = await commentsService.deleteComment(id);
	res.sendStatus(status);
}
