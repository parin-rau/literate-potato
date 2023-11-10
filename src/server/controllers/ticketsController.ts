import { Request, Response } from "express";
import { TicketData } from "../../types";
import * as ticketsService from "../services/mongodb/tickets";

export async function getTicket(req: Request, res: Response) {
	const { id } = req.params;
	const { status, ticket } = await ticketsService.getTicket(id);
	res.status(status).send(ticket);
}

export async function getAllTickets(_req: Request, res: Response) {
	const { status, tickets } = await ticketsService.getAllTickets();
	res.status(status).send(tickets);
}

export async function getAllTicketsForUser(req: Request, res: Response) {
	const { userId } = req.params;
	const { status, tickets } =
		await ticketsService.getAllTicketsForUser(userId);
	res.status(status).send(tickets);
}

export async function getAllTicketsForProject(req: Request, res: Response) {
	const { projectId } = req.params;
	const { status, tickets } =
		await ticketsService.getAllTicketsForProject(projectId);
	res.status(status).send(tickets);
}

export async function getUncategorizedForGroup(req: Request, res: Response) {
	const { groupId } = req.params;
	const { status, tickets } =
		await ticketsService.getUncategorizedForGroup(groupId);
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
	const data = await req.body;
	console.log(data);
	const { status } = await ticketsService.updateTicket(id, data);
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
