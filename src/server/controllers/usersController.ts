import { Request, Response } from "express";
import * as usersService from "../services/mongodb/users";

export async function getUserById(req: Request, res: Response) {
	const { id } = req.params;
	const { status, user } = await usersService.getUserById(id);
	res.status(status).json(user);
}

export async function getUsersByGroup(req: Request, res: Response) {
	const { groupId } = req.params;
	const { status, users } = await usersService.getUsersByGroup(groupId);
	res.status(status).json(users);
}

export async function updateUser(req: Request, res: Response) {
	const { id } = req.params;
	const patchData = await req.body;
	const { status } = await usersService.updateUser(id, patchData);
	res.sendStatus(status);
}

export async function deleteUser(req: Request, res: Response) {
	const { id } = req.params;
	const { status } = await usersService.deleteUser(id);
	res.sendStatus(status);
}
