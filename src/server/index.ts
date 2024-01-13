import "dotenv/config";
import express from "express";
import cors from "cors";
import { verifyToken } from "./middleware/verifyToken";
import { parseCookies } from "./middleware/parseCookies";
import { projectsRouter } from "./routes/projects";
import { searchRouter } from "./routes/search";
import { ticketsRouter } from "./routes/tickets";
import { commentsRouter } from "./routes/comments";
import { groupsRouter } from "./routes/groups";
import { usersRouter } from "./routes/users";
import { notificationsRouter } from "./routes/notifications";
import { adminRouter } from "./routes/admin";

const PORT = 3002;

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
app.use(verifyToken);

app.use("/api/group", groupsRouter);
app.use("/api/user", usersRouter);
app.use("/api/project", projectsRouter);
app.use("/api/ticket", ticketsRouter);
app.use("/api/comment", commentsRouter);
app.use("/api/search", searchRouter);
app.use("/api/notification", notificationsRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT, () => console.log("App server listening on PORT", PORT));
