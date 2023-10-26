import { Router } from "express";
import * as users from "../controllers/usersController";

export const usersRouter = Router();

//usersRouter.get("/", users.getCurrentUser)
usersRouter.get("/:id", users.getUserById);
usersRouter.get("/group/:groupId/:kind?", users.getUsersByGroup);

usersRouter.patch("/:id", users.updateUser);

usersRouter.delete("/:id", users.deleteUser);
