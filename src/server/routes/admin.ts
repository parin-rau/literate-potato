import express from "express";
import * as admin from "../controllers/adminController";

export const adminRouter = express.Router();

adminRouter.get("/stats", admin.getStats);

adminRouter.get("/:resourceType/:resrouceId?", admin.getResource);
adminRouter.delete("/:resourceType/:resourceId", admin.deleteResource);
