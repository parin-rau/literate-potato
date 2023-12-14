import { Request, Response } from "express";
import { TicketData } from "../../types";
import * as ticketsService from "../services/mongodb/tickets";
import { UserRequest } from "../middleware/verifyToken";

type Options =
	| {
			limit: number;
			sort: { field: string; direction: 1 | -1 };
	  }
	| undefined;

export async function getTicket(req: Request | UserRequest, res: Response) {
	const { id } = req.params;
	const { user } = req as UserRequest;
	const { status, ticket } = await ticketsService.getTicket(id, user);

	//if (!message) return res.status(status).send({data: ticket});
	res.status(status).send(ticket);
}

export async function getAllTickets(req: Request | UserRequest, res: Response) {
	const { user } = req as UserRequest;
	const { status, tickets } = await ticketsService.getAllTickets(user);
	//if (!message) return res.status(status).send({data: tickets})

	res.status(status).send(tickets);
}

export async function getTicketsForUser(
	req: Request | UserRequest,
	res: Response
) {
	const { userId: targetId, view } = req.params;
	const { user } = req as UserRequest;

	let options: Options = undefined;
	if (view === "summary") {
		options = { limit: 8, sort: { field: "completion", direction: -1 } };
	}

	const { status, tickets } = options
		? await ticketsService.getTicketsForUser(targetId, user, options)
		: await ticketsService.getTicketsForUser(targetId, user);

	// options
	// 	? await ticketsService.getTicketsForUser(userId, options)
	// 	: await ticketsService.getTicketsForUser(userId);

	res.status(status).send(tickets);
}

export async function getAllTicketsForProject(
	req: Request | UserRequest,
	res: Response
) {
	const { projectId } = req.params;
	const { user } = req as UserRequest;
	const { status, tickets } = await ticketsService.getAllTicketsForProject(
		projectId,
		user
	);
	res.status(status).send(tickets);
}

export async function getUncategorizedForGroup(
	req: Request | UserRequest,
	res: Response
) {
	const { groupId } = req.params;
	const { user } = req as UserRequest;
	const { status, tickets } = await ticketsService.getUncategorizedForGroup(
		groupId,
		user
	);
	res.status(status).send(tickets);
}

export async function getUncategorizedForUser(
	req: Request | UserRequest,
	res: Response
) {
	const { user } = req as UserRequest;
	const { userId: targetId } = req.params;
	const { status, tickets } = await ticketsService.getUncategorizedForUser(
		targetId,
		user
	);
	res.status(status).send(tickets);
}

export async function getTicketCountsForCalendar(
	req: Request | UserRequest,
	res: Response
) {
	const { user } = req as UserRequest;
	const { filterKind, filterId } = req.params;
	const dateRange: string[] = await req.body;
	const { status, countedDates } =
		await ticketsService.getTicketCountsForCalendar(
			user,
			dateRange,
			filterKind,
			filterId
		);
	res.status(status).send(countedDates);
}

export async function createTicket(req: Request | UserRequest, res: Response) {
	const { user } = req as UserRequest;
	const partialNewTicket: TicketData = await req.body;
	const { status, ticketNumber } = await ticketsService.createTicket(
		partialNewTicket,
		user
	);
	res.status(status).json({ ticketNumber });
}

export async function updateTicket(req: Request | UserRequest, res: Response) {
	const { user } = req as UserRequest;
	const { id } = req.params;
	const { data, meta } = await req.body;
	const { status } = await ticketsService.updateTicket(id, data, user, meta);
	res.sendStatus(status);
}

export async function updateTicketEditProject(
	req: Request | UserRequest,
	res: Response
) {
	const { user } = req as UserRequest;
	const { projectId } = req.params;
	const data = await req.body;
	const { status } = await ticketsService.updateTicketEditProject(
		projectId,
		data,
		user
	);
	res.sendStatus(status);
}

export async function deleteTicket(req: Request | UserRequest, res: Response) {
	const { user } = req as UserRequest;
	const { id } = req.params;
	const { status } = await ticketsService.deleteTicket(id, user);
	res.sendStatus(status);
}
