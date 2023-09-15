import express from "express";
import * as auth from "../controllers/authController";
import { handleRefreshToken } from "../controllers/refreshTokenController";

export const authRouter = express.Router();

authRouter.post("/register", auth.createNewUser);
authRouter.post(
	"/login",
	(_req, _res, next) => {
		console.log("login post");
		next();
	},
	auth.loginUser
);
authRouter.get("/logout", auth.logoutUser);
authRouter.post("/refresh", handleRefreshToken);
