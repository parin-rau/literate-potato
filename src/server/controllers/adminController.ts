import { Request, Response } from "express";
import * as adminService from "../services/mongodb/admin";
import { UserRequest } from "../middleware/verifyToken";

export async function getStats(req: Request | UserRequest, res: Response) {
	const { user } = req as UserRequest;
	const { status, data: stats } = await adminService.getStats(user);
	res.status(status).send(stats);
}

// export async function getTickets(req: Request | UserRequest, res: Response) {
// 	const { user } = req as UserRequest;
// 	const { status, tickets } = await adminService.getTickets(user);
// 	res.status(status).send(tickets);
// }

// export async function getProjects(req: Request | UserRequest, res: Response) {
// 	const { user } = req as UserRequest;
// 	const { status, projects } = await adminService.getProjects(user);
// 	res.status(status).send(projects);
// }

export async function getResource(req: Request | UserRequest, res: Response) {
	const { resourceType, resourceId } = req.params;
	const { user } = req as UserRequest;
	const { status, data } = await adminService.getResource(
		user,
		resourceType,
		resourceId
	);

	res.status(status).send(data);
}

export async function deleteResource(
	req: Request | UserRequest,
	res: Response
) {
	const { resourceType, resourceId } = req.params;
	const { user } = req as UserRequest;
	const { status, data: isDeleted } = await adminService.deleteResource(
		user,
		resourceType,
		resourceId
	);
	res.status(status).send({ isDeleted });
}
