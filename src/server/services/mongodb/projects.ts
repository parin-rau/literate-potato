import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { Group, Project, User, UserToken } from "../../../types";

const projectsColl = process.env.LOCAL_PROJECTS ?? "projects";
const groupsColl = process.env.LOCAL_GROUPS ?? "groups";
const usersColl = process.env.LOCAL_USERS ?? "users";

const getPermittedGroups = async (
	userId: string,
	usersColl: mongoDB.Collection<User>
) => {
	const permittedGroups = await usersColl
		.findOne({ userId })
		.then((u) => u?.groupIds);
	return permittedGroups;
};

export async function getProject(id: string, user: UserToken) {
	const res: { status: number; success: boolean; project: unknown } = {
		status: 500,
		success: false,
		project: {},
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const projects = db.collection<Project>(projectsColl);
		const users = db.collection<User>(usersColl);

		const permittedGroups = await getPermittedGroups(user.userId, users);

		const project = await projects.findOne({ projectId: id });
		await client.close();

		if (project && !permittedGroups?.includes(project.group.groupId)) {
			res.status = 250;
			return res;
		}

		res.status = 200;
		res.success = true;
		res.project = project;

		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getAllProjects(user: UserToken) {
	const res: { status: number; success: boolean; projects: unknown[] } = {
		status: 500,
		success: false,
		projects: [],
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection<Project>(projectsColl);
		const users = db.collection<User>(usersColl);

		const permittedGroups = await getPermittedGroups(user.userId, users);

		const projects = await coll.find().toArray();
		await client.close();

		if (
			!projects.every((p) => permittedGroups?.includes(p.group.groupId))
		) {
			res.status = 250;
			return res;
		}

		res.status = 200;
		res.success = true;
		res.projects = projects;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getProjectsByUser(
	userId: string,
	options?: { limit: number; sort: { field: string; direction: 1 | -1 } }
) {
	const res: { status: number; success: boolean; projects: unknown[] } = {
		status: 500,
		success: false,
		projects: [],
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const projects = db.collection<Project>(projectsColl);
		const users = db.collection<User>(usersColl);

		const foundGroups = await getPermittedGroups(userId, users);

		if (!foundGroups) return res;

		const foundProjects = await projects
			.find({ "group.groupId": { $in: foundGroups } })
			.toArray();
		await client.close();

		if (options?.sort.field === "completion") {
			const closestToCompletion = foundProjects
				.map((p) => ({
					project: p,
					completion:
						p.tasksCompletedIds.length / p.subtasksTotalIds.length,
				}))
				.filter((p) => p.completion < 1)
				.sort((a, b) =>
					options.sort.direction === -1
						? b.completion - a.completion
						: a.completion - b.completion
				)
				.slice(0, 8)
				.map((p) => p.project);

			res.status = 200;
			res.success = true;
			res.projects = closestToCompletion;
		}

		res.status = 200;
		res.success = true;
		res.projects = foundProjects;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getProjectsByGroup(groupId: string, user: UserToken) {
	const res: { status: number; success: boolean; projects: unknown[] } = {
		status: 500,
		success: false,
		projects: [],
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll = db.collection<Project>(projectsColl);
		const users = db.collection<User>(usersColl);

		const permittedGroups = await getPermittedGroups(user.userId, users);

		const projects = await coll
			.find({ "group.groupId": groupId })
			.toArray();
		await client.close();

		if (
			!projects.every((p) => permittedGroups?.includes(p.group.groupId))
		) {
			res.status = 250;
			return res;
		}

		res.status = 200;
		res.success = true;
		res.projects = projects;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function createProject(newProject: Project) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client = await connectToDatabase();
		const db = client.db(process.env.VITE_LOCAL_DB);
		const projects = db.collection<Project>(projectsColl);
		const groups = db.collection<Group>(groupsColl);

		const result1 = await projects.insertOne(newProject);
		const result2 = await groups.updateOne(
			{ groupId: newProject.group.groupId },
			{ $addToSet: { projectIds: newProject.projectId } }
		);
		await client.close();

		res.status = 201;
		res.success = result1.acknowledged && result2.acknowledged;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function updateProject(
	id: string,
	data:
		| {
				operation: "add" | "delete";
				newTaskStatus?: string;
				tasksCompletedIds?: string[];
				tasksTotalIds?: string[];
				subtasksCompletedIds?: string[];
				subtasksTotalIds?: string[];
		  }
		| {
				operation: "metadata";
				metadata: {
					[key: string]: string | number;
				};
		  }
) {
	const res: { status: number; success: boolean; message?: string } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(projectsColl);

		// TASK COMPLETION HELPER
		const setTaskCompletion = async () => {
			const result: { success: boolean; message?: string } = {
				success: false,
			};

			const { operation } = data;

			if (operation !== "add" && operation !== "delete") {
				result.message =
					"newTaskStatus not defined for current operation";
				result.success = true;
				return result;
			}

			const { newTaskStatus } = data;

			if (!newTaskStatus) {
				result.message = "newTaskStatus not defined in req body";
				result.success = true;
				return result;
			}

			if (newTaskStatus !== "Completed" || operation === "delete") {
				try {
					const updateResult = await coll.updateOne(
						{ projectId: id },
						{
							$pullAll: {
								tasksCompletedIds: data.tasksCompletedIds ?? [],
							},
						}
					);

					result.success = updateResult.acknowledged;
					return result;
				} catch (e) {
					console.error(e);
					return result;
				}
			} else {
				try {
					const updateResult = await coll.updateOne(
						{ projectId: id },
						{
							$addToSet: {
								tasksCompletedIds: {
									$each: data.tasksCompletedIds ?? [],
								},
							},
						}
					);
					result.success = updateResult.acknowledged;
					return result;
				} catch (e) {
					console.error(e);
					return result;
				}
			}
		};

		//OVERALL UPDATE OUTPUT

		switch (data.operation) {
			case "metadata": {
				const { metadata } = data;
				const result = await coll.updateOne(
					{ projectId: id },
					{ $set: { ...metadata, lastModified: Date.now() } }
				);
				await client.close();

				res.status = 200;
				res.success = result.acknowledged;
				return res;
			}

			case "add": {
				const result1 = await coll.updateOne(
					{ projectId: id },
					{
						$addToSet: {
							tasksCompletedIds: {
								$each: data.tasksCompletedIds ?? [],
							},
							tasksTotalIds: {
								$each: data.tasksTotalIds ?? [],
							},
							subtasksCompletedIds: {
								$each: data.subtasksCompletedIds ?? [],
							},
							subtasksTotalIds: {
								$each: data.subtasksTotalIds ?? [],
							},
						},
					}
				);

				const result2 = await setTaskCompletion();

				await client.close();

				res.status =
					result1.acknowledged && result2.success ? 200 : 400;
				res.success = result1.acknowledged && result2.success;
				res.message = result2.message ?? "";
				return res;
			}
			case "delete": {
				const result1 = await coll.updateOne(
					{ projectId: id },
					{
						$pullAll: {
							tasksCompletedIds: data.tasksCompletedIds ?? [],
							tasksTotalIds: data.tasksTotalIds ?? [],
							subtasksCompletedIds:
								data.subtasksCompletedIds ?? [],
							subtasksTotalIds: data.subtasksTotalIds ?? [],
						},
						$set: { lastModified: Date.now() },
					}
				);

				const result2 = await setTaskCompletion();

				await client.close();

				res.status =
					result1.acknowledged && result2.success ? 200 : 400;
				res.success = result1.acknowledged && result2.success;
				res.message = result2.message ?? "";
				return res;
			}
			default: {
				await client.close();
				res.status = 400;
				return res;
			}
		}
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function deleteProject(id: string) {
	const res: { status: number; success: boolean } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const projects = db.collection<Project>(projectsColl);
		const groups = db.collection<Group>(groupsColl);

		const result1 = await projects.deleteOne({ projectId: id });
		const result2 = await groups.updateOne(
			{ projectIds: id },
			{ $pull: { projectIds: id } }
		);
		await client.close();

		res.success = result1.acknowledged && result2.acknowledged;
		res.status = 200;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}
