import express from "express";
import * as comments from "../controllers/commentsController";

export const commentsRouter = express.Router();

commentsRouter.get("/ticket/:ticketId", comments.getTicketComments);

commentsRouter.post("/ticket/:ticketId", comments.createNewComment);
