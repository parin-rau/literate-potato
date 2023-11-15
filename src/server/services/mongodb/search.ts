import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { titleCap } from "../../../utility/charCaseFunctions";
import {
	FetchedTicketData,
	Group,
	Project,
	User,
	UserToken,
} from "../../../types";

const tickets = process.env.LOCAL_TICKETS ?? "tickets";
const projects = process.env.LOCAL_PROJECTS ?? "projects";
const groups = process.env.LOCAL_GROUPS ?? "groups";
const users = process.env.LOCAL_USERS ?? "users";

export async function getSearchResults(
	user: UserToken,
	query: string,
	filter?: string
) {
	const res: { status: number; searchResults?: unknown } = {
		status: 500,
	};

	const appendMeta = (
		sourceArray: {
			[key: string]: string | number | unknown;
		}[],
		meta: { [key: string]: string | number }
	) => {
		const resultsFormat = (source: { [key: string]: unknown }) => {
			const formatted = {
				title: source.title || source.username,
				id:
					source.ticketId ||
					source.projectId ||
					source.userId ||
					source.groupId,
				description: source.description,
				timestamp: source.timestamp,
			};
			return formatted;
		};

		const appended = sourceArray.map((s) => ({
			data: resultsFormat(s),
			meta,
		}));
		return appended;
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const ticketColl = db.collection<FetchedTicketData>(tickets);
		const projectColl = db.collection<Project>(projects);
		const groupColl = db.collection<Group>(groups);
		const userColl = db.collection<User>(users);

		const getPermittedGroups = async () => {
			const foundGroups = await userColl
				.findOne({ userId: user.userId })
				.then((u) => u?.groupIds);

			return foundGroups;
		};

		const findSubtasks = async () => {
			const permittedGroups = await getPermittedGroups();
			const foundTickets = await ticketColl
				.find({
					"group.groupId": { $in: permittedGroups },
					$or: [
						{ "subtasks.subtaskId": query },
						{ "subtasks.description": query },
						{ "subtasks.completed": query },
					],
				})
				.toArray()
				.then((t) => appendMeta(t, { kind: "subtask" }));

			return foundTickets;
		};

		const findCompletedSubtasksByUserId = async () => {
			const permittedGroups = await getPermittedGroups();
			const completedSubtaskIds = await userColl
				.findOne({ userId: query })
				.then((u) => u?.subtaskIds.completed);
			const foundTickets = await ticketColl
				.find({
					"group.groupId": { $in: permittedGroups },
					"subtasks.subtaskId": { $in: completedSubtaskIds },
				})
				.toArray()
				.then((t) => appendMeta(t, { kind: "ticket" }));

			return foundTickets;
		};

		const findTickets = async () => {
			const permittedGroups = await getPermittedGroups();
			const foundTickets = await ticketColl
				.find({
					"group.groupId": { $in: permittedGroups },
					$or: [
						{ title: query },
						{ "project.projectTitle": query },
						{ "project.projectId": query },
						{ "creator.username": query },
						{ "creator.userId": query },
						{ "assignee.username": query },
						{ "assignee.userId": query },
						{ description: query },
						{ tags: titleCap(query) },
						{ due: query },
					],
				})
				.toArray()
				.then((t) => appendMeta(t, { kind: "ticket" }));

			return foundTickets;
		};

		const findCompletedTicketsByUserId = async () => {
			const permittedGroups = await getPermittedGroups();
			const completedTicketIds = await userColl
				.findOne({ userId: query })
				.then((u) => u?.ticketIds.completed);
			const foundTickets = await ticketColl
				.find({
					"group.groupId": { $in: permittedGroups },
					ticketId: { $in: completedTicketIds },
				})
				.toArray()
				.then((t) => appendMeta(t, { kind: "ticket" }));

			return foundTickets;
		};

		const findProjects = async () => {
			const permittedGroups = await getPermittedGroups();
			const foundProjects = await projectColl
				.find({
					"group.groupId": { $in: permittedGroups },
					$or: [
						{ title: query },
						{ project: query },
						{ "creator.username": query },
						{ "creator.userId": query },
						{ description: query },
					],
				})
				.toArray()
				.then((p) => appendMeta(p, { kind: "project" }));

			return foundProjects;
		};

		const findGroups = async () => {
			const foundGroups = await groupColl
				.find({
					$or: [
						{ title: query },
						{ "manager.name": query },
						{ "manager.userId": query },
					],
				})
				.toArray()
				.then((g) => appendMeta(g, { kind: "group" }));

			return foundGroups;
		};

		const findUsers = async () => {
			const foundUsers = await userColl
				.find({
					$or: [{ username: query }, { userId: query }],
				})
				.toArray()
				.then((u) => appendMeta(u, { kind: "user" }));

			return foundUsers;
		};

		if (filter) {
			switch (filter) {
				case "subtask": {
					const foundTickets = await findSubtasks();
					await client.close();

					res.status = 200;
					res.searchResults = foundTickets;
					return res;
				}
				case "subtask-by-user-id": {
					const foundTickets = await findCompletedSubtasksByUserId();
					await client.close();

					res.status = 200;
					res.searchResults = foundTickets;
					return res;
				}
				case "ticket": {
					const foundTickets = await findTickets();
					await client.close();

					res.status = 200;
					res.searchResults = foundTickets;
					return res;
				}
				case "ticket-by-user-id": {
					const foundTickets = await findCompletedTicketsByUserId();
					await client.close();

					res.status = 200;
					res.searchResults = foundTickets;
					return res;
				}
				case "project": {
					const foundProjects = await findProjects();
					await client.close();

					res.status = 200;
					res.searchResults = foundProjects;
					return res;
				}
				default:
					res.status = 200;
					return res;
			}
		} else {
			{
				const foundSubtaskParents = await findSubtasks();
				const foundTickets = await findTickets();
				const foundProjects = await findProjects();
				const foundGroups = await findGroups();
				const foundUsers = await findUsers();

				await client.close();

				res.status = 200;
				res.searchResults = [
					...foundSubtaskParents,
					...foundTickets,
					...foundProjects,
					...foundGroups,
					...foundUsers,
				];

				return res;
			}
		}
	} catch (e) {
		console.error(e);
		return res;
	}
}
