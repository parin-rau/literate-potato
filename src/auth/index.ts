import express from "express";
import "dotenv/config";

import * as auth from "./controllers/authController";
import { parseCookies } from "../server/middleware/parseCookies";

const PORT = 4002;

const app = express();

app.use(express.json());
app.use(parseCookies);

app.post("/auth/register", auth.createNewUser);
app.post("/auth/login", auth.loginUser);
app.get("/auth/logout", auth.logoutUser);

app.listen(PORT, () => console.log("Auth server listening on PORT", PORT));
