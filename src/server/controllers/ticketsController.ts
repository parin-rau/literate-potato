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

export async function getAllTickets(req: Request, res: Response) {
	const { user } = req as UserRequest;
	const { status, tickets } = await ticketsService.getAllTickets(user);
	//if (!message) return res.status(status).send({data: tickets})

	res.status(status).send(tickets);
}

export async function getTicketsForUser(req: Request, res: Response) {
	const { userId, view } = req.params;

	let options: Options = undefined;
	if (view === "summary") {
		options = { limit: 8, sort: { field: "completion", direction: -1 } };
	}

	const { status, tickets } = await ticketsService.getTicketsForUser(
		userId,
		options
	);

	options
		? await ticketsService.getTicketsForUser(userId, options)
		: await ticketsService.getTicketsForUser(userId);

	res.status(status).send(tickets);
}

export async function getAllTicketsForProject(req: Request, res: Response) {
	const { projectId } = req.params;
	const { user } = req as UserRequest;
	const { status, tickets } = await ticketsService.getAllTicketsForProject(
		projectId,
		user
	);
	res.status(status).send(tickets);
}

export async function getUncategorizedForGroup(req: Request, res: Response) {
	const { groupId } = req.params;
	const { user } = req as UserRequest;
	const { status, tickets } = await ticketsService.getUncategorizedForGroup(
		groupId,
		user
	);
	res.status(status).send(tickets);
}

export async function getUncategorizedForUser(req: Request, res: Response) {
	const { userId } = req.params;
	const { status, tickets } =
		await ticketsService.getUncategorizedForUser(userId);
	res.status(status).send(tickets);
}

export async function getTicketCountsForCalendar(req: Request, res: Response) {
	const dateRange: string[] = await req.body;
	const { status, countedDates } =
		await ticketsService.getTicketCountsForCalendar(dateRange);
	res.status(status).send(countedDates);
}

export async function createTicket(req: Request, res: Response) {
	const partialNewTicket: TicketData = await req.body;
	const { status, ticketNumber } =
		await ticketsService.createTicket(partialNewTicket);
	res.status(status).json({ ticketNumber });
}

export async function updateTicket(req: Request, res: Response) {
	const { id } = req.params;
	const { data, meta } = await req.body;
	const { status } = await ticketsService.updateTicket(id, data, meta);
	res.sendStatus(status);
}

export async function updateTicketEditProject(req: Request, res: Response) {
	const { projectId } = req.params;
	const data = await req.body;
	const { status } = await ticketsService.updateTicketEditProject(
		projectId,
		data
	);
	res.sendStatus(status);
}

export async function deleteTicket(req: Request, res: Response) {
	const { id } = req.params;
	const { status } = await ticketsService.deleteTicket(id);
	res.sendStatus(status);
}
