import "dotenv/config";
import { MongoClient, ServerApiVersion } from "mongodb";
import * as mongoDB from "mongodb";

const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
};

const MONGODB_URL =
	process.env.ENV === "PROD"
		? process.env.PROD_MONGO_URL
		: process.env.LOCAL_MONGO_URL;

export async function connectToDatabase() {
	if (!MONGODB_URL) {
		throw new Error("Add Mongo URI to .env.local");
	}

	const client: mongoDB.MongoClient = new MongoClient(MONGODB_URL, options);
	return client.connect();
}
