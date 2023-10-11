import { Request, Response } from "express";
import * as groupsService from "../services/mongodb/groups";

export async function getGroup(req: Request, res: Response) {
	const { id } = req.params;
	const { status, group } = await groupsService.getGroup(id);
	res.status(status).send(group);
}

export async function getAllGroups(_req: Request, res: Response) {
	const { status, groups } = await groupsService.getAllGroups();
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

export async function deleteGroup(req: Request, res: Response) {
	const { id } = req.params;
	const { status } = await groupsService.deleteGroup(id);
	res.sendStatus(status);
}
