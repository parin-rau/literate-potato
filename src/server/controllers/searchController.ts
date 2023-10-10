import { Request, Response } from "express";
import * as searchService from "../services/mongodb/search";

export async function getSearchResults(req: Request, res: Response) {
	const { query } = req.params;
	const { status, searchResults } = await searchService.getSearchResults(
		query
	);

	return res.status(status).send(searchResults);
}
