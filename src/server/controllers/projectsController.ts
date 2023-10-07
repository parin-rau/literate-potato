import "dotenv/config";
import { Request, Response } from "express";
import * as mongoDB from "mongodb";
import { connectToDatabase } from "../../db/mongodb";

const localProjects = process.env.LOCAL_PROJECTS ?? "projects";

export async function getProject(req: Request, res: Response) {
	try {
		const id = req.params.id;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);
		const project = await coll.findOne({ projectId: id });
		await client.close();
		res.status(200).send(project);
	} catch (err) {
		console.error(err);
	}
}

export async function getAllProjects(_req: Request, res: Response) {
	try {
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);
		const projects = await coll.find().limit(50).toArray();
		await client.close();
		res.status(200).send(projects);
	} catch (err) {
		console.error(err);
	}
}

export async function createProject(req: Request, res: Response) {
	try {
		const newProject = await req.body;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);
		const result = await coll.insertOne(newProject);
		await client.close();
		res.status(200).send(result);
	} catch (err) {
		console.error(err);
	}
}

export async function updateProject(req: Request, res: Response) {
	try {
		const id = req.params.id;
		const data:
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
			  } = await req.body;

		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);

		const setTaskCompletion = async () => {
			const { operation } = data;
			console.log("data", data);

			if (operation !== "add" && operation !== "delete")
				return console.log(
					"newTaskStatus not defined for current operation"
				);

			const { newTaskStatus } = data;
			if (!newTaskStatus)
				return console.log("newTaskStatus not defined in req body");

			console.log("newTaskStatus", newTaskStatus);

			if (newTaskStatus !== "Completed") {
				try {
					const result = await coll.updateOne(
						{ projectId: id },
						{
							$pullAll: {
								tasksCompletedIds: data.tasksCompletedIds ?? [],
							},
						}
					);
					return result;
				} catch (e) {
					console.error(e);
				}
			} else {
				try {
					const result = await coll.updateOne(
						{ projectId: id },
						{
							$addToSet: {
								tasksCompletedIds: {
									$each: data.tasksCompletedIds ?? [],
								},
							},
						}
					);
					return result;
				} catch (e) {
					console.error(e);
				}
			}
		};

		if (data.operation === "metadata") {
			const { metadata } = data;
			const result = await coll.updateOne(
				{ projectId: id },
				{ $set: { ...metadata, lastModified: Date.now() } }
			);
			await client.close();
			res.status(200).send(result);
		}
		// else if (
		// 	data.operation === "add" &&
		// 	data.secondaryOperation === "delete"
		// ) {
		// 	console.log("remove ticket id from completed task counter");
		// }
		else if (data.operation === "add") {
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
			res.status(200).send({ result1, result2 });
		} else if (data.operation === "delete") {
			const result1 = await coll.updateOne(
				{ projectId: id },
				{
					$pullAll: {
						tasksCompletedIds: data.tasksCompletedIds ?? [],
						tasksTotalIds: data.tasksTotalIds ?? [],
						subtasksCompletedIds: data.subtasksCompletedIds ?? [],
						subtasksTotalIds: data.subtasksTotalIds ?? [],
					},
					$set: { lastModified: Date.now() },
				}
			);

			const result2 = await setTaskCompletion();

			await client.close();
			res.status(200).send({ result1, result2 });
		} else {
			await client.close();
			res.status(400).send();
		}
	} catch (err) {
		console.error(err);
	}
}

export async function deleteProject(req: Request, res: Response) {
	try {
		const id = req.params.id;
		const client: mongoDB.MongoClient = await connectToDatabase();
		const db: mongoDB.Db = client.db(process.env.VITE_LOCAL_DB);
		const coll: mongoDB.Collection = db.collection(localProjects);
		const result = await coll.deleteOne({ projectId: id });
		await client.close();
		res.status(200).send(result);
	} catch (err) {
		console.error(err);
	}
}
