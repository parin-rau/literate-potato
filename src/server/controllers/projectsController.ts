import { Request, Response } from "express";
import * as projectsService from "../services/mongodb/projects";

export async function getProject(req: Request, res: Response) {
	const { id } = req.params;
	const { status, success, project } = await projectsService.getProject(id);

	if (!success || !project) {
		res.sendStatus(status);
	} else {
		res.status(status).send(project);
	}
}

export async function getAllProjects(_req: Request, res: Response) {
	const { status, success, projects } =
		await projectsService.getAllProjects();

	if (!success || !projects) {
		return res.sendStatus(status);
	} else {
		return res.status(status).send(projects);
	}
}

export async function getProjectsByGroup(req: Request, res: Response) {
	const { groupId } = req.params;
	const { status, success, projects } =
		await projectsService.getProjectsByGroup(groupId);

	if (!success || !projects) {
		return res.sendStatus(status);
	} else {
		return res.status(status).send(projects);
	}
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
