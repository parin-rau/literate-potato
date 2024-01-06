import { Request, Response } from "express";
import * as groupsService from "../services/mongodb/groups";
import { UserRequest } from "../middleware/verifyToken";

export async function getGroup(req: Request, res: Response) {
	const { id } = req.params;
	const { status, group } = await groupsService.getGroup(id);
	res.status(status).send(group);
}

export async function getAllGroups(_req: Request, res: Response) {
	const { status, groups } = await groupsService.getAllGroups();
	res.status(status).send(groups);
}

export async function getGroupsByUserId(req: Request, res: Response) {
	const { userId } = req.params;
	const { status, groups } = await groupsService.getGroupsByUserId(userId);
	res.status(status).send(groups);
}

export async function createGroup(req: Request, res: Response) {
	const data = await req.body;
	const { status } = await groupsService.createGroup(data);
	res.sendStatus(status);
}

export async function updateGroup(req: Request, res: Response) {
	const { id } = req.params;
	const data = await req.body;
	const { status } = await groupsService.updateGroup(id, data);
	res.sendStatus(status);
}

export async function joinGroup(req: Request | UserRequest, res: Response) {
	const { groupId, userId, action } = req.params;
	const { user } = req as UserRequest;

	if (
		action !== "join" &&
		action !== "leave" &&
		action !== "request" &&
		action !== "deny"
	) {
		return res.sendStatus(400);
	}

	const { status, message } = await groupsService.joinGroup(
		groupId,
		userId,
		action,
		user
	);
	res.status(status).json(message);
}

export async function deleteGroup(req: Request | UserRequest, res: Response) {
	const { id } = req.params;
	const { user } = req as UserRequest;
	const { status } = await groupsService.deleteGroup(id, user);
	res.sendStatus(status);
}
