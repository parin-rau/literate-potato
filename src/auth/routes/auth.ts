import express from "express";
import * as auth from "../controllers/authController";
import { handleRefreshToken } from "../controllers/refreshTokenController";
import { parseCookies } from "../../server/middleware/parseCookies";

export const authRouter = express.Router();

authRouter.use(express.json());

authRouter.post("/register", auth.createNewUser);
authRouter.post("/login", auth.loginUser);
authRouter.get("/logout", parseCookies, auth.logoutUser);
authRouter.post("/refresh", parseCookies, handleRefreshToken);
