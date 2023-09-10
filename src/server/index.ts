import "dotenv/config";
import express from "express";
import * as projects from "./controllers/projectsController";
import * as tickets from "./controllers/ticketsController";
import * as search from "./controllers/searchController";
import { verifyToken } from "../auth/middleware/verifyToken";

const PORT = 3002;

const app = express();

app.use(express.json());

// PROJECTS

app.get("/api/project", verifyToken, projects.getAllProjects);
app.get("/api/project/:id", projects.getProject);
app.post("/api/project", projects.createProject);
app.patch("/api/project/:id", projects.updateProject);
app.delete("/api/project/:id", projects.deleteProject);

// TICKETS

app.get("/api/ticket", tickets.getAllTickets);
app.get("/api/ticket/:id", tickets.getTicket);
app.get("/api/project/:id/ticket", tickets.getAllTicketsForProject);
app.post("/api/ticket", tickets.createTicket);
app.patch("/api/ticket/:id", tickets.updateTicket);
app.patch(
	"/api/ticket/project-edit/:projectId",
	tickets.updateTicketEditProject
);
app.delete("/api/ticket/:id", tickets.deleteTicket);

// SEARCH

app.get("/api/search/:query", search.getSearchResults);

app.listen(PORT, () => console.log("App server listening on PORT", PORT));
