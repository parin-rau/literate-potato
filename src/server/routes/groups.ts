import express from "express";
import * as groups from "../controllers/groupsController";

export const groupsRouter = express.Router();

groupsRouter.get("/", groups.getAllGroups);
groupsRouter.get("/:id", groups.getGroup);
groupsRouter.get("/user/:userId", groups.getGroupsByUserId);

groupsRouter.post("/", groups.createGroup);

groupsRouter.patch("/:id", groups.updateGroup);
groupsRouter.patch("/:groupId/user/:userId/:action", groups.joinGroup);

groupsRouter.delete("/:id", groups.deleteGroup);
