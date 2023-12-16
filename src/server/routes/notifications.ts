import express from "express";
import * as notifications from "../controllers/notificationsController";

export const notificationsRouter = express.Router();

notificationsRouter.get(
	"/:userId/:filter?",
	notifications.getNotificationsByUser
);

notificationsRouter.post("/id", notifications.createNotification);

notificationsRouter.patch("/:id", notifications.patchNotification);

notificationsRouter.delete("/id", notifications.deleteNotification);
