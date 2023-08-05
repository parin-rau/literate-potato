import { MongoClient, ServerApiVersion } from "mongodb";

const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
};

const MONGODB_URL = import.meta.env.VITE_LOCAL_MONGO_URL;

export async function connectToDB() {
	if (!MONGODB_URL) {
		throw new Error("Add Mongo URI to .env.local");
	}

	const client = new MongoClient(MONGODB_URL, options);
	return client.connect();
}
