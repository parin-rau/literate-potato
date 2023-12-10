import { Request, Response } from "express";
import * as projectsService from "../services/mongodb/projects";
import { UserRequest } from "../middleware/verifyToken";

type Options =
	| { limit: number; sort: { field: string; direction: 1 | -1 } }
	| undefined;

export async function getProject(req: Request | UserRequest, res: Response) {
	const { id } = req.params;
	const { user } = req as UserRequest;
	const { status, project } = await projectsService.getProject(id, user);

	res.status(status).send(project);
}

export async function getAllProjects(
	req: Request | UserRequest,
	res: Response
) {
	const { user } = req as UserRequest;
	const { status, projects } = await projectsService.getAllProjects(user);

	res.status(status).send(projects);
}

export async function getProjectsByUser(req: Request, res: Response) {
	const { userId, view } = req.params;

	let options: Options = undefined;
	if (view === "summary") {
		options = { limit: 8, sort: { field: "completion", direction: -1 } };
	}

	const { status, projects } = await projectsService.getProjectsByUser(
		userId,
		options
	);
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
