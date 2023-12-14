import express from "express";
import * as tickets from "../controllers/ticketsController";

export const ticketsRouter = express.Router();

ticketsRouter.get("/", tickets.getAllTickets);
ticketsRouter.get("/:id", tickets.getTicket);
ticketsRouter.get("/user/:userId/:view?", tickets.getTicketsForUser);
ticketsRouter.get("/project/:projectId", tickets.getAllTicketsForProject);
ticketsRouter.get(
	"/uncategorized/user/:userId",
	tickets.getUncategorizedForUser
);
ticketsRouter.get(
	"/uncategorized/group/:groupId",
	tickets.getUncategorizedForGroup
);

ticketsRouter.post("/", tickets.createTicket);
ticketsRouter.post(
	"/calendar/:filterKind?/:filterId?",
	tickets.getTicketCountsForCalendar
);

ticketsRouter.patch("/:id", tickets.updateTicket);
ticketsRouter.patch(
	"/project-edit/:projectId",
	tickets.updateTicketEditProject
);

ticketsRouter.delete("/:id", tickets.deleteTicket);
