import { Request, Response } from "express";
import * as searchService from "../services/mongodb/search";
import { UserRequest } from "../middleware/verifyToken";

export async function getSearchResults(
	req: Request | UserRequest,
	res: Response
) {
	const { query, filter } = req.params;
	const { user } = req as UserRequest;
	const { status, searchResults } = await searchService.getSearchResults(
		user,
		query,
		filter
	);

	return res.status(status).send(searchResults);
}
