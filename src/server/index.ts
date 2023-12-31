import "dotenv/config";
import express from "express";
import { verifyToken } from "./middleware/verifyToken";
import { parseCookies } from "./middleware/parseCookies";
import { projectsRouter } from "./routes/projects";
import { searchRouter } from "./routes/search";
import { ticketsRouter } from "./routes/tickets";
import { commentsRouter } from "./routes/comments";
import { groupsRouter } from "./routes/groups";
import { usersRouter } from "./routes/users";
import { notificationsRouter } from "./routes/notifications";

const PORT = 3002;

const app = express();

app.use(express.json());
app.use(parseCookies);
app.use(verifyToken);

app.use("/api/group", groupsRouter);
app.use("/api/user", usersRouter);
app.use("/api/project", projectsRouter);
app.use("/api/ticket", ticketsRouter);
app.use("/api/comment", commentsRouter);
app.use("/api/search", searchRouter);
app.use("/api/notification", notificationsRouter);

app.listen(PORT, () => console.log("App server listening on PORT", PORT));
