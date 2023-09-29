import express from "express";
import * as tickets from "../controllers/ticketsController";

export const ticketsRouter = express.Router();

ticketsRouter.get("/", tickets.getAllTickets);
ticketsRouter.get("/:id", tickets.getTicket);
ticketsRouter.get("/project/:projectId", tickets.getAllTicketsForProject);

ticketsRouter.post("/", tickets.createTicket);
ticketsRouter.post("/calendar", tickets.getTicketCountsForCalendar);

ticketsRouter.patch("/:id", tickets.updateTicket);
ticketsRouter.patch(
	"/project-edit/:projectId",
	tickets.updateTicketEditProject
);

ticketsRouter.delete("/:id", tickets.deleteTicket);
