import { Request, Response } from "express";
import * as projectsService from "../services/mongodb/projects";
import { UserRequest } from "../middleware/verifyToken";

export async function getProject(req: Request | UserRequest, res: Response) {
	const { id } = req.params;
	const { user } = req as UserRequest;
	const { status, project } = await projectsService.getProject(id, user);

	res.status(status).send(project);

	// if (!success || !project) {
	// 	res.sendStatus(status);
	// } else {
	// 	res.status(status).send(project);
	// }
}

export async function getAllProjects(
	req: Request | UserRequest,
	res: Response
) {
	const { user } = req as UserRequest;
	const { status, projects } = await projectsService.getAllProjects(user);

	res.status(status).send(projects);

	// if (!success || !projects) {
	// 	return res.sendStatus(status);
	// } else {
	// 	return res.status(status).send(projects);
	// }
}

export async function getProjectsByUser(req: Request, res: Response) {
	const { userId } = req.params;
	const { status, projects } =
		await projectsService.getProjectsByUser(userId);
	return res.status(status).send(projects);
}

export async function getProjectsByGroup(
	req: Request | UserRequest,
	res: Response
) {
	const { groupId } = req.params;
	const { user } = req as UserRequest;
	const { status, projects } = await projectsService.getProjectsByGroup(
		groupId,
		user
	);

	res.status(status).send(projects);

	// if (!success || !projects) {
	// 	return res.sendStatus(status);
	// } else {
	// 	return res.status(status).send(projects);
	// }
}

export async function createProject(req: Request, res: Response) {
	const newProject = await req.body;
	const { status } = await projectsService.createProject(newProject);

	return res.sendStatus(status);
}

export async function updateProject(req: Request, res: Response) {
	const { id } = req.params;
	const data:
		| {
				operation: "add" | "delete";
				newTaskStatus?: string;
				tasksCompletedIds?: string[];
				tasksTotalIds?: string[];
				subtasksCompletedIds?: string[];
				subtasksTotalIds?: string[];
		  }
		| {
				operation: "metadata";
				metadata: {
					[key: string]: string | number;
				};
		  } = await req.body;

	const { status, message } = await projectsService.updateProject(id, data);

	return res.status(status).send(message);
}

export async function deleteProject(req: Request, res: Response) {
	const { id } = req.params;
	const { status } = await projectsService.deleteProject(id);
	res.sendStatus(status);
}
