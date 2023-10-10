import "dotenv/config";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../../db/mongodb";
import { Project } from "../../../types";

const localProjects = process.env.LOCAL_PROJECTS ?? "projects";

export async function getProject(id: string) {
	const res: { status: number; success: boolean; project?: unknown } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);

		const project = await coll.findOne({ projectId: id });
		await client.close();

		res.status = 200;
		res.success = true;
		res.project = project;

		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}

export async function getAllProjects() {
	const res: { status: number; success: boolean; projects?: unknown[] } = {
		status: 500,
		success: false,
	};

	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);

		const projects = await coll.find().limit(50).toArray();
		await client.close();

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
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);

		const result = await coll.insertOne(newProject);
		await client.close();

		res.status = 201;
		res.success = result.acknowledged;
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
		const coll: mongoDB.Collection = db.collection(localProjects);

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

			console.log(newTaskStatus);
			if (!newTaskStatus) {
				result.message = "newTaskStatus not defined in req body";
				result.success = true;
				return result;
			}

			if (newTaskStatus !== "Completed") {
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
		const coll: mongoDB.Collection = db.collection(localProjects);
		const result = await coll.deleteOne({ projectId: id });
		await client.close();

		res.success = result.acknowledged;
		res.status = 200;
		return res;
	} catch (err) {
		console.error(err);
		return res;
	}
}
