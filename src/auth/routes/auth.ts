import express from "express";
import * as auth from "../controllers/authController";
import { handleRefreshToken } from "../controllers/refreshTokenController";

export const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post("/register", auth.createNewUser);
authRouter.post("/login", auth.loginUser);
authRouter.get("/logout", auth.logoutUser);
authRouter.post("/refresh", handleRefreshToken);
