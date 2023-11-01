import express from "express";
import * as comments from "../controllers/commentsController";

export const commentsRouter = express.Router();

commentsRouter.get("/ticket/:ticketId", comments.getTicketComments);

commentsRouter.post("/", comments.createComment);

commentsRouter.patch("/:id", comments.editComment);
commentsRouter.patch("/:id/:action/:userId", comments.reactComment);

commentsRouter.delete("/:id", comments.deleteComment);
