import express from "express";
import "dotenv/config";
import { authRouter } from "./routes/auth";

const PORT = 4002;

const app = express();

app.use(express.json());
app.use("/auth", authRouter);

app.listen(PORT, () => console.log("Auth server listening on PORT", PORT));
