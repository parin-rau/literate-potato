import express from "express";
import * as groups from "../controllers/groupsController";

export const groupsRouter = express.Router();

groupsRouter.get("/", groups.getAllGroups);
groupsRouter.get("/:id", groups.getGroup);

groupsRouter.post("/", groups.createGroup);

groupsRouter.patch("/:id", groups.updateGroup);

groupsRouter.delete("/:id", groups.deleteGroup);
