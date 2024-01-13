import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth";
import { parseCookies } from "../server/middleware/parseCookies";

const PORT = 4002;

const app = express();

app.use(express.json());
app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://literate-potato.onrender.com/register",
			"http://literate-potato.onrender.com/register",
		],
		//credentials: true,
	})
);
app.use(parseCookies);

app.use("/auth", authRouter);

app.listen(PORT, () => console.log("Auth server listening on PORT", PORT));
