import express from "express";
import { authRouter } from "./routes/auth";
import { parseCookies } from "../server/middleware/parseCookies";

const PORT = 4002;

const app = express();

app.use(express.json());
app.use(parseCookies);

app.use("/auth", authRouter);

app.get("/test", (_req, res) => {
	console.log("TESTING");
	res.send("Hiya");
});

app.listen(PORT, () => console.log("Auth server listening on PORT", PORT));
