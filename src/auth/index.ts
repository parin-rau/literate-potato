import express from "express";
import "dotenv/config";

import {
	createNewUser,
	loginUser,
	logoutUser,
} from "./controllers/authController";

const PORT = 4002;

const app = express();

app.use(express.json());

app.post("/auth/register", createNewUser);
app.post("/auth/login", loginUser);
app.get("/auth/logout", logoutUser);

app.listen(PORT, () => console.log("Auth server listening on PORT", PORT));
