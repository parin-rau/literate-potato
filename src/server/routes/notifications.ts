import express from "express";
import * as notifications from "../controllers/notificationsController";

export const notifactionsRouter = express.Router();

notifactionsRouter.get(
	"/:userId/:filter?",
	notifications.getNotificationsByUser
);

notifactionsRouter.patch("/:id", notifications.patchNotification);
