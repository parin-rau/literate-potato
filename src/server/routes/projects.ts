import express from "express";
import * as projects from "../controllers/projectsController";

export const projectsRouter = express.Router();

projectsRouter.get("/", projects.getAllProjects);
projectsRouter.get("/user/:userId", projects.getProjectsByUser);
projectsRouter.get("/group/:groupId", projects.getProjectsByGroup);
projectsRouter.get("/:id", projects.getProject);

projectsRouter.post("/", projects.createProject);

projectsRouter.patch("/:id", projects.updateProject);

projectsRouter.delete("/:id", projects.deleteProject);
